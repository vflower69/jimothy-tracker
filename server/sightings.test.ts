import { describe, expect, it, vi } from "vitest";
import type { TrpcContext } from "./_core/context";

const dbMocks = vi.hoisted(() => ({
  createSighting: vi.fn(),
  listSightings: vi.fn(),
}));

vi.mock("./db", () => dbMocks);

import { appRouter } from "./routers";

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("public sightings", () => {
  it("returns public sightings in the order supplied by the data layer", async () => {
    const sightings = [
      {
        id: 2,
        location: "Riverside path",
        latitude: 40.71,
        longitude: -74.01,
        sightedAt: 1_742_000_000_000,
        note: null,
        createdAt: new Date("2025-03-01T12:00:00.000Z"),
      },
    ];
    dbMocks.listSightings.mockResolvedValueOnce(sightings);

    const caller = appRouter.createCaller(createPublicContext());
    await expect(caller.sightings.list()).resolves.toEqual(sightings);
  });

  it("accepts a valid public sighting and normalizes a blank note", async () => {
    const submitted = {
      location: "Riverside path",
      latitude: 40.71,
      longitude: -74.01,
      sightedAt: Date.now() - 60_000,
      note: null,
      id: 3,
      createdAt: new Date(),
    };
    dbMocks.createSighting.mockResolvedValueOnce(submitted);

    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.sightings.create({
      location: " Riverside path ",
      latitude: 40.71,
      longitude: -74.01,
      sightedAt: submitted.sightedAt,
      note: "   ",
    });

    expect(dbMocks.createSighting).toHaveBeenCalledWith({
      location: "Riverside path",
      latitude: 40.71,
      longitude: -74.01,
      sightedAt: submitted.sightedAt,
      note: null,
    });
    expect(result).toEqual(submitted);
  });

  it("rejects sightings dated materially in the future", async () => {
    const caller = appRouter.createCaller(createPublicContext());

    await expect(
      caller.sightings.create({
        location: "Riverside path",
        latitude: 40.71,
        longitude: -74.01,
        sightedAt: Date.now() + 10 * 60 * 1000,
      }),
    ).rejects.toMatchObject({
      code: "BAD_REQUEST",
      message: "A sighting time cannot be in the future.",
    });
  });
});
