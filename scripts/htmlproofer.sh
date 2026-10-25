#!/usr/bin/env bash
# Check the HTML in _site. Build first with `jekyll build`.
#
# External sites are not fetched. A few posts cite old http:// pages, so an
# http address is not a failure.
#
# --allow-missing-href: each post ends with <a class="button" id="comments">
# and no href. assets/js/lightbox.js opens GraphComment from that id.
#
# --ignore-missing-alt: picture tags and row images were written without alt
# text.
set -euo pipefail
cd "$(dirname "$0")/.."
htmlproofer _site \
	--disable-external \
	--no-enforce-https \
	--allow-missing-href \
	--ignore-missing-alt
