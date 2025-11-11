var multipleItemCarousel = document.querySelector('#carouselExampleControls');

if(window.matchMedia("(min-width:576px)").matches){
    const carousel = new bootstrap.Carousel(multipleItemCarousel, {
        interval: false,
    });


    var carouselWidth = $('.carousel-inner')[0].scrollWidth;
    var cardWidth = $('.carousel-item').width();
    var scrollPosition = 0;

    $('.carousel-control-next').on('click', function () {
        var carouselWidth = $('.carousel-inner')[0].scrollWidth;
        var cardWidth = $('.carousel-item').outerWidth(true);
        if (scrollPosition < (carouselWidth - (cardWidth * 4))) {
            console.log('next');
            scrollPosition = scrollPosition + cardWidth;
            $('.carousel-inner').animate({ scrollLeft: scrollPosition }, 600);
        }
    });
    
    $('.carousel-control-prev').on('click', function () {
        var carouselWidth = $('.carousel-inner')[0].scrollWidth;
        var cardWidth = $('.carousel-item').outerWidth(true);
        if (scrollPosition > 0) {
            console.log('prev');
            scrollPosition = scrollPosition - cardWidth;
            $('.carousel-inner').animate({ scrollLeft: scrollPosition }, 600);
        }
    });

}else{
    $(multipleItemCarousel).addClass('slide');

}

$(document).ready(function() {
    $('#carouselExampleControls').carousel();
});

