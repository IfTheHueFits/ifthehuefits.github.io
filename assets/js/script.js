---
layout: none
---
const swup = new Swup()

function getGalleryData() {
	// return promise of JSON data
	return $.getJSON("assets/js/pictures.json")
}

function topFunction() {
	document.body.scrollTop = 0; // For Safari
	document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}

function init(){
	topFunction();
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
			pig.enable();
		});
	}

	// if (document.querySelector("aside")){
	// 	var aside_element = document.querySelector("aside");
	// 	document.querySelector(".side_bar").style.backgroundImage = "linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0.9)),url(" + aside_element.id + ")"
	// }
	// else {
	// 	document.querySelector(".side_bar").style.backgroundImage = "linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0.9)), url(/assets/images/splash.jpg)"
	// }
}

init();
swup.on('contentReplaced', init);
