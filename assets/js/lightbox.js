/*
 * - Add an event listener for document click
 * - Define a function that filters the unwanted click events on the document
 */

// configure carousel.
var flkty
var flkty_set = false;

// Add an event listener for document click
document.addEventListener('click', lightboxClick);

// Define a function that filters the unwanted click events on the document
function lightboxClick(event) {
	var elem = event.target,
		elemID = elem.getAttribute('id'),
		lightboxCar = document.getElementById('lightbox-carousel'),
		lightbox = document.getElementById("lightbox-overlay"),
		newImg = new Image();
		fp = '';
		extension = '';

	// If we click any of these 2 elements, close the lightbox
	if (elemID == 'lightbox-overlay' || elem.tagName == "NAV" || elem.tagName == "A") {
		event.preventDefault();

		// lightboxImg.src = "/assets/images/spinner.svg";	// stops old image flashing up when selecting new one
		lightbox.classList.remove('visible');
		if (flkty_set){
			flkty.destroy()
			lightboxCar.innerHTML = '';
			flkty_set = false;
		}
		lightboxCar.style.display = "none";
		lightbox.getElementsByTagName("NAV")[0].style.display = "none";
	}

	else if ((elem.tagName == "IMG") && !(lightbox.classList.contains('visible'))) {
		lightboxCar.style.display = "initial";
		var pageImgs = document.querySelector("main").getElementsByTagName("img");
		flkty = new Flickity( '#lightbox-carousel', {
			// options
			"cellAlign": 'center',
		});
		flkty_set = true;

		// find clicked element in list
		var i;
		for (i=0; i<pageImgs.length; i++){
			if (pageImgs[i] == elem){
				break;
			}
		}

		if (pageImgs.length < 5 ){
			carousel_len = pageImgs.length;
			for (j=0; j<pageImgs.length; j++){
				var newCell = document.createElement("div");
				newCell.className = "gallery-cell";

				var newImg = pageImgs[j].cloneNode(true);
				newImg.className = "carousel-image";
				newCell.appendChild(newImg);
				lightboxCar.appendChild(newCell);
				flkty.append(newCell);
			}
		}


		// newImg.onload = function() {
		// 	lightboxImg.src = this.src;
		// }

		// fp = elem.getAttribute('src')
		// extension = fp.split('.').slice(-1)[0];
		// fp = fp.replace(/(-[0-9]+-[0-9a-f]{9})?\.(je?pg|png|gif)/, '');
		//
		// if (fp.includes('generated/')){
		// 	fp = fp.replace('generated/', '');
		// }

		// newImg.src = fp + '.' + extension;
		lightbox.classList.add('visible');
		lightbox.style.alignItems = "center";
		lightbox.style.display = "flex";
	}

	else if (elemID == "mobile") {
		lightbox.classList.add('visible');
		lightbox.style.alignItems = "initial";
		lightbox.getElementsByTagName("NAV")[0].style.display = "flex";
		lightbox.style.display = "flex";
	}

}