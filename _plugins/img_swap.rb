# Description: Jekyll plugin to replace Markdown image syntax with {% picture %} tag for crafting responsive images
# place in /_plugins/

Jekyll::Hooks.register :posts, :pre_render do |post, payload|
    docExt = post.extname.tr('.', '')
    # only process if we deal with a markdown file
    # note if removed so that it applies to excerpts
    # if payload['site']['markdown_ext'].include? docExt
    newContent = post.content.gsub(/\!\[(.+)\]\((.+)\)/, '{% picture \2 alt="\1" %}')
    post.content = newContent
    # end
end