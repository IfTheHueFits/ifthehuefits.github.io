/*
 * - Add an event listener for document click
 * - Define a function that filters the unwanted click events on the document
 */

// configure carousel.
var flkty = new Flickity( '#lightbox-carousel', {
	// options
	"cellAlign": 'center',
});

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
		lightboxCar.style.display = "none";
		lightbox.getElementsByTagName("NAV")[0].style.display = "none";
	}

	else if ((elem.tagName == "IMG") && !(lightbox.classList.contains('visible'))) {
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
		lightboxCar.style.display = "block";

	}

	else if (elemID == "mobile") {
		lightbox.classList.add('visible');
		lightbox.style.alignItems = "initial";
		lightbox.getElementsByTagName("NAV")[0].style.display = "flex";
		lightbox.style.display = "flex";
	}

}