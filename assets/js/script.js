const swup = new Swup()

function init(){
	if (document.querySelector("#pig")){
		var imageData = [
			{filename: 'apples', aspectRatio: 1.5},
			{filename: 'kiwi', aspectRatio: 1.5},
			{filename: 'bananas', aspectRatio: 1.5},
		];

		// // get list of just filnames to sort hashes
		// var filenames = []
		// var hashes = []
		// var folder = "/generated/assets/images/";
		//
		// for (name in imageData){
		// 	filenames.push(imageData[name].filename);
		// }
		// // console.log(filenames);
		//
		// // ajax request to find the jekyll_picture_tag hashes that are added to
		// // filename
		// $.ajax({
		// 	url : folder,
		// 	success: function (data) {
		// 		console.log("FUNCTION CALLED");
		// 		console.log($(data));
		// 		// console.log($(data).find("a"));
		// 		// $(data).find("a").attr("href", function (i, val) {
		// 		// 	console.log(i);
		// 		// 	console.log(val);
		// 		// 	for (name in filenames){
		// 		// 		var pattern = new RegExp(name + '[0-9]*-[0-9a-f]*\.(jpe?g|png|gif)');
		// 		// 		if( val.match(pattern) ) {
		// 		// 			hashes.push(val.match(/[0-9a-f]{9}/))
		// 		// 		}
		// 		// 	}
		// 		// 	// console.log(hashes);
		// 		// });
		// 	}
		// });
		//

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
$.getJSON("assets/js/pictures.json", function(data) {
	console.log(data);
})
swup.on('contentReplaced', init);
