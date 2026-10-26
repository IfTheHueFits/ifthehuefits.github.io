---
layout: none
---
var imageData; // as image data gets bit this may slow down the page if it hangs around
var imgageSource
// NOTE sizes also defined in lightbox.js
var sizes = [{%  for size in site.data.picture.presets.default.widths %} {{size}}, {%endfor%}];

function getGalleryData(source) {
	// return promise of JSON data
	return $.getJSON(source)
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

function gen_background_file(srcset, ratio, backgrounds){
	var width = screen.width;
	var entries = srcset.split(',');
	var candidates = [];
	var chosen;

	// correct width if it is in a column
	if (screen.width > 1024){
		width = screen.height*ratio;
	}

	for(i=0; i<entries.length; i++){
		var parts = entries[i].trim().split(/\s+/);
		candidates.push({url: parts[0], width: parseInt(parts[1], 10)});
	}
	candidates.sort(function(a,b){return a.width-b.width;});

	// smallest listed width that still covers the space; otherwise the largest
	chosen = candidates[candidates.length-1].url;
	for(i=0; i<candidates.length; i++){
		if (candidates[i].width > width){
			chosen = candidates[i].url;
			break;
		}
	}

	swap_background(chosen, backgrounds);
}

function init(){
	// scroll to top on page change
	topFunction();


	// PART 2 trigger image gallery if present
	if (document.querySelector("#pig")){
		pig_element = document.querySelector("#pig");
		var pig;
		var options = {
			urlForSize: function(filename, size, hash) {
					fp = filename.split(".")
					return '/generated/images/' + fp[0] + '-' + size + '-' + hash + '.jpg';
				},

			sizes: sizes.sort(function(a,b) {return a-b;}),

			scroller: document.getElementsByClassName("main_window")[0]
		};

		// don't send unecessary request if variable is already loaded
		if (imageData && pig_element.dataset.source == imageSource){
			pig = new Pig(imageData, options).enable();
			pig.enable();
		}
		else {

			getGalleryData(pig_element.dataset.source).then( function(response){
				imageData = response;
				imageSource = pig_element.dataset.source;
				pig = new Pig(imageData, options).enable();
				pig.enable();
			});
		}
	}

	// PART 3 fade in gallery images once loaded
	document.querySelectorAll(".gallery-item img").forEach(function(img){
		if (img.complete) {
			img.classList.add("loaded");
		}
		else {
			img.addEventListener("load", function(){ img.classList.add("loaded"); });
		}
	});

	// PART 1 Change background of side pannel
	var backgrounds = document.getElementsByClassName("side_bar_img");
	var aside_element = document.querySelector("aside");
	var srcset = aside_element.dataset.srcset;
	var ratio = aside_element.dataset.ratio;
	var banner_stem = srcset.split(',')[0].trim().split(/\s+/)[0]
		.replace(/-\d+-[0-9a-f]+\.[^.]+$/, '')
		.split('/generated/images/')[1];

	// check if background image is actually different and switch if so
	if (!document.querySelector(".img_on").style.backgroundImage.includes(banner_stem)) {
		gen_background_file(srcset, ratio, backgrounds);
	}

}

// remove variables no longer used on other pages
function unload() {
	//Not currently doing anything
}

//first load
init();

//add swup event listeners
try {
	const swup = new Swup({
  plugins: [new SwupScrollPlugin()]
});
	swup.on('willReplaceContent', unload);
	swup.on('contentReplaced', init);
}
catch(err){
	console.log(err.message);
}
