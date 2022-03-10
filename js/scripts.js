var svgRoot;
var locked = false;

$(window).on('load', function() {
    //    alert(42);
    
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const file = urlParams.get('f');

    var antelope = "titration";
    
    if(file !== null) {
	antelope = file.replace(/[^a-z0-9]/gi, '_').toLowerCase();;
    }

    var a = document.getElementById("svg");
    a.setAttribute("data", "antelopes/" + antelope + ".svg");
    a.addEventListener('load', svgLoaded);

});

function svgLoaded() {
    var a = document.getElementById("svg");
    svgRoot = a.contentDocument;

    $("[id^='Keks']",svgRoot).each(function (i, el) {
        $(this).click(clickHandler);
        $(this).on('mouseup',releaseLock);
        $(this).on('touchstart',clickHandler);
        $(this).on('touchstop',releaseLock);
    });

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    var level = urlParams.get('l');
    if(level !== null) {
	level = level.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    }
    if(level) {
        hideLevel('Journeyman');
        hideLevel('Apprentice');
        hideLevel('Master');
	
	if(level.includes('m')) {
	    unHideLevel('Master');
	}
	if(level.includes('j')) {
	    unHideLevel('Journeyman');
	}
	if(level.includes('a')) {
	    unHideLevel('Apprentice');
        }
    }
}


function releaseLock() {
    locked = false;
}

function clickHandler(event) {
    //if(locked) return;
    locked = true;
    event.preventDefault();
    var opa = this.getAttribute("opacity");
    if(opa == 0) {opa=1;} else {opa=0;}
    this.setAttribute("opacity", opa);
   
    var postfix = getPostfix($(this));
    $("[id='Text"+postfix+"']",svgRoot).each(function (i, el) {
	opa = this.getAttribute("opacity");
	 if(opa == 0.3) {opa=1;} else {opa=0.3;}
	this.setAttribute("opacity", opa);
    });
}

function getPostfix(element) {
    return element.attr('id').substr(4);
}

function hideLevel(level) {
    $("[id*='"+level+"']",svgRoot).each(function (i, el) {
	this.setAttribute("opacity", "0");
    });
}

function unHideLevel(level) {
    $("[id*='"+level+"']",svgRoot).each(function (i, el) {
        this.setAttribute("opacity", "1");
    });
}
