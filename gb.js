/////////////////////////////////////////////////////////////////////
// Smooth Scrolling
/////////////////////////////////////////////////////////////////////
function smoothScroll(target, offset = 64, duration = 1500) {
    $('html, body').stop().animate({
        scrollTop: $(target).offset().top - offset
    }, duration, 'easeInOutExpo');
}

$('.page-scroll').on('click', function(event) {
    event.preventDefault();
    smoothScroll($(this).attr('href'));
});

////////////////////////////////////////////////////////////////////////
// Animated Header
////////////////////////////////////////////////////////////////////////
function animatedHeader() {
    const docElem = document.documentElement;
    const header = document.querySelector('.navbar-fixed-top');
    const changeHeaderOn = 10;
    let didScroll = false;

    function scrollPage() {
        const sy = window.pageYOffset || docElem.scrollTop;
        if (sy >= changeHeaderOn) {
            header.classList.add('navbar-shrink');
        } else {
            header.classList.remove('navbar-shrink');
        }
        didScroll = false;
    }

    window.addEventListener('scroll', function(event) {
        if (!didScroll) {
            didScroll = true;
            requestAnimationFrame(scrollPage, 250);
        }
    }, false);
}

animatedHeader();

//////////////////////////////////////////////
// Highlight Active Nav Link
//////////////////////////////////////////////
$('body').scrollspy({
    target: '.navbar',
    offset: 65
});

///////////////////////////////////////////
// Page Loader
///////////////////////////////////////////
$(window).on('load', function() {
    $(".page-loader").fadeOut("slow");
});

////////////////////////////////////////////////////
// OWL Carousels
////////////////////////////////////////////////////
function initOwlCarousel(selector, options) {
  $(selector).owlCarousel(options);
}

initOwlCarousel("#owl-intro-text", {
    singleItem: true,
    autoPlay: 6000,
    stopOnHover: true,
    navigation: false,
    navigationText: false,
    pagination: true
});

initOwlCarousel("#owl-partners", {
    items: 4,
    itemsDesktop: [1199, 3],
    itemsDesktopSmall: [980, 2],
    itemsTablet: [768, 2],
    autoPlay: 5000,
    stopOnHover: true,
    pagination: false
});

initOwlCarousel("#owl-testimonial", {
    singleItem: true,
    pagination: true,
    autoHeight: true
});


////////////////////////////////////////////////////////////////////
// Stellar (parallax)
////////////////////////////////////////////////////////////////////
$.stellar({
    horizontalScrolling: false,
    verticalScrolling: true,
});

///////////////////////////////////////////////////////////
// WOW animation scroll
///////////////////////////////////////////////////////////
new WOW().init();

////////////////////////////////////////////////////////////////////////////////////////////
// Counter-Up
////////////////////////////////////////////////////////////////////////////////////////////
$('.counter').counterUp({
    delay: 10,
    time: 2000
});

////////////////////////////////////////////////////////////////////////////////////////////
// Isotope
////////////////////////////////////////////////////////////////////////////////////////////
$(window).on('load', function() {
    const $container = $('#portfolio');

    $('.portfolio_menu ul li').on('click', function() {
        $('.portfolio_menu ul li').removeClass('active_prot_menu');
        $(this).addClass('active_prot_menu');
    });

    $container.isotope({
        itemSelector: '.col-sm-4',
        layoutMode: 'fitRows'
    });

    $('#filters').on('click', 'a', function() {
        const filterValue = $(this).attr('data-filter');
        $container.isotope({filter: filterValue});
        return false;
    });
});


/////////////////////////
// Scroll to Top
/////////////////////////
function scrollToTop(duration = 1500) {
    $('html, body').animate({scrollTop: 0}, duration, 'easeInOutExpo');
}

$(window).on('scroll', function() {
    if ($(this).scrollTop() > 100) {
        $('.scrolltotop').fadeIn();
    } else {
        $('.scrolltotop').fadeOut();
    }
});

$('.scrolltotop').on('click', function() {
    scrollToTop();
    return false;
});

////////////////////////////////////////////////////////////////////
// Close Mobile Menu on Click
////////////////////////////////////////////////////////////////////
$(document).on('click', '.navbar-collapse.in', function(e) {
    if ($(e.target).is('a') && !$(e.target).hasClass('dropdown-toggle')) {
        $(this).collapse('hide');
    }
});
