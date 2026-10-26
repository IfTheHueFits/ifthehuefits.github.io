# {{ "folder/photo.jpg" | image_ratio }} is replaced in the HTML by that
# image's width divided by its height. The path is relative to the
# jekyll_picture_tag source folder (picture.source in _config.yml).
require 'dimensions'

module Jekyll
    module ImageFilters
        # Width divided by height for a file under picture.source.
        # Dimensions.dimensions already exchanges the two sides when a JPEG's
        # EXIF orientation is 90 or 270 degrees.
        def image_ratio(path)
        site = @context.registers[:site]
        source = site.config.dig('picture', 'source') || ''
        width, height = Dimensions.dimensions(File.join(site.source, source, path))
        width.to_f / height
      end
    end
end

Liquid::Template.register_filter(Jekyll::ImageFilters)
