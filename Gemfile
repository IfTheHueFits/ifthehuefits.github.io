source 'https://rubygems.org'

gem 'jekyll'

group :jekyll_plugins do
  # Must load before jekyll_picture_tag: libvips links the system libxml2,
  # which otherwise replaces Nokogiri's bundled one and breaks html-proofer.
  gem 'nokogiri'
  gem 'jekyll-sitemap'
  gem 'jekyll-feed'
  gem 'jekyll-seo-tag'
  gem 'jekyll-paginate'
  gem 'jekyll_picture_tag', '~> 2.1'
  gem 'jekyll-toc'
end

gem 'dimensions'

group :test do
  gem 'html-proofer', '~> 5.0'
end
