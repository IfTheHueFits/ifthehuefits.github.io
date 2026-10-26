# Fail the build when a required field is blank, or when a banner image is
# not on disk. A missing optional field warns; writing that key with no value
# leaves it blank on purpose. A front matter field that nothing reads also
# warns. Runs at :pre_render because :post_init fires before Jekyll has read
# the YAML, so every post would look empty.
module PostValidator
    # Blank values fail the build.
    REQUIRED_FIELDS = %w[title categories].freeze

    # Blank values raise a warning, can be set to null explicitly in the post
    OPTIONAL_FIELDS = %w[subheading].freeze

    # Jekyll reads these itself. Templates never mention most of them.
    JEKYLL_FIELDS = %w[layout permalink published date slug categories tags excerpt].freeze

    # Regex for frontmatter found in the templates - used to scan for frontmatter fields
    FIELD_REF = %r{(?:post_data|page|post)(?:\.([A-Za-z_]\w*)|\[['"]([A-Za-z_]\w*)['"]\])}

    def self.blank?(value)
        return true if value.nil?
        return value.strip.empty? if value.is_a?(String)
        return value.empty? if value.respond_to?(:empty?)

        false
    end

    # Keys written between the --- lines. post.data also holds slug, date, and
    # a title Jekyll copies from the filename, and those are not unused fields.
    def self.written_fields(post)
        content = File.read(post.path)
        return [] unless content =~ Jekyll::Document::YAML_FRONT_MATTER_REGEXP

        data = SafeYAML.load(Regexp.last_match(1))
        return [] unless data.is_a?(Hash)

        data.keys.map(&:to_s)
    end

    # Builds collection of all frontmatter fields used across the website
    def self.used_fields(site)
        fields = REQUIRED_FIELDS + OPTIONAL_FIELDS + JEKYLL_FIELDS
        Dir.glob(File.join(site.source, '**', '*.{html,md,yml,yaml,rb,js,liquid}')).each do |path|
            next if path.include?("#{File::SEPARATOR}_site#{File::SEPARATOR}")

            File.read(path).scan(FIELD_REF) do |dotted, bracket|
                fields << (dotted || bracket)
            end
        end
        fields.uniq
    end

    def self.warn_unused(post)
        unused = written_fields(post) - used_fields(post.site)
        return if unused.empty?

        Jekyll.logger.warn(
            'Post check:',
            "#{post.relative_path} front matter #{unused.join(', ')} is not used anywhere"
        )
    end

    def self.check(post)
        OPTIONAL_FIELDS.each do |field|
            next if post.data.key?(field)

            Jekyll.logger.warn(
                'Post check:',
                "#{post.relative_path} has no #{field}. Add `#{field}:` with no value to leave it blank."
            )
        end

        missing = REQUIRED_FIELDS.select { |field| blank?(post.data[field]) }
        unless missing.empty?
            Jekyll.logger.abort_with(
                'Post check:',
                "#{post.relative_path} is missing #{missing.join(', ')}"
            )
        end

        warn_unused(post)

        # Check header image
        head_img = post.data['head_img']
        return if blank?(head_img) # no head_img is a valid option

        # If head_img is present, check that the img file actually exists
        relative = head_img.to_s.sub(%r{\A/+}, '')
        relative_file = File.join(post.site.config.dig('picture', 'source') || '', relative)
        full_path = File.join(post.site.source, relative_file)
        return if File.exist?(full_path)

        Jekyll.logger.abort_with(
            'Post check:',
            "#{post.relative_path} head_img '#{head_img}' was not found at #{relative_file}"
        )
    end
end

Jekyll::Hooks.register :posts, :pre_render do |post|
    PostValidator.check(post)
end
