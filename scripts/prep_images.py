#!/usr/bin/env python3
"""
Prepare site images from the originals in assets/images/_originals.

Each original at assets/images/_originals/<path> is written to
assets/images/_2kpx/<path>, rotated upright from its EXIF orientation, scaled
down to at most --max-width pixels wide, stripped of EXIF/XMP/comment metadata
and given a lowercase extension. The originals are never modified. The ICC
colour profile is kept, as many photos are Display P3 and would shift colour
without it.

An original that needs none of these changes is copied as is rather than
re-encoded. An image whose output is already newer than its original is
skipped, so the script can be re-run over a folder cheaply.

Examples
--------
Prepare every original:

    python3 scripts/prep_images.py

Prepare one post's originals:

    python3 scripts/prep_images.py assets/images/_originals/2024-01-06-chariots

Show what would change without writing anything:

    python3 scripts/prep_images.py --dry-run
"""

import argparse
import shutil
import sys
from pathlib import Path

from PIL import Image, ImageOps

IMAGES_DIR = Path(__file__).resolve().parent.parent / "assets" / "images"
ORIGINALS_DIR = IMAGES_DIR / "_originals"
OUTPUT_DIR = IMAGES_DIR / "_2kpx"
EXTENSIONS = {".jpg", ".jpeg", ".png"}
METADATA_KEYS = ("xmp", "XML:com.adobe.xmp", "comment")
ORIENTATION_TAG = 0x0112


def main(argv: list[str] | None = None) -> int:
    """
    Parse command-line arguments and prepare each original found.

    Parameters
    ----------
    argv : list of str, optional
        Arguments to parse instead of sys.argv[1:].

    Returns
    -------
    int
        Process exit code.
    """
    parser = argparse.ArgumentParser(description=__doc__.strip().split("\n\n")[0])
    parser.add_argument("paths", nargs="*", type=Path, default=[ORIGINALS_DIR],
                        help="original files or directories under assets/images/_originals "
                             "(default: all)")
    parser.add_argument("--max-width", type=int, default=2000,
                        help="maximum width in pixels (default: 2000)")
    parser.add_argument("--quality", type=int, default=92,
                        help="JPEG quality when re-encoding (default: 92)")
    parser.add_argument("--dry-run", action="store_true",
                        help="report changes without writing anything")
    args = parser.parse_args(argv)

    for path in args.paths:
        if not path.exists():
            parser.error(f"not found: {path}")
        if not path.resolve().is_relative_to(ORIGINALS_DIR):
            parser.error(f"not under {ORIGINALS_DIR}: {path}")

    changed = 0
    for original in find_originals(args.paths):
        changes = prep_image(original, args.max_width, args.quality, args.dry_run)
        if changes:
            changed += 1
            print(f"{output_path(original).relative_to(OUTPUT_DIR)}: {', '.join(changes)}")
    print(f"{'Would write' if args.dry_run else 'Wrote'} {changed} image(s)")
    return 0


def find_originals(paths: list[Path]) -> list[Path]:
    """
    Collect original images from a list of files and directories.

    Parameters
    ----------
    paths : list of pathlib.Path
        Files or directories under ORIGINALS_DIR. Directories are searched recursively.

    Returns
    -------
    list of pathlib.Path
        Sorted absolute image paths whose extension, case-insensitively, is in EXTENSIONS.
    """
    images = set()
    for path in paths:
        candidates = path.rglob("*") if path.is_dir() else [path]
        images.update(p.resolve() for p in candidates
                      if p.is_file() and p.suffix.lower() in EXTENSIONS)
    return sorted(images)


def prep_image(original: Path, max_width: int, quality: int, dry_run: bool = False) -> list[str]:
    """
    Write the prepared copy of a single original image.

    Parameters
    ----------
    original : pathlib.Path
        Absolute path of an image under ORIGINALS_DIR.
    max_width : int
        Maximum width in pixels of the prepared image, after rotation.
    quality : int
        JPEG quality used when the image is re-encoded.
    dry_run : bool, optional
        If True, report the changes without writing anything.

    Returns
    -------
    list of str
        Descriptions of the changes made; empty if the output was up to date.
    """
    target = output_path(original)
    if target.exists() and target.stat().st_mtime >= original.stat().st_mtime:
        return []

    with Image.open(original) as image:
        # Phone photos open as MPO (a JPEG with extra embedded frames); save them as plain JPEG.
        image_format = "JPEG" if image.format == "MPO" else image.format
        orientation = image.getexif().get(ORIENTATION_TAG, 1)
        # Orientations 5-8 swap width and height.
        width = image.height if orientation in (5, 6, 7, 8) else image.width
        stripped = has_metadata(image)

        changes = []
        if orientation != 1:
            changes.append(f"rotate (orientation {orientation})")
        if width > max_width:
            changes.append(f"resize from {width}px wide")
        if stripped:
            changes.append("strip metadata")
        reencode = bool(changes)
        if not reencode:
            changes.append("copy")
        if dry_run:
            return changes

        if reencode:
            icc_profile = image.info.get("icc_profile")
            output = ImageOps.exif_transpose(image)
            if output.width > max_width:
                height = round(output.height * max_width / output.width)
                output = output.resize((max_width, height), Image.Resampling.LANCZOS)
            save_args = {"icc_profile": icc_profile} if icc_profile else {}
            if image_format == "JPEG":
                save_args.update(quality=quality, optimize=True)
            else:
                save_args.update(optimize=True)

    target.parent.mkdir(parents=True, exist_ok=True)
    if reencode:
        output.save(target, format=image_format, **save_args)
    else:
        shutil.copy2(original, target)
    return changes


def output_path(original: Path) -> Path:
    """
    Map an original image to the path of its prepared copy.

    Parameters
    ----------
    original : pathlib.Path
        Absolute path of an image under ORIGINALS_DIR.

    Returns
    -------
    pathlib.Path
        The same relative path under OUTPUT_DIR, with a lowercase extension.
    """
    relative = original.relative_to(ORIGINALS_DIR)
    return OUTPUT_DIR / relative.with_suffix(relative.suffix.lower())


def has_metadata(image: Image.Image) -> bool:
    """
    Check whether an image carries metadata that should be stripped.

    Parameters
    ----------
    image : PIL.Image.Image
        Opened image.

    Returns
    -------
    bool
        True if the image has EXIF, XMP or comment data.
    """
    return bool(image.getexif()) or any(key in image.info for key in METADATA_KEYS)


if __name__ == "__main__":
    sys.exit(main())
