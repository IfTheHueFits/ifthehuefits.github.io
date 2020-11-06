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

	var new_background = 'url("/assets/images/splash.jpg")';
	var backgrounds = document.getElementsByClassName("side_bar_img");
	if (document.querySelector("aside")){
		var aside_element = document.querySelector("aside");
		new_background = 'url("' + aside_element.id + '")';
	}
	if (document.querySelector(".img_on").style.backgroundImage != new_background){
		for (i=0; i<2; i++){
			if (backgrounds[i].className.includes("img_on")){
				backgrounds[i].className = backgrounds[i].className.replace(" img_on", "")
			}
			else {
				backgrounds[i].style.backgroundImage = new_background;
				backgrounds[i].className += " img_on";
			}
		}
	}
}

init();
swup.on('contentReplaced', init);
