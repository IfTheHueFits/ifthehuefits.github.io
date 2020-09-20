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
		};

		getGalleryData().then( function(response){
			imageData = response;
			pig = new Pig(imageData, options).enable();
		});
	}
}

init();
swup.on('contentReplaced', init);
