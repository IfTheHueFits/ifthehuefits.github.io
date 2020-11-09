/*
 * - Add an event listener for document click
 * - Define a function that filters the unwanted click events on the document
 */

// Add an event listener for document click
document.addEventListener('click', lightboxClick);

// Define a function that filters the unwanted click events on the document
function lightboxClick(event) {
	var elem = event.target,
		elemID = elem.getAttribute('id'),
		lightboxImg = document.getElementById('lightbox-image'),
		lightbox = document.getElementById("lightbox-overlay"),
		newImg = new Image();
		fp = '';
		extension = '';

	// If we click any of these 2 elements, close the lightbox
	if (elemID == 'lightbox-image' || elemID == 'lightbox-overlay' || elem.tagName == "NAV") {
		event.preventDefault();

		lightboxImg.src = "";	// stops old image flashing up when selecting new one
		lightbox.classList.remove('visible');
		lightboxImg.style.display = "none";
		lightbox.getElementsByTagName("NAV")[0].style.display = "none";
	}
	// If we click an element with the attribute "data-lightbox", show the lightbox
	else if (elem.hasAttribute('data-lightbox')) {
		event.preventDefault();

		newImg.onload = function() {
			lightboxImg.src = this.src;
		}

		newImg.src = elem.getAttribute('data-lightbox');
		lightbox.classList.add('visible');
		lightboxImg.style.display = "block";
	}

	else if (elem.tagName == "IMG") {
		newImg.onload = function() {
			lightboxImg.src = this.src;
		}

		fp = elem.getAttribute('src')
		extension = fp.split('.').slice(-1)[0];
		fp = fp.replace(/(-[0-9]+-[0-9a-f]{9})?\.(je?pg|png|gif)/, '');

		if (fp.includes('generated/')){
			fp = fp.replace('generated/', '');
		}

		newImg.src = fp + '.' + extension;
		lightbox.classList.add('visible');
		lightbox.style.display = "flex";
		lightboxImg.style.display = "block";

	}

	else if (elemID == "mobile") {
		lightbox.classList.add('visible');
		lightbox.getElementsByTagName("NAV")[0].style.display = "flex";
		lightbox.style.display = "block";
	}

}