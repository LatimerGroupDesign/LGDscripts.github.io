/* Sergio Perez-Valentin */
/* September 24, 2020 */


scriptImages = ["./assets/ADA_Formatter.png", "./assets/Braille_Formatter.png", "./assets/Cap_Height.png",
				"./assets/Graphic_Layout_Dataset.png", "./assets/Graphic_Layout_Grid.png", 
				"./assets/Grid_Builder.png", "./assets/Sign_Creator.png", "./assets/Text_Spacer.png"]
var num = 0;


timer = setInterval(function() {
	var randScriptImage = scriptImages[num];
	document.getElementById("scriptImg").src = randScriptImage;
	num += 1;
	if (num >= scriptImages.length) {
		num = 0;
	}

	document.body.style.transform = 'scale(' + document.documentElement.clientWidth/1770 + ')';
	document.body.style['-o-transform'] = 'scale(' + document.documentElement.clientWidth/1770 + ')';
	document.body.style['-webkit-transform'] = 'scale(' + document.documentElement.clientWidth/1770 + ')';
	document.body.style['-moz-transform'] = 'scale(' + document.documentElement.clientWidth/1770 + ')';

	/*
	document.body.style.transform = 'scaleX(' + document.documentElement.clientWidth/screen.width + ') scaleY(' + document.documentElement.clientHeight/screen.height + ')';
	document.body.style['-o-transform'] = 'scaleX(' + document.documentElement.clientWidth/screen.width + ') scaleY(' + document.documentElement.clientHeight/screen.height + ')';
	document.body.style['-webkit-transform'] = 'scaleX(' + document.documentElement.clientWidth/screen.width + ') scaleY(' + document.documentElement.clientHeight/screen.height + ')';
	document.body.style['-moz-transform'] = 'scaleX(' + document.documentElement.clientWidth/screen.width + ') scaleY(' + document.documentElement.clientHeight/screen.height + ')';
	*/
}, 1500);
