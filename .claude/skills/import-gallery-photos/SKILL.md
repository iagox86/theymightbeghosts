---
name: import-gallery-photos
description: Import new photos into the site's photo gallery (assets/img/gallery/) -- converts any raw or lossless format to JPG, renames files with a date prefix so they sort correctly, and generates thumbnails. Use when asked to "add these photos to the gallery", "import photos from <folder>", or "convert and add these photos".
---

# Import gallery photos

Imports a folder of new photos into `assets/img/gallery/`, the source this
site's `gallery.md` scans to build the photo grid.

Most imports are already JPGs straight off a phone/camera -- those just need
the rename + thumbnail steps below, nothing to convert. Occasionally a batch
comes in as a raw or lossless format instead (HEIC/HEIF from an iPhone, TIFF,
BMP, a camera RAW format like CR2/NEF/ARW/DNG, etc.) -- convert those to JPG
first. Don't assume HEIC specifically; convert whatever non-JPG format shows
up. If a lossless image looks like it's meant as a graphic/screenshot rather
than a photo (e.g. a PNG that needs transparency), ask before converting it --
the site does use PNG/WebP intentionally elsewhere (show posters, logo).

## Why filenames, not EXIF-based sorting in Jekyll

`gallery.md` sorts photos implicitly, by filename (Jekyll enumerates
`site.static_files` in path order). Existing photos are named
`YYYY-MM-DD-<original-name>.<ext>` for exactly this reason.

Don't try to sort by embedded EXIF date at build time instead (e.g. via
Jekyll's `modified_time`) -- **git does not preserve file modification
times**. Every fresh clone/checkout (including whatever GitHub Pages does to
build and deploy this site) gives every file the same checkout-time mtime,
which would silently break that sort order. The date has to live in the
filename, not the filesystem, to survive deployment.

## Steps

1. **Confirm the source directory** with the user if it wasn't given.

2. **Check for required tools**, and if any are missing, tell the user what's
   needed and ask before installing (system package installs always need
   explicit confirmation, regardless of mode):
   - `exiftool` -- package `perl-Image-ExifTool`
   - `identify`/`convert` (ImageMagick) -- handles conversion for most
     lossless/raw formats (TIFF, BMP, many camera RAW formats, etc.)
   - For HEIC/HEIF specifically: `heif-convert` (package `libheif-tools`).
     Note stock Fedora's `libheif` ships with *no* HEIC decoder plugin at all
     -- `heif-convert --list-decoders` will show an empty "HEIC decoders:"
     section if so. Decoding needs `libheif-freeworld` + `libde265` from the
     RPM Fusion `free` repo. Confirm RPM Fusion is enabled before assuming
     these are reachable; if not, tell the user rather than silently failing.
     This is a Fedora-specific wrinkle, not something to expect on every
     system.

3. **For each photo that needs a date prefix** (anything not already named
   `YYYY-MM-DD-...`):
   - Read the capture date: `exiftool -T -DateTimeOriginal <file>`
   - Format it as `YYYY-MM-DD` (the exiftool output uses `:` as the date
     separator -- convert to `-`)
   - Already a JPG: just copy/rename it into
     `assets/img/gallery/<date>-<original-basename>.jpg`
   - Any other raw/lossless format: convert straight to the final
     destination name in one step (e.g. `heif-convert -q 90 <src>
     assets/img/gallery/<date>-<original-basename>.jpg` for HEIC/HEIF, or
     `convert <src> assets/img/gallery/<date>-<original-basename>.jpg` for
     most other formats)
   - If a file has no EXIF date at all, ask the user for the date rather
     than guessing from file mtime (mtime reflects whenever the file was
     last copied/touched, not when the photo was taken).

4. **Verify each converted image**: `identify` should succeed on every
   output file, and orientation should look correct (check one with the
   Read tool) -- conversion normally bakes in EXIF rotation, but confirm
   rather than assuming, since a bad decoder/library combination can produce
   sideways images.

5. **Generate thumbnails**: run `./make-thumbnails.sh` from the repo root.
   It already skips regenerating thumbnails that already exist, so it's
   safe to run repeatedly and only processes the new photos.

6. **Verify the gallery**: run `bundle exec jekyll build` to a scratch
   destination (not the repo's own `_site`) and confirm the new photos
   appear in the built `gallery/index.html`, in the right position relative
   to existing dated photos.

7. **Don't `git add`/commit** unless the user asks -- leave the new files
   staged in the working tree for them to review.

## When a file has no EXIF and mtime is useless

File mtime is frequently **not** a usable fallback, even though it looks like
one -- git doesn't preserve modification times, so every file checked out of
this repo tends to share one meaningless "checkout day" mtime. Check for that
before trusting it (e.g. `stat` a few files and see if they're suspiciously
identical).

When EXIF is missing, prefer these over mtime, in order:

1. **The original filename's own embedded timestamp**, if it has one. Phone
   camera default names often encode real capture time:
   - `IMG_YYYYMMDD_HHMMSS...` (Apple/many Android cameras) -- local device
     time, use directly.
   - `PXL_YYYYMMDD_HHMMSS...` (Google Pixel) -- **UTC**, not local time.
     Convert to Pacific before using, matching the rest of the site's
     convention (PDT/UTC-7 roughly mid-March to early November, PST/UTC-8
     otherwise). Sanity-check any one of these against its own EXIF if
     available -- if the file has no EXIF at all, converting a batch of
     `PXL_` filenames consistently is still far better than not converting.
   - Partial dates (year-month only, no day) can sometimes be inferred from
     context -- e.g. a filename matching a specific past show's name/theme,
     cross-checked against `_data/events.yml` for that show's date. Confirm
     this kind of inference with the user rather than assuming it silently.
2. **Ask the user** if there's truly no signal at all (generic names like
   `image0.webp` from a messaging app export, no EXIF, no embedded
   timestamp). Don't fabricate a date.
3. **mtime, only as an explicit last resort the user has agreed to**, and
   only after confirming it isn't just a uniform checkout-day artifact.
