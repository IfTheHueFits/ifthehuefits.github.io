# If the Hue Fits

Miniature painting blog built with Jekyll.

## New post

1. Add `_posts/YYYY-MM-DD-slug.md` with front matter:

```yaml
---
title: Post title
subheading: Optional one-liner
categories: Showcase
head_img: YYYY-MM-DD-slug/banner.jpg
gallery:
  - YYYY-MM-DD-slug/photo1.jpg
  - YYYY-MM-DD-slug/photo2.jpg
---
```

`title` and `categories` are required (`Showcase`, `Review`, or `Editorial`). Leave `subheading:` blank if unused. `head_img` is the sidebar banner; omit it for no banner. `gallery` lists images for `/gallery/` (and for an in-post gallery via `{% include gallery.html files=page.gallery %}`). Paths are relative to `assets/images/_2kpx` (same form as `{% picture %}`).

2. Put full-size photos in `assets/images/_originals/YYYY-MM-DD-slug/` (git-ignored).

3. Build the site copies:

```bash
python3 scripts/prep_images.py assets/images/_originals/YYYY-MM-DD-slug
```

That writes rotated, ≤2000px-wide images to `assets/images/_2kpx/YYYY-MM-DD-slug/`. Re-run anytime; newer outputs are skipped.

4. Preview or build:

```bash
jekyll serve
jekyll build
```

`jekyll build` also runs the post validator (front matter and image paths on disk) and html-proofer. `jekyll serve` skips html-proofer. To re-check an existing `_site`:

```bash
scripts/htmlproofer.sh
```

Do not rename files in `_posts/` or change `categories` / permalinks — GraphComment threads and feed URLs depend on them. Renaming image folders is fine.

## Images in posts

Markdown images; paths relative to the post file (or under `picture.source` in `_config.yml`):

```markdown
![Alt text](../assets/images/_2kpx/YYYY-MM-DD-slug/photo.jpg "Optional caption")
```

Optional Kramdown-style IAL after an image is passed through to `image.html`:

- `preset` — Jekyll Picture Tag preset (for sources narrower than the default widths)
- `style` — inline CSS on the `<img>`

```markdown
![David Soper's Eldar Warrior](../assets/images/_2kpx/folder/soper.jpg "Caption"){: preset="max_680"}
![Skin paint mixes](../assets/images/_2kpx/folder/skin.jpg){: style="max-width:250px"}
```

### Image rows

A Markdown table whose every cell is exactly one image becomes a flex row (2–3 images) or grouped rows (4+). Anything else in a cell leaves the table alone:

```markdown
| ![Standard](../assets/images/_2kpx/folder/standard.jpg) | ![musician](../assets/images/_2kpx/folder/musician.jpg) | ![champ1](../assets/images/_2kpx/folder/champ1.jpg) | ![champ2](../assets/images/_2kpx/folder/champ2.jpg) |
| - | - | - | - |
```

Four or more images chunk as pairs while more than three remain (4 → 2+2, 5 → 2+3, 6 → 2+2+2). On narrow viewports a 4-wide group becomes 2-wide; standalone rows of 2–3 stay side-by-side.
