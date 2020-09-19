const swup = new Swup()


function init(){
	if (document.querySelector("#pig")){
		var imageData = [
			{filename: 'apples', aspectRatio: 1.5},
			{filename: 'kiwi', aspectRatio: 1.5},
			{filename: 'bananas', aspectRatio: 1.5},
		];

		var options = {
			urlForSize: function(filename, size) {
					return 'generated/assets/images/' + filename + '-' + size + '.jpg';
				},
			// ...
		};
		var pig = new Pig(imageData, options).enable();
	}
}

init();
swup.on('contentReplaced', init);
