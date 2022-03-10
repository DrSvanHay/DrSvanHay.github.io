var svgRoot;
var locked = false;

var w = null;
var e = null;
var n = null;
var z = null;

var mode = 0;

$(window).on('load', function() {

    var a = document.getElementById("svg");
    a.setAttribute("data", "rechner.svg");
    a.addEventListener('load', svgLoaded);

});

function svgLoaded() {
    var a = document.getElementById("svg");
    svgRoot = a.contentDocument;

    w = injectInput('Wirkungsgrad');
    e = injectInput('entwertete');
    n = injectInput('Nutzenergie');
    z = injectInput('zugefuhrte');
    
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

function injectInput(id) {
    var ret;
    $("[id^='"+id+"']",svgRoot).each(function (i, el) {
        var pathBBox =this.getBoundingClientRect();
        pathBBox =this.getBoundingClientRect();
	
        $(this).click(clickHandler);
        var input = document.createElement("input");
        input.type = "text";
        input.className = "rechner-input"; // set the CSS class
        input.id = "input-" + id;
        input.style.position = "absolute";
        input.style.top = pathBBox.y + "px";
        input.style.left = pathBBox.x + "px";
	input.style.width = pathBBox.width + "px";
	input.style.height = pathBBox.height + "px";
	input.type = "number";
	input.addEventListener("input", manageInput);
        $('#root').append(input); // put it into the DOM
	ret = input;
    });
    return ret;
}

function adjustInput(id) {
    var ret;
    $("[id^='"+id+"']",svgRoot).each(function (i, el) {
        var pathBBox =this.getBoundingClientRect();
	pathBBox =this.getBoundingClientRect();

        $(this).click(clickHandler);
        var input = document.createElement("input");
        input.type = "text";
        input.className = "rechner-input"; // set the CSS class                                                                                                          
        input.id = "input-" + id;
        input.style.position = "absolute";
        input.style.top = pathBBox.y + "px";
        input.style.left = pathBBox.x + "px";
        input.style.width = pathBBox.width + "px";
        input.style.height = pathBBox.height + "px";
        input.type = "number";
        input.addEventListener("input", manageInput);
        $('#root').append(input); // put it into the DOM                                                                                                                 
        ret = input;
    });
    return ret;
}

function manageInput() {
    contentW = parseFloat(w.value); // Wirkungsgrad
    contentE = parseFloat(e.value); // Entwertete Energie
    contentN = parseFloat(n.value); // Nutzbare Energie
    contentZ = parseFloat(z.value); // Zugeführte Energie
    
    //  Wirkungsgrad gegeben und Entwertete Energie gegeben -> Nutzenergie, zugeführte berechnen
    if(contentW > 0 && contentE > 0 && (mode == 0 || mode == 1)) {
	mode = 1;
	z.value = (contentE / (100-contentW) * 100).toFixed(1);
	n.value = (contentE / (100-contentW) * contentW).toFixed(1);
	z.classList.add("blue");
	n.classList.add("blue");
	return;
    }
    //  Wirkungsgrad gegeben und Nutzenergie gegeben -> Wärmemenge berechnen  
    else if(contentW > 0 && contentN > 0 && (mode == 0 || mode == 2)) {
	mode = 2;
	z.value = (contentN / contentW * 100).toFixed(1);
	e.value	= (contentN / contentW * (100 - contentW)).toFixed(1);
	z.classList.add("blue");
        e.classList.add("blue");
	return;
    }
    //  Wirkungsgrad gegeben und zugeführte Energie  gegeben -> Wärmemenge berechnen
    else if(contentW > 0 && contentZ > 0 && (mode == 0 || mode == 3)) {
	mode = 3;
        e.value = (contentZ/100*(100-contentW)).toFixed(1);
	n.value = (contentZ/100*contentW).toFixed(1);
	e.classList.add("blue");
        n.classList.add("blue");
	return;
    }
    // Wärmemenge gegeben und Nutzenergie gegeben -> Wirkungsgrad berechnen
    else if(contentE > 0 && contentN > 0 && (mode == 0 || mode == 4)) {
	mode = 4;
	w.value	= (contentN / (contentE + contentN) * 100).toFixed(1);
	z.value = (contentE + contentN).toFixed(1);
	w.classList.add("blue");
        z.classList.add("blue");
    }
    else if(contentE > 0 && contentZ > 0 && (mode == 0 || mode == 5)) {
	mode = 5;
	w.value = (contentE / contentZ * 100).toFixed(1);
	n.value = (contentZ - contentE).toFixed(1);
	w.classList.add("blue");
        n.classList.add("blue");
    }
    else if(contentN > 0 && contentZ > 0 && (mode == 0 || mode == 6)) {
	mode = 6;
	w.value = (contentN / contentZ * 100).toFixed(1);
	e.value = (contentZ - contentN).toFixed(1);
	w.classList.add("blue");
        e.classList.add("blue");
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
