# Description: Jekyll plugin to replace Markdown image syntax with {% picture %} tag for crafting responsive images
# place in /_plugins/

require 'dimensions'

Jekyll::Hooks.register :posts, :pre_render do |post, payload|
	docExt = post.extname.tr('.', '')
	# only process if we deal with a markdown file
	if payload['site']['markdown_ext'].include? docExt
		newContent = post.content.gsub(/\!\[(.+)\]\((.+)\)/, '{% picture \2 alt="\1" %}')
		post.content = newContent
	end
end

Jekyll::Hooks.register :documents, :post_render do |post|
	if post.output.include? "aside"
		aside_group = post.output.scan(/<aside id=["'](.+).jpg["']><\/aside>/)[0][0]
		files = Dir.glob("./_site/generated/" + aside_group + "*")
		hash = files[0].scan(/-([0-9a-f]{9})\.jpg/)[0][0]
		dims = Dimensions.dimensions("." + aside_group + ".jpg")
		post.output = post.output.gsub(/<aside id=["'](.+)["']><\/aside>/, \
									'<aside id="\1" data-hash="' + hash + \
									'" data-width=' + dims[0].to_s + \
									' data-ratio=' + (dims[0].to_f/dims[1].to_f).to_s + \
									'></aside>')
	end
end

