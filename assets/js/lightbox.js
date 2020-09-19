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

    // If we click an element with the attribute "data-lightbox", show the lightbox
    if (elem.hasAttribute('data-lightbox')) {
        event.preventDefault();

        newImg.onload = function() {
            lightboxImg.src = this.src;
        }

        newImg.src = elem.getAttribute('data-lightbox');
        lightbox.classList.add('visible');
    }

    else if (elem.tagName == "IMG") {
        newImg.onload = function() {
            lightboxImg.src = this.src;
        }

        fp = elem.getAttribute('src').split('/').slice(-1)[0];
        extension = fp.split('.').slice(-1)[0];
        fp = '/assets/images/' + fp.split('-')[0] + '.' + extension;

        newImg.src = fp;
        lightbox.classList.add('visible');

    }

    // If we click any of these 2 elements, close the lightbox
    if (elemID == 'lightbox-image' || elemID == 'lightbox-overlay') {
        event.preventDefault();

        lightbox.classList.remove('visible');
    }
}