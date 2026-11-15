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
    console.log(alignment[type]);
    lightbox.style.alignItems = alignment[type];
    lightbox.showModal();
    lightbox.focus();
    lightbox.classList.add('visible');
}

function dismissOverlay(lightbox, lightboxCar) {
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
    const target = event.target;
    const lightboxCar = document.getElementById('lightbox-carousel');
    const lightbox = document.getElementById("lightbox-overlay");
    const img = target.closest('main img');
    const mobileBtn = target.closest('#mobile');

    // if the lightbox is open, dismiss it
    if (lightbox.open){
        if (target === lightbox || target.closest('#close') || target.closest('#lightbox-overlay nav')) {
            event.preventDefault();
            dismissOverlay(lightbox, lightboxCar);
        }
    }
    // if the image is clicked, open the lightbox
    else if (img) {
        buildCarousel(img);
    }

    else if (mobileBtn) {
        openOverlay("nav");
    }
}

// Add an event listener for document click
document.addEventListener('click', lightboxClick);

const lightboxRoot = document.getElementById("lightbox-overlay");
// Escape closes immediately unless cancelled; fade out instead.
lightboxRoot.addEventListener('cancel', (event) => {
    event.preventDefault();
    dismissOverlay(lightboxRoot, document.getElementById('lightbox-carousel'));
});
