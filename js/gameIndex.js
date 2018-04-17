document.getElementById("play").onmouseover = function() {
	mouseOver()
};
document.getElementById("play").onmouseout = function() {
	mouseOut()
};

function mouseOver() {
    document.getElementById("play1").style.color = "#2accf9";
}

function mouseOut() {
    document.getElementById("play1").style.color = "black";
}

function map1() {
    var myWindow = window.open("gameFinal.html", "_self");
}
function map2() {
    var myWindow = window.open("gameFinal2.html", "_self");
}
function map3() {
    var myWindow = window.open("gameFinal3.html", "_self");
}

function arenaSelect(){
	document.getElementById("arena").style.display="block";
	document.getElementById("map1").style.display="block";
	document.getElementById("map2").style.display="block";
	document.getElementById("map3").style.display="block";
}