# Description: Jekyll plugin to replace Markdown image syntax with an image.html
# include for crafting responsive images, and to turn image-only Markdown
# tables into row-images wrappers beforehand.

# ![alt](../assets/images/_2kpx/folder/file.jpg "caption") becomes a
# {% include image.html %} with optional caption. The image path should be
# relative to the markdown file, or a site path under picture.source.
MARKDOWN_IMAGE = /!\[([^\]]*)\]\(\s*([^\s)]+)(?:\s+"((?:[^"\\]|\\.)*)")?\s*\)/

# One image, optional title/caption, optional {: ...} IAL (kept for later parsing).
IMAGE_TABLE_CELL = /\A\s*!\[([^\]]*)\]\(\s*([^\s)]+)(?:\s+"((?:[^"\\]|\\.)*)")?\s*\)(?:\{:[^}]+\})?\s*\z/

# Pipe table: header/body rows plus a separator row of dashes/colons.
# Separator cells allow a single dash (as in `| - | - |`) as well as GFM `---`.
MARKDOWN_TABLE = /^(\|.+\|[ \t]*\r?\n\|[ \t]*:?-{1,}:?[ \t]*(?:\|[ \t]*:?-{1,}:?[ \t]*)+\|[ \t]*(?:\r?\n\|.+\|[ \t]*)*)/

def rewrite_markdown_images(doc)
	docExt = File.extname(doc.path).tr('.', '')
	return unless doc.site.config['markdown_ext'].include?(docExt)

	doc.content = doc.content.gsub(MARKDOWN_IMAGE) do
		alt, file, caption = Regexp.last_match.captures
		tag = "{% include image.html img=\"#{Jekyll::ImageFilters.resolve_path(file, doc.path, doc.site)}\" alt=\"#{alt.gsub('"', '&quot;')}\""
		tag += " caption=\"#{caption.gsub('\\"', '&quot;')}\"" if caption
		"#{tag} %}"
	end
end

# Rewrites Markdown tables whose cells are only images into .row-images
# (and .row-images-group) HTML wrappers. Markdown images are left in place
# for rewrite_markdown_images to turn into image.html includes.
def rewrite_image_tables(doc)
	doc_ext = File.extname(doc.path).tr('.', '')
	return unless doc.site.config['markdown_ext'].include?(doc_ext)

	doc.content = doc.content.gsub(MARKDOWN_TABLE) do |table|
		images = image_only_table_images(table)
		images ? render_image_row_wrappers(images) : table
	end
end

# extracts the images that are listed in the table
def image_only_table_images(table)
	lines = table.strip.split(/\r?\n/)
	return nil if lines.length < 2

	sep_index = lines.index { |line| table_separator_row?(line) }
	return nil unless sep_index

	images = []
	lines.each_with_index do |line, index|
		next if index == sep_index

		cells = table_row_cells(line)
		return nil if cells.empty?

		cells.each do |cell|
			return nil unless cell.match?(IMAGE_TABLE_CELL)

			images << cell.strip
		end
	end

	return nil if images.length < 2

	images
end

def table_separator_row?(line)
	cells = table_row_cells(line)
	!cells.empty? && cells.all? { |cell| cell.match?(/\A:?-{1,}:?\z/) }
end

def table_row_cells(line)
	stripped = line.strip
	return [] unless stripped.start_with?('|')

	stripped = stripped.delete_suffix('|') if stripped.end_with?('|')
	stripped.delete_prefix('|').split('|').map(&:strip)
end

# 2–3 → one chunk; 4+ → take 2s while more than 3 remain (5 → 2+3, 6 → 2+2+2).
def image_row_chunk_sizes(count)
	return [count] if count <= 3

	sizes = []
	remaining = count
	while remaining > 0
		if remaining <= 3
			sizes << remaining
			break
		end

		sizes << 2
		remaining -= 2
	end
	sizes
end

def render_image_row_wrappers(images)
	chunks = []
	offset = 0
	image_row_chunk_sizes(images.length).each do |size|
		chunks << images[offset, size]
		offset += size
	end

	rows = chunks.map do |chunk|
		"<div class=\"row-images\">\n#{chunk.join("\n")}\n</div>"
	end

	return rows.first if rows.length == 1

	"<div class=\"row-images-group\">\n#{rows.join("\n")}\n</div>"
end

Jekyll::Hooks.register :site, :post_read do |site|
	(site.posts.docs + site.pages).each do |doc|
		rewrite_image_tables(doc)
		rewrite_markdown_images(doc)
		if doc.data['excerpt'].is_a?(Jekyll::Excerpt)
			doc.data['excerpt'] = Jekyll::Excerpt.new(doc)
		end
	end
end
