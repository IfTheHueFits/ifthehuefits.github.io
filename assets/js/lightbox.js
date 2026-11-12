/*
 * Manages the lightbox carousel and overlay.
 */

// configure carousel.
let flkty;
let flkty_set = false;
let lightbox_visible = false;

function openOverlay(lightbox, closeBtn, { alignItems, showNav }) {
    lightbox.classList.add('visible');
    lightbox.style.alignItems = alignItems;
    lightbox.style.display = "flex";
    closeBtn.style.display = "block";
    if (showNav) {
        lightbox.getElementsByTagName("NAV")[0].style.display = "flex";
    }
    lightbox_visible = true;
}

// Add an event listener for document click
document.addEventListener('click', lightboxClick);

// Define a function that filters the unwanted click events on the document
function lightboxClick(event) {
    const target = event.target;
    const lightboxCar = document.getElementById('lightbox-carousel');
    const lightbox = document.getElementById("lightbox-overlay");
    const closeBtn = document.querySelector('.close');
    const img = target.closest('main img');
    const mobileBtn = target.closest('#mobile');

    if (lightbox_visible){
        if (target === lightbox || target.closest('#close') || target.closest('#lightbox-overlay nav')) {
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
    else if (img) {
        const pageImgs = document.querySelector("main").getElementsByTagName("img");
        lightboxCar.style.display = "initial";
        flkty = new Flickity( '#lightbox-carousel', {
            cellAlign: 'center',
            lazyLoad: true,
            pageDots: false
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
        // NOTE if not lazloaded, opacity needs to be set to 1
        /* NOTE in jekyll serve, the lazyload appears that it might be causing
        some timeout or bad requests, if this causes a problem on the server
        a manual lazy load needs to be implemented*/
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

        openOverlay(lightbox, closeBtn, { alignItems: "center", showNav: false });
    }

    else if (mobileBtn) {
        openOverlay(lightbox, closeBtn, { alignItems: "initial", showNav: true });
    }

}
