/*
Manages events and functions for the main page.
*/

// Swap the background image of the side panel.
function swap_background(file, backgrounds) {
    for (let i=0; i<2; i++){
        if (backgrounds[i].className.includes("img-on")){
            backgrounds[i].className = backgrounds[i].className.replace(" img-on", "")
        }
        else {
            backgrounds[i].style.backgroundImage = 'url("' + file + '")';
            backgrounds[i].className += " img-on";
        }
    }
}

// Determines which specific background image to use based on the screen width.
function gen_background_file(srcset, ratio, backgrounds){
    let width = screen.width;
    const entries = srcset.split(',');
    const candidates = [];
    let chosen;

    // correct width if it is in a column
    if (screen.width > 1024){
        width = screen.height*ratio;
    }

    for(let i=0; i<entries.length; i++){
        const parts = entries[i].trim().split(/\s+/);
        candidates.push({url: parts[0], width: parseInt(parts[1], 10)});
    }
    candidates.sort(function(a,b){return a.width-b.width;});

    // smallest listed width that still covers the space; otherwise the largest
    chosen = candidates[candidates.length-1].url;
    for(let i=0; i<candidates.length; i++){
        if (candidates[i].width > width){
            chosen = candidates[i].url;
            break;
        }
    }

    swap_background(chosen, backgrounds);
}

function init(){
    // PART 1 if there is a gallery fade in gallery images once loaded
    document.querySelectorAll(".gallery-item img").forEach(function(img){
        if (img.complete) {
            img.classList.add("loaded");
        }
        else {
            img.addEventListener("load", function(){ img.classList.add("loaded"); });
        }
    });

    // PART 2 Change background of side pannel
    const backgrounds = document.getElementsByClassName("side-bar-img");
    const aside_element = document.querySelector("aside");
    const srcset = aside_element.dataset.srcset;
    const ratio = aside_element.dataset.ratio;
    const banner_stem = srcset.split(',')[0].trim().split(/\s+/)[0]
        .replace(/-\d+-[0-9a-f]+\.[^.]+$/, '')
        .split('/generated/images/')[1];

    // check if background image is actually different and switch if so
    if (!document.querySelector(".img-on").style.backgroundImage.includes(banner_stem)) {
        gen_background_file(srcset, ratio, backgrounds);
    }

}

// remove variables no longer used on other pages
function unload() {
    //Not currently doing anything
}

//first load
init();

//add swup event listeners
try {
    const swup = new Swup({
        containers: ['.side-heading', '.main-window'],
        plugins: [new SwupScrollPlugin({
            animateScroll: false,
        })]
    });
    swup.on('willReplaceContent', unload);
    swup.on('contentReplaced', init);
}
catch(err){
    console.log(err.message);
}
