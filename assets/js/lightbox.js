---
layout: none
---
/*
 * - Add an event listener for document click
 * - Define a function that filters the unwanted click events on the document
 */

// configure carousel.
var flkty
var flkty_set = false;
var lightbox_visible = false;
// NOTE sizes also defined in script.js
var sizes = [{%  for size in site.data.picture.presets.default.widths %} {{size}}, {%endfor%}];

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
		if (elemID == 'lightbox-overlay' || elem.tagName == "NAV" || elem.tagName == "A" || elemID == "close") {
			event.preventDefault();

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
		}

		// load images
		// NOTE if not lazloaded, opacity needs to be set to 1
		/* NOTE in jekyll serve, the lazyload appears that it might be causing
		some timeout or bad requests, if this causes a problem on the server
		a manual lazy load needs to be implemented*/
		for (j=0; j<pageImgs.length; j++){
			var newCell = document.createElement("div");
			newCell.className = "gallery-cell";

			var newImg = pageImgs[j].cloneNode(true);
			newImg.className = "carousel-image";

			// i.e. if pig, just load full size image
			if(!newImg.srcset){
				var fp = newImg.getAttribute('src')
				fp = fp.replace(/-([0-9]+)-/, '-@-');
				srcset = ''
				for(k=0; k<sizes.length; k++){
					srcset += fp.replace(/(@)/, sizes[k]) + ' ' + sizes[k] + 'w, '
				}
				newImg.setAttribute("data-flickity-lazyload", fp.replace(/(@)/, 1000) );
				newImg.setAttribute("data-flickity-lazyload-srcset", srcset );
			}
			else{
				newImg.setAttribute("data-flickity-lazyload-srcset", newImg.srcset );
				newImg.setAttribute("data-flickity-lazyload", newImg.src );
			}
			newImg.srcset = '';
			newImg.src = '';
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