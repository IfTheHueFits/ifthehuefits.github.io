/*
 * Manages the lightbox carousel and overlay.
 */

// configure carousel.
let flkty;

function openOverlay(type) {
    const lightbox = document.getElementById(type + "-overlay");
    lightbox.showModal();
    lightbox.focus();
    lightbox.classList.add('visible');
}

function openImgOverlay(event) {
    if (event.target.tagName !== 'IMG') return;
    openOverlay("image");
    buildCarousel(event.target);
}

function buildCarousel(img){
    const pageImgs = document.querySelector("main").getElementsByTagName("img");
    // Open first so Flickity can measure a laid-out dialog (closed <dialog> is display:none).
    flkty = new Flickity( '#lightbox-carousel', {
        cellAlign: 'center',
        lazyLoad: true,
        pageDots: false,
        setGallerySize: false // flickity gallery doesn't show if this is not set to false
    });

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

function dismissOverlay(type) {
    const lightbox = document.getElementById(type + "-overlay");
    lightbox.classList.remove('visible');
    lightbox.addEventListener('transitionend', function onFade(event) {
        if (event.propertyName !== 'opacity') return;
        lightbox.close();
        lightbox.removeEventListener('transitionend', onFade);

        if (type === "image") {
            const lightboxCar = document.getElementById('lightbox-carousel');
            flkty.destroy()
            lightboxCar.innerHTML = '';
        }
    });
}

document.querySelector("main").addEventListener('click', openImgOverlay);
document.getElementById("mobile").addEventListener("click", (event) => openOverlay("nav"));

const lightboxTypes = ["image", "nav"]
for (const type of lightboxTypes){
    document.getElementById(type + "-close").addEventListener("click", (event) => dismissOverlay(type));
    // Escape closes immediately unless cancelled; fade out instead.
    document.getElementById(type + "-overlay").addEventListener('cancel', (event) => {
        event.preventDefault();
        dismissOverlay(type);
    });
}