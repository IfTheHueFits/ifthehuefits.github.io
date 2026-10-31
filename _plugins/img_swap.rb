# Description: Jekyll plugin to replace Markdown image syntax with an image.html
# include for crafting responsive images

# ![alt](../assets/images/_2kpx/folder/file.jpg "caption") becomes a
# {% include image.html %} with optional caption. The image path should be
# relative to the markdown file, or a site path under picture.source.
MARKDOWN_IMAGE = /!\[([^\]]*)\]\(\s*([^\s)]+)(?:\s+"((?:[^"\\]|\\.)*)")?\s*\)/

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

Jekyll::Hooks.register :site, :post_read do |site|
	(site.posts.docs + site.pages).each do |doc|
		rewrite_markdown_images(doc)
		if doc.data['excerpt'].is_a?(Jekyll::Excerpt)
			doc.data['excerpt'] = Jekyll::Excerpt.new(doc)
		end
	end
end
