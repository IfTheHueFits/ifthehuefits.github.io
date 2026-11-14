/*
Event listener to load the comments box at the bottom of a page. Triggered by
the 'Show Comments' button. I think I got most of this code from the GraphComment
website.
*/

document.addEventListener('click', function(event) {
    const commentsLink = event.target.closest('#comments');
    if (!commentsLink) {
        return;
    }

    const commentbox = document.querySelector('.comments');
    commentbox.id="graphcomment";
    commentsLink.id='off';

    // comment box parameters that need to be set based on the website
    const __semio__params = {
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
        const gc = document.createElement('script'); gc.type = 'text/javascript'; gc.async = true;
        gc.onload = __semio__onload; gc.defer = true; gc.src = 'https://integration.graphcomment.com/gc_graphlogin.js?' + Date.now();
        (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(gc);
    })();
});
