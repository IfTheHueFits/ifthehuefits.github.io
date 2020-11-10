const swup = new Swup()

function getGalleryData() {
	// return promise of JSON data
	return $.getJSON("/assets/js/pictures.json")
}

function topFunction() {
	document.body.scrollTop = 0; // For Safari
	document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}

function gen_background_file(orig_file, ratio, hash){
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
		return orig_file;
	}
	else{
		return "/generated" + orig_file.split(".")[0] + "-" + load_width + "-" + hash + ".jpg";
	}
}

var imageData; // as image data gets bit this may slow down the page if it hangs around
var sizes = [ 20,  100,  250,  400,  600,  800,  1000, ];

function init(){
	// scroll to top on page change
	topFunction();

	// close lightbox on page change
	lightbox = document.getElementById("lightbox-overlay")
	lightbox.classList.remove('visible');
	lightbox.getElementsByTagName("NAV")[0].style.display = "none";

	// trigger image gallery if present
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

	// default background image
	var orig_file = "/assets/images/splash.jpg"
	var ratio = 0.747;
	var hash = "df42ed768";

	var backgrounds = document.getElementsByClassName("side_bar_img");

	// if aside element is present containing the background img info
	if (document.querySelector("aside")){
		var aside_element = document.querySelector("aside");
		orig_file = aside_element.id
		hash = $(aside_element).data("hash")
		ratio = $(aside_element).data("ratio")
	}

	new_background = 'url("' + gen_background_file(orig_file, ratio, hash) + '")';

	// check if background image is actually different and switch if so
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

	if (document.querySelector(".fb-comments")){
		(function(d, s, id){
		    var js, fjs = d.getElementsByTagName(s)[0];
		    if (d.getElementById(id)){ return; }
		    js = d.createElement(s); js.id = id;
		    js.onload = function(){
		        // remote script has loaded
				return;
		    };
		    js.src = "https://connect.facebook.net/en_GB/sdk.js#xfbml=1&version=v8.0&appId=2837989939777329&autoLogAppEvents=1";
			js.setAttribute("nonce", "TUPtOgUd");
			js.setAttribute("crossorigin", "anonymous");
		    fjs.parentNode.insertBefore(js, fjs);
		}(document, 'script', 'fb-script'));
		try{
			FB.XFBML.parse();
		}
		catch(ReferenceError){ /*first time page loads*/ }
	}
}

// remove variables no longer used on other pages
function unload() {
	if (document.querySelector(".fb-comments")){
		document.querySelector("#fb-script").remove();
	}

}

init();
swup.on('willReplaceContent', unload);
swup.on('contentReplaced', init);
