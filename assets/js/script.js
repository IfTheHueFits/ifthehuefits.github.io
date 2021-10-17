---
layout: none
---
const swup = new Swup()
var imageData; // as image data gets bit this may slow down the page if it hangs around
// NOTE sizes also defined in lightbox.js
var sizes = [{%  for size in site.data.picture.presets.default.widths %} {{size}}, {%endfor%}];

function getGalleryData() {
	// return promise of JSON data
	return $.getJSON("/assets/js/pictures.json")
}

function topFunction() {
	document.body.scrollTop = 0; // For Safari
	document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}

function swap_background(file, backgrounds) {
	for (i=0; i<2; i++){
		if (backgrounds[i].className.includes("img_on")){
			backgrounds[i].className = backgrounds[i].className.replace(" img_on", "")
		}
		else {
			backgrounds[i].style.backgroundImage = 'url("' + file + '")';
			backgrounds[i].className += " img_on";
		}
	}
}

function executeIfFileExist(src, callback) {
    var xhr = new XMLHttpRequest()
    xhr.onreadystatechange = function() {
        if (this.readyState === this.DONE) {
            callback()
        }
    }
    xhr.open('HEAD', src)
}

function gen_background_file(orig_file, ratio, hash, backgrounds){
	var width = screen.width;
	var load_width = 0;

	if (screen.width > 1024){
		width = screen.height*ratio;
	}

	for(i=0; i<sizes.length; i++){
		if (sizes[i] > width){
			load_width = sizes[i];
			break;
		}
	}

	// if width of screen is wider than generated images, use original fullsize
	if(load_width == 0){
		swap_background(orig_file, backgrounds);
	}
	else{
		var new_file = "/generated" + orig_file.split(".")[0] + "-" + load_width + "-" + hash + "." + orig_file.split(".")[1];
		swap_background(new_file, backgrounds);
	};
}

function init(){
	// scroll to top on page change
	topFunction();

	// PART 1 trigger image gallery if present
	if (document.querySelector("#pig")){
		var pig;
		var options = {
			urlForSize: function(filename, size, hash) {
					return '/generated/assets/images/' + filename + '-' + size + '-' + hash + '.jpg';
				},

			sizes: sizes.sort(function(a,b) {return a-b;}),

			scroller: document.getElementsByClassName("main_window")[0]
		};

		// don't send unecessary request if variable is already loaded
		if (imageData){
			pig = new Pig(imageData, options).enable();
			pig.enable();
		}
		else {
			getGalleryData().then( function(response){
				imageData = response;
				pig = new Pig(imageData, options).enable();
				pig.enable();
			});
		}
	}

	// PART 2 Change background of side pannel
	// default background image
	var orig_file = "/assets/images/splash.jpg"
	var ratio = 0.747;
	var hash = "df42ed768";

	var backgrounds = document.getElementsByClassName("side_bar_img");

	// if aside element is present containing the background img info
	if (document.querySelector("aside")){
		var aside_element = document.querySelector("aside");
		orig_file = aside_element.id;
		hash = $(aside_element).data("hash");
		ratio = $(aside_element).data("ratio");
	};

	// check if background image is actually different and switch if so
	if (!document.querySelector(".img_on").style.backgroundImage.includes(orig_file.split('.')[0])) {
		gen_background_file(orig_file, ratio, hash, backgrounds);
	}
}

// remove variables no longer used on other pages
function unload() {
	//Not currently doing anything
}

init();
swup.on('willReplaceContent', unload);
swup.on('contentReplaced', init);
