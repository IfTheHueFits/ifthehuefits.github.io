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
var comments_on = false;
// NOTE sizes also defined in script.js
var sizes = [{%  for size in site.data.picture.presets.default.widths %} {{size}}, {%endfor%}];

// Add an event listener for document click
document.addEventListener('click', lightboxClick);

// Define a function that filters the unwanted click events on the document
function lightboxClick(event) {
	var elem = event.target,
		lightboxCar = document.getElementById('lightbox-carousel'),
		lightbox = document.getElementById("lightbox-overlay"),
		closeBtn = document.querySelector('.close')

	// If we click any of these 2 elements, close the lightbox
	if (elem.id == 'comments') {
		commentbox = document.querySelector('.comments');
		commentbox.id="graphcomment";
		elem.id='off';
		// comments_on = true;


		// comment box parameters that need to be set based on the website
		var __semio__params = {
			graphcommentId: "If-the-Hue-Fits", // do not change, used to match with commentbox

			behaviour: {
				// HIGHLY RECOMMENDED
				uid: commentbox.dataset.uid, // uniq identifer for the comments thread on your page (ex: your page id)
			}
		}

		// commentbox setup DO NOT EDIT
		function __semio__onload() {
			__semio__gc_graphlogin(__semio__params)
		}


		(function() {
			var gc = document.createElement('script'); gc.type = 'text/javascript'; gc.async = true;
			gc.onload = __semio__onload; gc.defer = true; gc.src = 'https://integration.graphcomment.com/gc_graphlogin.js?' + Date.now();
			(document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(gc);
		})();

	}
	else if (lightbox_visible){
		if (elem.id == 'lightbox-overlay' || elem.tagName == "NAV" || elem.tagName == "A" || elem.id == "close") {
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
				break;
			}
		}

		// load images as new div in page
		// NOTE if not lazloaded, opacity needs to be set to 1
		/* NOTE in jekyll serve, the lazyload appears that it might be causing
		some timeout or bad requests, if this causes a problem on the server
		a manual lazy load needs to be implemented*/
		for (j=0; j<pageImgs.length; j++){
			var newCell = document.createElement("div");
			newCell.className = "gallery-cell";

			// clone img from the main page
			var newImg = pageImgs[j].cloneNode(true);
			newImg.className = "carousel-image";

			// set the data load attributes for flickity from the img div
			// if pig image/ no srcset just set to largest image
			if(!newImg.srcset){
				var fp = newImg.getAttribute('src')
				fp = fp.replace(/-([0-9]+)-([a-f0-9]+\.)/, '-@-$2');
				console.log(fp);
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
			// now clear the src attributes in the actual image so they don't automatically load
			newImg.srcset = '';
			newImg.src = '';
			// remove any bespoke styling such as height limits
			newImg.style = '';
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

	else if (elem.id == "mobile") {
		lightbox.classList.add('visible');
		lightbox.style.alignItems = "initial";
		lightbox.getElementsByTagName("NAV")[0].style.display = "flex";
		lightbox.style.display = "flex";
		closeBtn.style.display = "block";
		lightbox_visible = true;
	}

}