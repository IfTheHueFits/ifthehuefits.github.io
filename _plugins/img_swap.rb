
require 'dimensions'

def formatAside(post)
	# adds hash, aspect ratio and width for calculating the responsive header images
	if post.output.include? "</aside>"
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
	return post
end

def formatRows(post)
	# caluclates the flex ratio of images in a row
	if post.output.include? '<div class="row-images">'
		# get each col which contains one image
		row_group = post.output.scan(/(<div class="col">(.|\n)+?<\/div>)/).flatten
		row_group.each do |row|
			# regex above captures random tabs also
			if row.include? '<div class="col">'
				# extract the src of the image to calculate the aspect ratio
				src = row.scan(/<img src=['"](.+)["'] srcset=/).flatten[0]
				dims = Dimensions.dimensions("./_site" + src)

				# add ratio as style to col under flex"
				new_row = row.gsub(/<div class="col">/, \
									'<div class="col" style="flex: ' + \
									(dims[0].to_f/dims[1].to_f).to_s + '">')
				post.output = post.output.gsub(row, new_row)
			end
		end
	end
end

# Description: Jekyll plugin to replace Markdown image syntax with {% picture %} tag for crafting responsive images
# place in /_plugins/
Jekyll::Hooks.register :posts, :pre_render do |post, payload|
	docExt = post.extname.tr('.', '')
	# only process if we deal with a markdown file
	if payload['site']['markdown_ext'].include? docExt
		newContent = post.content.gsub(/\!\[(.+)\]\((.+)\)/, '{% picture \2 alt="\1" %}')
		post.content = newContent
	end
end

# Applies the functions at the top to each post
# documents don't seem to include pages and vice versa, so run snippet on both
Jekyll::Hooks.register :pages, :post_render do |post|
	post = formatAside(post)
	post = formatRows(post)
end

Jekyll::Hooks.register :documents, :post_render do |post|
	post = formatAside(post)
	post = formatRows(post)
end

