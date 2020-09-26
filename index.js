/* Sergio Perez-Valentin */
/* September 24, 2020 */


scriptImages = ["./assets/ADA_Formatter.png", "./assets/Braille_Formatter.png", "./assets/Cap_Height.png",
				"./assets/Graphic_Layout_Dataset.png", "./assets/Graphic_Layout_Grid.png", 
				"./assets/Grid_Builder.png", "./assets/Sign_Creator.png", "./assets/Text_Spacer.png"]

var cycleNum = 0;
scriptImgCycle = setInterval(function() {
	document.getElementById("scriptImg").src = scriptImages[cycleNum];
	(um >= scriptImages.length) ? cycleNum = 0 : cycleNum += 1;
}, 2000);


scaling = setInterval(function() {
	if (document.documentElement.clientWidth/1792 < document.documentElement.clientHeight/1040) {
		document.body.style.transform = 'scale(' + document.documentElement.clientWidth/1792 + ')';
		document.body.style['-o-transform'] = 'scale(' + document.documentElement.clientWidth/1792 + ')';
		document.body.style['-webkit-transform'] = 'scale(' + document.documentElement.clientWidth/1792 + ')';
		document.body.style['-moz-transform'] = 'scale(' + document.documentElement.clientWidth/1792 + ')';
	} else {
		document.body.style.transform = 'scale(' + document.documentElement.clientHeight/1040 + ')';
		document.body.style['-o-transform'] = 'scale(' + document.documentElement.clientHeight/1040 + ')';
		document.body.style['-webkit-transform'] = 'scale(' + document.documentElement.clientHeight/1040 + ')';
		document.body.style['-moz-transform'] = 'scale(' + document.documentElement.clientHeight/1040 + ')';
	}
}, 20);
