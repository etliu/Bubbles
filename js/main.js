var WIDTH;
var HEIGHT;
var maxVX = 10;
var maxVY = 10;
var OVX = maxVX;
var OVY = maxVY;
var dR = 8;
var minR = 12;
var OMINR = minR;
var fps = 60;
var mousedown = 0;
var parr = [];
var ctx;
var CANVAS;
var cursorX;
var cursorY;
var sizeSlider;
var vSliders = [];
var lockSwitch;
var lockedState = false;
var lockedSlider = false;
var lockedValues = [1, 1]
var solidSwitch;
var isSolid = false;
 
var maxEntities = 1000;

function crossUpdate ( value, slider ) {

	// If the sliders aren't interlocked, don't
	// cross-update.
	if ( !lockedState ) return;

	// Select whether to increase or decrease
	// the other slider value.
	var a = vSliders[0] === slider ? 0 : 1, b = a ? 0 : 1;

	// Offset the slider value.
	value -= lockedValues[b] - lockedValues[a];

	// Set the value
	slider.noUiSlider.set(value);
}

function createP(){
    if(mousedown == 1){
        var xPos = Math.random() > .5;
        var yPos = Math.random() > .5;
        var vx = (~~(Math.random()*maxVX))+1;
        var vy = (~~(Math.random()*maxVY))+1;
        if (xPos) vx *= -1;
        if (yPos) vy *= -1;
        var rad = Math.floor(Math.random()*dR)+minR;
        parr.push(new Particle(vx, vy, cursorX, cursorY, rad));
        parr[parr.length-1].setVX(vSliders[0].noUiSlider.get(0));
        parr[parr.length-1].setVY(vSliders[1].noUiSlider.get(0));
        
        if(parr.length > maxEntities) parr.shift();
    }
}

function render(){
    
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    for(var i = 0; i < parr.length; i++){
        ctx.beginPath();
        ctx.arc(parr[i].x, parr[i].y, parr[i].r, 0, 2*Math.PI);
        ctx.strokeStyle = parr[i].cstr;
        (isSolid)?drawSolid(parr[i].transToSolid()):drawStroke(parr[i].transToStroke());
    }
}

function drawSolid(color){
    ctx.fillStyle = color;
    ctx.fill();
    ctx.stroke();
}

function drawStroke(color){
    ctx.fillStyle = color;
    ctx.fill();
    ctx.stroke();
}

function main(){
    createP();
    for(var i = 0; i < parr.length; i++){
//        for(var j = i+1; j < parr.length; j++){
//            parr[i].pCollision(parr[j]);
//        }
        parr[i].move();
    }
    render();
}

var cursorX;
var cursorY;
document.onmousemove = function(e){
    cursorX = e.pageX;
    cursorY = e.pageY;
}

window.onload = function () {
    
    solidSwitch = document.getElementById("switchSolid");
    lockSwitch = document.getElementById("switch");
    CANVAS = document.getElementById("cv");
    ctx = CANVAS.getContext("2d");
    ctx.strokeStyle = "#000000";
    WIDTH = document.body.clientWidth;
    HEIGHT = document.body.clientHeight;
    CANVAS.height = HEIGHT;
    CANVAS.width = WIDTH;
    document.addEventListener("mousedown", function(){
        mousedown = 1;
    });
    document.addEventListener("mouseup", function(){
        mousedown = 0;
    });
    
    sizeSlider = document.getElementById('size');
    
    noUiSlider.create(sizeSlider, {
        start: 0,
        step: 1,
        orientation: 'horizontal',
        connect: 'lower',
        range: {
            'min': -10,
            'max': 10
        }
    });
    
    vSliders = document.getElementsByClassName('speed');
    
    for (var i = 0; i < vSliders.length; i++){
        noUiSlider.create(vSliders[i], {
            animate: false,
            start: 1,
            step: .1,
            connect: 'lower',
            orientiation: 'horizontal',
            range:{
                'min': 0.1,
                'max': 3.0
            }
        });
    }
    
    vSliders[0].noUiSlider.on('update', function(){
        for (var i = 0; i < parr.length; i++){
            parr[i].setVX(vSliders[0].noUiSlider.get());
        }
    });
        
    vSliders[1].noUiSlider.on('update', function(){
        for (var i = 0; i < parr.length; i++){
            parr[i].setVY(vSliders[1].noUiSlider.get());
        }
    });
        
    sizeSlider.noUiSlider.on('update', function(){
        minR = OMINR+Math.round(sizeSlider.noUiSlider.get()); 
        for (var i = 0; i < parr.length; i++){
            parr[i].setRadius(Math.round(sizeSlider.noUiSlider.get()));
        }
    });
    
    function toggleLock() { 
        lockSwitch.addEventListener('mousedown', function(){
	        lockedState = true;
            lockSwitch.addEventListener('mousedown', function(){
                lockedState = false;
                toggleLock();
            });
        });
    }
    toggleLock();
    
    function setLockedValues ( ) {
	lockedValues = [
		Number(vSliders[0].noUiSlider.get()),
		Number(vSliders[1].noUiSlider.get())
	];
}

    vSliders[0].noUiSlider.on('change', setLockedValues);
    vSliders[1].noUiSlider.on('change', setLockedValues);
    
    vSliders[0].noUiSlider.on('slide', function( values, handle ){
    	crossUpdate(values[handle], vSliders[1]);
    });

    vSliders[1].noUiSlider.on('slide', function( values, handle ){
    	crossUpdate(values[handle], vSliders[0]);
    });
    
    function toggleSolid() {
        solidSwitch.addEventListener('mousedown', function(){
            isSolid = true;
            solidSwitch.addEventListener('mousedown', function(){
                isSolid = false;
                toggleSolid();
            });
        });
    }
    toggleSolid();
    
    main();
}

setInterval(main, 1000/fps);