const swup = new Swup()

function getGalleryData() {
	// return promise of JSON data
	return $.getJSON("/assets/js/pictures.json")
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
					return '/generated/assets/images/' + filename + '-' + size + '-' + hash + '.jpg';
				},

			sizes: [ 20,  100,  250,  400,  600,  800,  1000, ].sort(function(a,b) {return a-b;}),

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

	if (document.querySelector(".fb-comments")){
		console.log("LOADING COMMENTS");
		(function(d, s, id){
		    var js, fjs = d.getElementsByTagName(s)[0];
		    if (d.getElementById(id)){ return; }
		    js = d.createElement(s); js.id = id;
		    js.onload = function(){
		        // remote script has loaded
		    };
		    js.src = "https://connect.facebook.net/en_GB/sdk.js#xfbml=1&version=v8.0&appId=2837989939777329&autoLogAppEvents=1";
			js.setAttribute("nonce", "TUPtOgUd");
			js.setAttribute("crossorigin", "anonymous");
		    fjs.parentNode.insertBefore(js, fjs);
		}(document, 'script', 'fb-script'));
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

// remove variables no longer used on other pages
function unload() {
	if (document.querySelector("#pig")){
		imageData.destroy();
		pig.destroy();
		options.destroy();
	}

	if (document.querySelector(".fb-comments")){
		document.querySelector("#fb-script").remove();
	}

}

init();
swup.on('willReplaceContent', unload);
swup.on('contentReplaced', init);
