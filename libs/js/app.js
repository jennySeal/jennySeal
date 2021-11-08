
$("#hamburgerMain").on("click", function() {
    $("#nav-links").toggle()
})



const projects = [
    {projectName: 'The Gazetteer',
    projectSrc: './libs/css/images/gazetteer.png',
    projectAlt: 'The Gazetteer - a map based app providing world wide information',
    projectDesc: "An IT Career Switch project to create a single page web app based around  Leaflet's interactive mapping library. By clicking on the map or selecting a country the user can discover a wealth of information presented in an attractive mobile-first design.",
    projectTech: 'Technologies used include HTML, CSS, Javascript, PHP and the Leaflet library.',
    projectLink: 'https://jennyseal.com/project1',
    projectGit: 'https://github.com/jennySeal/jennySeal/',
    objectID: 0
},
 {projectName: 'Sunshine Stores E-Commerce Site',
    projectSrc: './libs/css/images/sunshineSells.png',
    projectAlt: 'Sunshine Stores ECO E-commerce Site',
    projectDesc: 'A Codecademy project to create a fully-functioning e-commerce application with secure user registration and login, a reviewable cart, complete purchasing and order history.',
    projectTech: 'Technologies used include React, Redux, Stripe, Passport, Express, Node JS and PostgreSQL. Hosted on Heroku and Netlify.',
    projectLink: 'https://sunshine-store.netlify.app/',
    projectGit: 'https://github.com/jennySeal/sunshine-sell/',
    objectID: 1
},
    {projectName: 'Reddit Sublime App',
    projectSrc: './libs/css/images/Reddit-Sublime.gif',
    projectAlt: 'Reddit Sublime project',
    projectDesc: 'Create an application that will allow users to view and search posts and comments provided by the Reddit API.',
    projectTech: 'Technologies used include React, Redux and Sass. Hosted on Netlify.',
    projectLink: 'https://reddit-sublime.netlify.app/',
    projectGit: 'https://github.com/jennySeal/sunshine-sell/',
    objectID: 2},

    {projectName: 'Birthday Countdown App',
    projectSrc: './libs/css/images/BirthdayCountdown.png',
    projectAlt: 'Birthday Countdown project',
    projectDesc: 'An app that provides information about your birthday and a real-time countdown until the big day',
    projectTech: 'A React app hosted on Netlify.',
    projectLink: 'https://birthday-countdown-calculator.netlify.app/',
    projectGit: 'https://github.com/jennySeal/birthday-countdown',
    objectID: 3}
]

$("#nav-menu").click(function () {
   
        $('#nav-links').attr("display", "block");

   
  });
  



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
    document.getElementById('gitHubLink').href = projects[objectId].projectGit;
}


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



