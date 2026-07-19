# Project TODO

- [x] Preserve the exact product name "Jimothy the Raccoon Tracker" throughout the public interface
- [x] Create a public, welcoming landing page with a refined playful visual identity
- [x] Add a persistent sighting data model for location, latitude, longitude, sighting time, optional note, and creation time
- [x] Create and apply the database migration for persistent sightings
- [x] Add public server procedures to list and submit sightings with input validation
- [x] Build an interactive map that renders all submitted sightings as markers
- [x] Add location search and reverse geocoding so a place name can resolve to coordinates
- [x] Provide a public sighting form for location, date/time, and an optional note
- [x] Display submitted sightings immediately in both the map and chronological feed without a page reload
- [x] Build an accessible chronological sighting feed with location, time, and notes
- [x] Add loading, empty, success, and validation-error states across the public experience
- [x] Add and run Vitest coverage for public sighting behavior
- [x] Visually verify desktop and mobile layouts and correct presentation issues
- [x] Add a clear chronological-feed error state when public sightings cannot load
- [x] Surface map initialization failures with a visible retry message

## Image Upload Feature

- [ ] Add optional imageUrl field to the sightings database table
- [ ] Create and apply the database migration for image storage
- [ ] Add S3 upload helper to the sighting creation procedure
- [ ] Add image upload input and preview to the public sighting form
- [ ] Validate image file size and format before upload
- [ ] Display sighting images in the chronological feed
- [ ] Add image preview to map marker popups
- [ ] Test image upload with various file sizes and formats
