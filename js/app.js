/*
Author URI: http://webthemez.com/
Note: 
Licence under Creative Commons Attribution 3.0 
Do not remove the back-link in this web template 
-------------------------------------------------------*/

$(window).load(function() {
    jQuery('#all').click();
    return false;
});

$(document).ready(function() {
    $('#header_wrapper').scrollToFixed();
    $('.res-nav_click').click(function() {
        $('.main-nav').slideToggle();
        return false

    });
	
    function resizeText() {
        var preferredWidth = 767;
        var displayWidth = window.innerWidth;
        var percentage = displayWidth / preferredWidth;
        var fontsizetitle = 25;
        var newFontSizeTitle = Math.floor(fontsizetitle * percentage);
        $(".divclass").css("font-size", newFontSizeTitle)
    }
    if ($('#main-nav ul li:first-child').hasClass('active')) {
        $('#main-nav').css('background', 'none');
    }
    $('#mainNav').onePageNav({
        currentClass: 'active',
        changeHash: false,
        scrollSpeed: 950,
        scrollThreshold: 0.2,
        filter: '',
        easing: 'swing',
        begin: function() {
        },
        end: function() {
            if (!$('#main-nav ul li:first-child').hasClass('active')) {
                $('.header').addClass('addBg');
            } else {
                $('.header').removeClass('addBg');
            }

        },
        scrollChange: function($currentListItem) {
            if (!$('#main-nav ul li:first-child').hasClass('active')) {
                $('.header').addClass('addBg');
            } else {
                $('.header').removeClass('addBg');
            }
        }
    });

    var container = $('#portfolio_wrapper');


    container.isotope({
        animationEngine: 'best-available',
        animationOptions: {
            duration: 200,
            queue: false
        },
        layoutMode: 'fitRows'
    });

    $('#filters a').click(function() {
        $('#filters a').removeClass('active');
        $(this).addClass('active');
        var selector = $(this).attr('data-filter');
        container.isotope({
            filter: selector
        });
        setProjects();
        return false;
    });

    function splitColumns() {
        var winWidth = $(window).width(),
            columnNumb = 1;


        if (winWidth > 1024) {
            columnNumb = 4;
        } else if (winWidth > 900) {
            columnNumb = 2;
        } else if (winWidth > 479) {
            columnNumb = 2;
        } else if (winWidth < 479) {
            columnNumb = 1;
        }

        return columnNumb;
    }
	
    function setColumns() {
        var winWidth = $(window).width(),
            columnNumb = splitColumns(),
            postWidth = Math.floor(winWidth / columnNumb);

        container.find('.portfolio-item').each(function() {
            $(this).css({
                width: postWidth + 'px'
            });
        });
    }

    function setProjects() {
        setColumns();
        container.isotope('reLayout');
    }

    container.imagesLoaded(function() {
        setColumns();
    });


    $(window).bind('resize', function() {
        setProjects();
    });

   $(".fancybox").fancybox();
});

wow = new WOW({
    animateClass: 'animated',
    offset: 100
});
wow.init();
/*document.getElementById('').onclick = function() {
    var section = document.createElement('section');
    section.className = 'wow fadeInDown';
    section.className = 'wow shake';
    section.className = 'wow zoomIn';
    section.className = 'wow lightSpeedIn';
    this.parentNode.insertBefore(section, this);
};*/

const projects = [
    
{projectName: 'Company Directory',
projectSrc: './img/company_directory.png',
projectAlt: 'Company Directory application',
projectDesc: 'An IT Career Switch project to create a user interface for a personnel database with CRUD functionality. Built to allow users to add, edit and delete employees, departments and locations with suitable checks and validation.',
projectTech: 'HTML, CSS, jQuery, PHP and MySQL. ',
projectLink: 'https://jennyseal.com/project2/',
objectID: 0
},
 {projectName: 'Sunshine Stores E-Commerce Site',
    projectSrc: './img/sunshineSells.png',
    projectAlt: 'Sunshine Stores ECO E-commerce Site',
    projectDesc: 'A Codecademy project to create a fully-functioning e-commerce application with secure user registration and login, a reviewable cart, complete purchasing and order history.',
    projectTech: 'React, Redux, Stripe, Passport, Express, Node JS and PostgreSQL. Hosted on Heroku and Netlify.',
    projectLink: 'https://sunshine-store.netlify.app/',
    objectID: 1
},
    {projectName: 'Reddit Sublime App',
    projectSrc: './img/Reddit-Sublime.gif',
    projectAlt: 'Reddit Sublime project',
    projectDesc: 'Create an application that will allow users to view and search posts and comments provided by the Reddit API.',
    projectTech: 'React, Redux and Sass. Hosted on Netlify.',
    projectLink: 'https://reddit-sublime.netlify.app/',
    objectID: 2},

    {projectName: 'Birthday Countdown App',
    projectSrc: './img/BirthdayCountdown.png',
    projectAlt: 'Birthday Countdown project',
    projectDesc: 'An app that provides information about your birthday and a real-time countdown until the big day',
    projectTech: 'A React app hosted on Netlify.',
    projectLink: 'https://birthday-countdown-calculator.netlify.app/',
    projectGit: 'https://github.com/jennySeal/birthday-countdown',
    objectID: 3},
    {projectName: 'The Gazetteer',
    projectSrc: './img/gazetteer.png',
    projectAlt: 'The Gazetteer - a map based app providing world wide information',
    projectDesc: "An IT Career Switch project to create a single page web app based around  Leaflet's interactive mapping library. By clicking on the map or selecting a country the user can discover a wealth of information presented in an attractive mobile-first design.",
    projectTech: 'HTML, CSS, Javascript, PHP and Leaflet JS.',
    projectLink: 'https://jennyseal.com/project1',
    objectID: 4
},
]

let objectId = 0;


    const changeProject = (objectId) => {
    let projectName = document.getElementById('projectName');
    projectName.textContent=projects[objectId].projectName;

    let projectImage = document.getElementById('projectImage');
    projectImage.src=projects[objectId].projectSrc;
   
    let projectAlt = document.getElementById('projectImage').alt = projects[objectId].projectAlt;

    let projectDesc = document.getElementById('projectDescription');
    projectDesc.textContent=projects[objectId].projectDesc;

    let projectTech = document.getElementById('projectTech');
    projectTech.textContent=projects[objectId].projectTech;

    document.getElementById('projectLink').href = projects[objectId].projectLink;
}

$("#scrollOther").click(function() {
    console.log('hello')
    scrollOther()
})

$("#scrollRight").click(function() {
    $("#projectContainer").fadeOut('fast')    
    scrollRight()
    $("#projectContainer").fadeIn('slow')    
})

const scrollOther = () => {
    if (objectId < 1) {
        objectId = projects.length
    }
    objectId--;
    
    changeProject(objectId);
    
}


const scrollRight = () => {
    if (objectId === (projects.length - 1)) {
        objectId = -1;
    }
    objectId++; 
    changeProject(objectId)
}


