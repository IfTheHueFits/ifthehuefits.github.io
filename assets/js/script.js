---
layout: none
---
const swup = new Swup()

function getGalleryData() {
	// return promise of JSON data
	return $.getJSON("assets/js/pictures.json")
}

function init(){
	if (document.querySelector("#pig")){
		var imageData;
		var pig;
		var options = {
			urlForSize: function(filename, size, hash) {
					return 'generated/assets/images/' + filename + '-' + size + '-' + hash + '.jpg';
				},

			sizes: [{%  for size in site.data.picture.presets.default.widths %} {{size}}, {%endfor%}].sort(function(a,b) {return a-b;}),

			scroller: document.getElementsByClassName("main_window")[0]
		};

		getGalleryData().then( function(response){
			imageData = response;
			pig = new Pig(imageData, options).enable();
		});
	}
}

init();
swup.on('contentReplaced', init);
