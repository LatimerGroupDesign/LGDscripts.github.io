#target illustrator
/*
Creates artboards while changing information based on data set

06/09/2020
Sergio Perez-Valentin
*/

//——————————————————————————————————————————————————————————————————————————————————————————————————————

var currentDoc = app.activeDocument;
var set = currentDoc.dataSets
var ARTBOARDWIDTH = getArtboardWidth();
var ARTBOARDHEIGHT = getArtboardHeight();
var ARTBOARDSPACINGX = 0.5;
var ARTBOARDSPACINGY = 1.5;
var CANVASWIDTH = 227*72;
var CANVASHEIGHT = 227*72;
var GRID = gridPerCanvas();
var STARTINGX = 0;
var STARTINGY = 0;
var response = null;
var offsetX = 0;
var offsetY = 0;
var boardRect = currentDoc.artboards[0].artboardRect;
var check = 0;

//——————————————————————————————————————————————————————————————————————————————————————————————————————

//Creates cords for artboard rect
//Takes X-coordinate, Y-coordinate, Width in pixels, Height in pixels
//Returns a rect for drawing
function artboardRect(x, y, width, height) {
    var rect = [x, -y, width + x, -(height - (-y))];
    return rect;
}

//Gets artboard width based
//Takes null
//Returns number for artboard width after scaling is applied
function getArtboardWidth() {
    var board = currentDoc.artboards[0];
    var boardRect = board.artboardRect;
    var boardWidth = Math.abs(boardRect[0] - boardRect[2]);
    return boardWidth;
}

//Gets artboard height based
//Takes null
//Returns number for artboard height after scaling is applied
function getArtboardHeight() {
    var board = currentDoc.artboards[0];
    var boardRect = board.artboardRect;
    var boardHeight = Math.abs(boardRect[1] - boardRect[3]);
    return boardHeight;
}

//Puts the selcetd items into a group
//Takes null
//Returns null
function groupSelect() {
    docSelection = currentDoc.selection;
    //Creates new desired group
    newGroup = app.activeDocument.groupItems.add();
    for (var i = docSelection.length -1; i >= 0; i--) {
        newItem = docSelection[i];
        newItem.moveToBeginning(newGroup);
    }
    currentDoc.selection = null;
}

function moveArtboardBtmLeft() {
	//Groups artwork to move
	currentDoc.selection = null;
	//Remove pre-existing groups
    for (g = 0; g < currentDoc.groupItems.length; g++) {
        app.executeMenuCommand("selectall");
        app.executeMenuCommand("ungroup");
    }
	currentDoc.artboards.setActiveArtboardIndex(0)
	currentDoc.selectObjectsOnActiveArtboard();
	groupSelect();
	//Moves artboard to center
	var board = currentDoc.artboards[0]
	board.artboardRect = artboardRect(0, 0, ARTBOARDWIDTH, ARTBOARDHEIGHT);
	//Move x until stop
	var moveX = 16344;
	for (i = 0; i < 100; i++) {
		try {
			board.artboardRect = artboardRect(board.artboardRect[0] + moveX, board.artboardRect[1], ARTBOARDWIDTH, ARTBOARDHEIGHT);
		} catch (ex) {
			moveX /= 2;
		}
	}
	//Move y until stop
	var moveY = 16344;
	for (i = 0; i < 100; i++) {
		try {
			board.artboardRect = artboardRect(board.artboardRect[0], Math.abs(board.artboardRect[1] - moveY), ARTBOARDWIDTH, ARTBOARDHEIGHT);
		} catch (ex) {
			moveY /= 2;
		}
	}
	board.artboardRect = artboardRect(board.artboardRect[0] - 10, Math.abs(board.artboardRect[1] + 10), ARTBOARDWIDTH, ARTBOARDHEIGHT);
	//Finds offset
	offsetX = Math.abs(boardRect[0] - currentDoc.artboards[0].artboardRect[0]);
	offsetY = Math.abs(boardRect[1] - currentDoc.artboards[0].artboardRect[1]);
	//Moves grouping to artboard location
	var currentGroup = app.activeDocument.groupItems[0];
    currentGroup.position = [currentGroup.position[0] + offsetX, currentGroup.position[1] - offsetY];
    //Sets starting location of new artboards
    STARTINGX = boardRect[0]
	STARTINGY = -boardRect[1]
}

function removeArtboard(index) {
	currentDoc.artboards.setActiveArtboardIndex(index)
	currentDoc.selectObjectsOnActiveArtboard();
    app.executeMenuCommand("clear");
    currentDoc.artboards[index].remove();
}

//Finds the grid of artboards for a canvas
//Takes null
//Returns vector [max artboards per canvas horizontally, max artboards per canvas vertically]
function gridPerCanvas() {
    var horAmount = Math.floor(CANVASWIDTH / (ARTBOARDWIDTH + ARTBOARDSPACINGX)); 
    var verAmount = Math.floor(CANVASHEIGHT / (ARTBOARDHEIGHT + ARTBOARDSPACINGY));
    //Horizontal amount, Vertical amount
    return [horAmount-1,verAmount];
}

function duplicateArtboard(val) {
	currentDoc.selection = null;
	currentDoc.artboards.setActiveArtboardIndex(0)
	currentDoc.selectObjectsOnActiveArtboard();
	app.copy();
	currentDoc.artboards.add(artboardRect(STARTINGX,STARTINGY,ARTBOARDWIDTH,ARTBOARDHEIGHT));
	app.executeMenuCommand("pasteFront");
	currentDoc.selection = null;
}

function UI() {
    /*
	Code for Import https://scriptui.joonas.me — (Triple click to select): 
	{"activeId":8,"items":{"item-0":{"id":0,"type":"Dialog","parentId":false,"style":{"enabled":true,"varName":null,"windowType":"Dialog","creationProps":{"su1PanelCoordinates":false,"maximizeButton":false,"minimizeButton":false,"independent":false,"closeButton":true,"borderless":false,"resizeable":false},"text":"Graphic Layout Dataset","preferredSize":[0,0],"margins":16,"orientation":"column","spacing":10,"alignChildren":["center","top"]}},"item-1":{"id":1,"type":"Group","parentId":0,"style":{"enabled":true,"varName":null,"preferredSize":[0,30],"margins":0,"orientation":"row","spacing":10,"alignChildren":["center","bottom"],"alignment":null}},"item-2":{"id":2,"type":"Button","parentId":1,"style":{"enabled":true,"varName":null,"text":"Ok","justify":"center","preferredSize":[76,0],"alignment":null,"helpTip":null}},"item-3":{"id":3,"type":"Button","parentId":1,"style":{"enabled":true,"varName":null,"text":"CANCEL","justify":"center","preferredSize":[76,0],"alignment":null,"helpTip":null}},"item-4":{"id":4,"type":"Panel","parentId":0,"style":{"enabled":true,"varName":null,"creationProps":{"borderStyle":"etched","su1PanelCoordinates":false},"text":"Spacing","preferredSize":[0,0],"margins":15,"orientation":"column","spacing":10,"alignChildren":["left","top"],"alignment":null}},"item-5":{"id":5,"type":"StaticText","parentId":7,"style":{"enabled":true,"varName":null,"creationProps":{"truncate":"none","multiline":false,"scrolling":false},"softWrap":false,"text":"Horizontal","justify":"left","preferredSize":[85,0],"alignment":null,"helpTip":null}},"item-7":{"id":7,"type":"Group","parentId":4,"style":{"enabled":true,"varName":null,"preferredSize":[0,0],"margins":0,"orientation":"row","spacing":10,"alignChildren":["left","center"],"alignment":null}},"item-8":{"id":8,"type":"EditText","parentId":7,"style":{"enabled":true,"varName":null,"creationProps":{"noecho":false,"readonly":false,"multiline":false,"scrollable":false,"borderless":false,"enterKeySignalsOnChange":false},"softWrap":false,"text":"0.5","justify":"center","preferredSize":[44,0],"alignment":null,"helpTip":null}},"item-9":{"id":9,"type":"Group","parentId":4,"style":{"enabled":true,"varName":null,"preferredSize":[0,0],"margins":0,"orientation":"row","spacing":10,"alignChildren":["left","center"],"alignment":null}},"item-10":{"id":10,"type":"StaticText","parentId":9,"style":{"enabled":true,"varName":null,"creationProps":{"truncate":"none","multiline":false,"scrolling":false},"softWrap":false,"text":"Vertical","justify":"left","preferredSize":[85,0],"alignment":null,"helpTip":null}},"item-11":{"id":11,"type":"EditText","parentId":9,"style":{"enabled":true,"varName":null,"creationProps":{"noecho":false,"readonly":false,"multiline":false,"scrollable":false,"borderless":false,"enterKeySignalsOnChange":false},"softWrap":false,"text":"1.5","justify":"center","preferredSize":[44,0],"alignment":null,"helpTip":null}}},"order":[0,4,7,5,8,9,10,11,1,2,3],"settings":{"importJSON":true,"indentSize":false,"cepExport":false,"includeCSSJS":true,"showDialog":true,"functionWrapper":false,"afterEffectsDockable":false,"itemReferenceList":"None"}}
	*/ 

	// DIALOG
	// ======
	var dialog = new Window("dialog"); 
	    dialog.text = "Graphic Layout Dataset"; 
	    dialog.orientation = "column"; 
	    dialog.alignChildren = ["center","top"]; 
	    dialog.spacing = 10; 
	    dialog.margins = 16; 

	// PANEL1
	// ======
	var panel1 = dialog.add("panel", undefined, undefined, {name: "panel1"}); 
	    panel1.text = "Spacing"; 
	    panel1.orientation = "column"; 
	    panel1.alignChildren = ["left","top"]; 
	    panel1.spacing = 10; 
	    panel1.margins = 15; 

	// GROUP1
	// ======
	var group1 = panel1.add("group", undefined, {name: "group1"}); 
	    group1.orientation = "row"; 
	    group1.alignChildren = ["left","center"]; 
	    group1.spacing = 10; 
	    group1.margins = 0; 

	var statictext1 = group1.add("statictext", undefined, undefined, {name: "statictext1"}); 
	    statictext1.text = "Horizontal"; 
	    statictext1.preferredSize.width = 85; 

	var edittext1 = group1.add('edittext {justify: "center", properties: {name: "edittext1"}}'); 
	    edittext1.text = ARTBOARDSPACINGX; 
	    edittext1.preferredSize.width = 44; 

	// GROUP2
	// ======
	var group2 = panel1.add("group", undefined, {name: "group2"}); 
	    group2.orientation = "row"; 
	    group2.alignChildren = ["left","center"]; 
	    group2.spacing = 10; 
	    group2.margins = 0; 

	var statictext2 = group2.add("statictext", undefined, undefined, {name: "statictext2"}); 
	    statictext2.text = "Vertical"; 
	    statictext2.preferredSize.width = 85; 

	var edittext2 = group2.add('edittext {justify: "center", properties: {name: "edittext2"}}'); 
	    edittext2.text = ARTBOARDSPACINGY; 
	    edittext2.preferredSize.width = 44; 

	// GROUP3
	// ======
	var group3 = dialog.add("group", undefined, {name: "group3"}); 
	    group3.preferredSize.height = 30; 
	    group3.orientation = "row"; 
	    group3.alignChildren = ["center","bottom"]; 
	    group3.spacing = 10; 
	    group3.margins = 0; 

	var button1 = group3.add("button", undefined, undefined, {name: "button1"}); 
	    button1.text = "Ok"; 
	    button1.preferredSize.width = 76; 

	var button2 = group3.add("button", undefined, undefined, {name: "button2"}); 
	    button2.text = "CANCEL"; 
	    button2.preferredSize.width = 76;
  
    button1.onClick = function() {
        ARTBOARDSPACINGX = (parseFloat(edittext1.text))*72;
        ARTBOARDSPACINGY = (parseFloat(edittext2.text))*72;
        response = true;
        dialog.close();
        return true;
    }

    button2.onClick = function() {
        response = false;
        dialog.close();
        return false;
    }

    dialog.show();
}

function endScript() {
	currentDoc.artboards[0].remove();
	currentDoc.groupItems[currentDoc.groupItems.length-1].remove();
	app.executeMenuCommand("fitall"); //Moves view to all pages
	alert("Artboards: " + currentDoc.artboards.length);
}

//——————————————————————————————————————————————————————————————————————————————————————————————————————

function runScript() {
	UI();
	if (response) {
		moveArtboardBtmLeft();
		for (s = 0; s < set.length; s++) {
			set[s].display();
			try {
				duplicateArtboard(s);
				check = 0
				STARTINGX += ARTBOARDWIDTH + ARTBOARDSPACINGX;
			} catch (ex) {
				if (check >= 3) {
					break;
				} else {
					STARTINGX = boardRect[0]
					STARTINGY += ARTBOARDHEIGHT + ARTBOARDSPACINGY;
					check += 1
					s -= 1;
				}
			}
		}
		endScript();
	}
}

try {
    runScript();
} catch (error) {
    alert("An error has occurred.");
}