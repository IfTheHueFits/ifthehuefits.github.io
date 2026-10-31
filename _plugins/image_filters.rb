# {{ "folder/photo.jpg" | image_ratio }} is replaced in the HTML by that
# image's width divided by its height. The path is relative to the
# jekyll_picture_tag source folder (picture.source in _config.yml).
#
# {{ path | image_path: page.path }} rewrites a path that points at a file
# under picture.source (including markdown relatives such as
# ../assets/images/_2kpx/folder/photo.jpg, or a site path such as
# /assets/images/_2kpx/folder/photo.jpg) so it is relative to that folder.
# Other paths are returned unchanged. Lists are resolved item by item.
require 'dimensions'

module Jekyll
    module ImageFilters
        # Jekyll gives an excerpt the path of its post with /#excerpt on the
        # end, so relative markdown paths still resolve from the post file.
        def self.resolve_path(file, doc_path, site = nil)
            return file if file.nil? || file.to_s.empty?

            path = file.to_s
            picture_source_relative(path, doc_path, site) || path
        end

        def image_path(input, doc_path)
            site = @context.registers[:site]
            return input.map { |file| ImageFilters.resolve_path(file, doc_path, site) } if input.is_a?(Array)

            ImageFilters.resolve_path(input, doc_path, site)
        end

        # If path points at a file under picture.source, return it relative to
        # that folder so jekyll_picture_tag does not prefix the source twice.
        def self.picture_source_relative(path, doc_path, site)
            return unless site

            picture_source = site.config.dig('picture', 'source').to_s
            return if picture_source.empty?

            picture_root = File.expand_path(picture_source, site.source)
            prefix = picture_root + File::SEPARATOR
            stripped = path.sub(%r{\A/}, '')
            doc_dir = File.join(site.source, File.dirname(doc_path.to_s.sub(%r{/#excerpt\z}, '')))

            [doc_dir, site.source].each do |base|
                candidate = File.expand_path(stripped, base)
                return candidate.delete_prefix(prefix) if candidate.start_with?(prefix)
            end
            nil
        end
        private_class_method :picture_source_relative

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
