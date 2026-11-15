/*
 * Manages the lightbox carousel and overlay.
 */

// configure carousel.
let flkty;
let flkty_set = false;

function openOverlay(type) {
    const alignment = {
        "nav": "initial",
        "lightbox": "center"
    }
    if (type === "image") {
        type = "lightbox";
    }
    const lightbox = document.getElementById(type + "-overlay");
    lightbox.style.alignItems = alignment[type];
    lightbox.showModal();
    lightbox.focus();
    lightbox.classList.add('visible');
}

function dismissOverlay() {
    const lightboxCar = document.getElementById('lightbox-carousel');
    const lightbox = document.getElementById("lightbox-overlay");
    if (!lightbox.open || !lightbox.classList.contains('visible')) return;

    lightbox.classList.remove('visible');

    // event listener for transition end to ensure the overlay is closed after the transition
    lightbox.addEventListener('transitionend', function onFade(event) {
        if (event.propertyName !== 'opacity') return;
        lightbox.close();
        lightbox.removeEventListener('transitionend', onFade);
        if (flkty_set){
            flkty.destroy()
            lightboxCar.innerHTML = '';
            flkty_set = false;
        }
    });
}

function buildCarousel(img){
    const lightboxCar = document.getElementById('lightbox-carousel');
    const pageImgs = document.querySelector("main").getElementsByTagName("img");
    lightboxCar.style.display = "initial";
    // Open first so Flickity can measure a laid-out dialog (closed <dialog> is display:none).
    openOverlay("image");
    flkty = new Flickity( '#lightbox-carousel', {
        cellAlign: 'center',
        lazyLoad: true,
        pageDots: false,
        setGallerySize: false // flickity gallery doesn't show if this is not set to false
    });

    flkty_set = true;

    // find clicked element in list
    let i;
    for (let j=0; j<pageImgs.length; j++){
        if (pageImgs[j] == img){
            i = j;
            break;
        }
    }

    // load images as new div in page
    for (let j=0; j<pageImgs.length; j++){
        const newCell = document.createElement("div");
        newCell.className = "gallery-cell";

        // clone img from the main page
        const newImg = pageImgs[j].cloneNode(true);
        newImg.className = "carousel-image";

        // set the data load attributes for flickity from the img div
        newImg.setAttribute("data-flickity-lazyload-srcset", newImg.srcset );
        newImg.setAttribute("data-flickity-lazyload", newImg.src );
        // now clear the src attributes in the actual image so they don't automatically load
        newImg.srcset = '';
        newImg.src = '';
        // remove any bespoke styling such as height limits
        newImg.style = '';

        // sizes describes the image on the page, not in the full-screen
        // carousel, so let the browser fall back to 100vw
        newImg.removeAttribute('sizes');
        newCell.appendChild(newImg);
        flkty.append(newCell);
    }
    flkty.select(i, true, true);
}

// Define a function that filters the unwanted click events on the document
function lightboxClick(event) {
    if (event.target.tagName !== 'IMG') return;
    buildCarousel(event.target);
}

// Add an event listener for document click
document.addEventListener('click', lightboxClick);
document.getElementById("mobile").addEventListener("click", (event) => openOverlay("nav"));
document.getElementById("close").addEventListener("click", (event) => dismissOverlay());

const lightboxRoot = document.getElementById("lightbox-overlay");
// Escape closes immediately unless cancelled; fade out instead.
lightboxRoot.addEventListener('cancel', (event) => {
    event.preventDefault();
    dismissOverlay(lightboxRoot, document.getElementById('lightbox-carousel'));
});
