# Making a new post

1. Create `.md` file in the `_posts` folder
2. Add list of images to be added to the gallery to the `gallery.yml` folder
3. Run `jekyll serve` or `jekyll build`

## Images

Use normal Markdown image syntax. Paths should be relative to the markdown file (or under `picture.source` in `_config.yml`):

```markdown
![Alt text](../assets/images/_2kpx/folder/photo.jpg "Optional caption")
```

Optional Kramdown-style IAL after an image passes attributes through to `image.html`. Currently `preset` selects a Jekyll Picture Tag preset (useful for small sources that would otherwise warn about width):

```markdown
![David Soper's Eldar Warrior](../assets/images/_2kpx/folder/soper.jpg "Caption"){: preset="max_680"}
```

### Image rows

A Markdown table whose every cell is exactly one image is rewritten into a flex row (2–3 images) or grouped rows (4+). Anything else in a cell leaves the table alone:

```markdown
| ![Standard](../assets/images/_2kpx/folder/standard.jpg) | ![musician](../assets/images/_2kpx/folder/musician.jpg) | ![champ1](../assets/images/_2kpx/folder/champ1.jpg) | ![champ2](../assets/images/_2kpx/folder/champ2.jpg) |
| --- | --- | --- | --- |
```

Four or more images chunk as pairs while more than three remain (4 → 2+2, 5 → 2+3, 6 → 2+2+2). On narrow viewports a 4-wide group becomes 2-wide; standalone rows of 2–3 stay side-by-side.
