# Run html proofer when  `jekyll build` is run (not run on serve).
# see scripts/htmlproofer.sh for explainer of the errors we ignore below.
Jekyll::Hooks.register :site, :post_write do |site|
    next if site.config["serving"]

    require "html-proofer"

    HTMLProofer.check_directory(
        site.dest,
        disable_external: true,
        enforce_https: false,
        allow_missing_href: true,
        ignore_missing_alt: true
    ).run
end
