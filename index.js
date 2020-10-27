/* Sergio Perez-Valentin */
/* September 24, 2020 */


scriptImages = ["./assets/ADA_Formatter_Grey.png", 
				"./assets/Braille_Formatter_Grey.png", 
				"./assets/Cap_Height_Grey.png",
				"./assets/Graphic_Layout_Dataset_Grey.png", 
				"./assets/Graphic_Layout_Grid_Grey.png", 
				"./assets/Grid_Builder_Grey.png", 
				"./assets/Sign_Creator_Grey.png", 
				"./assets/Text_Spacer_Grey.png"]

var cycleNum = 1;
scriptImgCycle = setInterval(function() {
	document.getElementById("scriptImg").src = scriptImages[cycleNum];
	(cycleNum >= scriptImages.length-1) ? cycleNum = 0 : cycleNum += 1;
}, 2000);


scaling = setInterval(function() {

	document.body.style.transformOrigin = "0% 0% 0";
	document.body.style.transition = "";

	let widthRatio = document.documentElement.clientWidth/1792;
	let heightRatio = document.documentElement.clientHeight/1040;
	if (widthRatio < heightRatio) {
		document.body.style.transform = 'scale(' + widthRatio + ')';
		document.body.style['-o-transform'] = 'scale(' + widthRatio + ')';
		document.body.style['-webkit-transform'] = 'scale(' + widthRatio + ')';
		document.body.style['-moz-transform'] = 'scale(' + widthRatio + ')';
	} else {
		document.body.style.transform = 'scale(' + heightRatio + ')';
		document.body.style['-o-transform'] = 'scale(' + heightRatio + ')';
		document.body.style['-webkit-transform'] = 'scale(' + heightRatio + ')';
		document.body.style['-moz-transform'] = 'scale(' + heightRatio + ')';
	}
}, 100);

function contentChange(page) {
	strength = 1;
	timer = setInterval(function() {
		document.body.style.opacity = strength -= .01;
	}, 20);
	setTimeout(function(){ window.location.href = page; }, 2000);
}

function profilePopup() {
	document.getElementById("profileCloseButton").style.display = 'block';
	document.getElementById("profileTextInformation").style.display = 'block';
	document.getElementById("plate7").style.transform = 'scale(2.3) rotate(0deg) translate(-100px,-50px)';
}

function profilePopdown() {
	document.getElementById("profileCloseButton").style.display = 'none';
	document.getElementById("profileTextInformation").style.display = 'none';
	document.getElementById("plate7").style.transform = 'scale(1) rotate(-45deg) translate(-10px,-130px)';
}
