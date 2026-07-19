import { COOKIE_NAME } from "@shared/const";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createSighting, listSightings } from "./db";
import { storagePut } from "./storage";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  sightings: router({
    list: publicProcedure.query(() => listSightings()),
    create: publicProcedure
      .input(
        z.object({
          location: z.string().trim().min(2).max(500),
          latitude: z.number().finite().min(-90).max(90),
          longitude: z.number().finite().min(-180).max(180),
          sightedAt: z.number().int().positive(),
          note: z.string().trim().max(1000).optional(),
          imageBase64: z.string().optional(),
          imageMimeType: z.string().optional(),
        }),
      )
      .mutation(async ({ input }) => {
        if (input.sightedAt > Date.now() + 5 * 60 * 1000) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "A sighting time cannot be in the future.",
          });
        }

        let imageKey: string | null = null;
        if (input.imageBase64 && input.imageMimeType) {
          try {
            const buffer = Buffer.from(input.imageBase64, "base64");
            const maxSize = 5 * 1024 * 1024; // 5 MB
            if (buffer.length > maxSize) {
              throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Image size exceeds 5 MB limit.",
              });
            }

            const fileName = `sighting-${Date.now()}-${Math.random().toString(36).slice(2, 9)}.jpg`;
            const { key } = await storagePut(
              `sightings/${fileName}`,
              buffer,
              input.imageMimeType,
            );
            imageKey = key;
          } catch (error) {
            if (error instanceof TRPCError) throw error;
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Failed to upload image.",
            });
          }
        }

        return createSighting({
          location: input.location,
          latitude: input.latitude,
          longitude: input.longitude,
          sightedAt: input.sightedAt,
          note: input.note || null,
          imageKey,
        });
      }),
  }),
});

export type AppRouter = typeof appRouter;
