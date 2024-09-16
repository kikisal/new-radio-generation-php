(() => {

    const sliderController = domSelect('.image-slider-controller');
    const sliderItems      = domSelect('[--slider-items]');
    
    let firstImage    = null;
    let imageItemSize = 0;
    let sliderPos = 0;
    let lastFrame = undefined;
    
    function loop(t) {
    
        if (!lastFrame)
            lastFrame = t;
    
        const dt  = (t - lastFrame)/1000;
        lastFrame = t;
    
        if (!firstImage) {
            firstImage    = sliderItems.children[0];
            imageItemSize = getRectOf(firstImage).width;
        }
    
        const rect = getRectOf(firstImage);
    
        if (Math.abs(rect.x) > imageItemSize ) {
            sliderItems.appendChild(firstImage);
            firstImage = null;
            sliderPos  = 3;
        } else {
            sliderPos -= 100*dt;
        }
    
        sliderController.style.transform = `translateX(${sliderPos}px)`;
        requestAnimationFrame(loop);
    }
    
    function getRectOf(element) {
        return element.getBoundingClientRect();
    }
    
    
    requestAnimationFrame(loop);
})();