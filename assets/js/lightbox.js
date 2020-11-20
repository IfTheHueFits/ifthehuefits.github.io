/*
 * - Add an event listener for document click
 * - Define a function that filters the unwanted click events on the document
 */

// configure carousel.
var flkty
var flkty_set = false;
var lightbox_visible = false;

// Add an event listener for document click
document.addEventListener('click', lightboxClick);

// Define a function that filters the unwanted click events on the document
function lightboxClick(event) {
	var elem = event.target,
		elemID = elem.getAttribute('id'),
		lightboxCar = document.getElementById('lightbox-carousel'),
		lightbox = document.getElementById("lightbox-overlay"),
		closeBtn = document.querySelector('.close')

	// If we click any of these 2 elements, close the lightbox
	if (lightbox_visible){
		if (elemID == 'lightbox-overlay' || elem.tagName == "NAV" || elem.tagName == "A" || elem.className == "close" || elem.tagName == "path" || elem.tagName == "svg") {
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
			closeBtn.style.display = "none";
			lightbox_visible = false;
		}
	}
	else if ((elem.tagName == "IMG") && !(lightbox.classList.contains('visible'))) {
		pageImgs = document.querySelector("main").getElementsByTagName("img");
		lightboxCar.style.display = "initial";
		flkty = new Flickity( '#lightbox-carousel', {
			cellAlign: 'center',
			lazyLoad: true,
			pageDots: false
		});

		flkty_set = true;

		// filter out thumbnails in image gallery
		if (document.querySelector("#pig")){
			var tempArr = []
			for (j=0; j<pageImgs.length; j++){
				if(j % 2 != 0){
					tempArr.push(pageImgs[j])
				}
			}
			pageImgs = tempArr;
		}

		// find clicked element in list
		var i;
		for (j=0; j<pageImgs.length; j++){
			if (pageImgs[j] == elem){
				i = j;
			}
			if(!pageImgs[j].srcset){
				var fp = pageImgs[j].getAttribute('src');
				var extension = fp.split('.').slice(-1)[0];
				fp = fp.replace(/(-[0-9]+-[0-9a-f]{9})?\.(je?pg|png|gif)/, '');
				fp = fp.replace('generated/', '');
				pageImgs[j].src = fp + '.jpg';
			}
		}

		// load images
		for (j=0; j<pageImgs.length; j++){
			var newCell = document.createElement("div");
			newCell.className = "gallery-cell";

			var newImg = pageImgs[j].cloneNode(true);
			newImg.className = "carousel-image";

			// i.e. if pig, just load full size image
			if(!newImg.srcset){
				var fp = newImg.getAttribute('src')
				extension = fp.split('.').slice(-1)[0];
				fp = fp.replace(/(-[0-9]+-[0-9a-f]{9})?\.(je?pg|png|gif)/, '');
				fp = fp.replace('generated/', '');
				newImg.setAttribute("data-flickity-lazyload", fp + '.' + extension);
			}
			else{
				newImg.style.opacity = 1;
			}
			newCell.appendChild(newImg);
			flkty.append(newCell);
		}
		flkty.select(i, true, true);

		lightbox.classList.add('visible');
		lightbox.style.alignItems = "center";
		lightbox.style.display = "flex";
		closeBtn.style.display = "block";
		lightbox_visible = true;
	}

	else if (elemID == "mobile") {
		lightbox.classList.add('visible');
		lightbox.style.alignItems = "initial";
		lightbox.getElementsByTagName("NAV")[0].style.display = "flex";
		lightbox.style.display = "flex";
		closeBtn.style.display = "block";
		lightbox_visible = true;
	}

}