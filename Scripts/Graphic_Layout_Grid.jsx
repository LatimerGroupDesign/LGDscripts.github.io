#target illustrator

/*
Takes multiple artboards from an open document and transfers them to a new document,
which then scales and sorts them into grids onto separate papers with user specified input.

06/04/2020
Sergio Perez-Valentin
*/

//——————————————————————————————————————————————————————————————————————————————————————————————————————

//Scale sheets
var eScales = [1, 0.5, 0.333333333333, 0.25, 0.2, 0.1, 0.05]; //Engineering scale - In order of drop down menu
var eSelection = 0;
var aScales = [0.005208333333, 0.0078125, 0.01041666667, 0.015625, 0.02083333333, 
               0.03125, 0.04166666667, 0.0625, 0.08333333333, 0.125, 0.25, 1] //Architectural scale - In order of drop down menu
var aSelection = 0;

//Algorithim operators
//In decimal percent
var ratio = eScales[eSelection];     //Scale ratio
//In inches
var pageWidth = 11;         //Page width
var pageHeight = 8.5;       //Page height
var pageSpacing = 1;        //Space between pages
var pageMargin = .5         //Outer edge page spacing
var columns = 6;            //Page column cutoff
var startingX = -5000;      //Starting page x point
var startingY = -5000 ;     //Starting page y point
var proxy = 9;             //Approximate number of artboards per page

//UI operators
var response = null;    //Determines if program continues
var tick = 0;           //Rembers which checkbox was ticked
var check1 = false;     //Tracks if checkbox 1 was true or false
var check2 = false;     //Tracks if checkbox 2 was true or false

//——————————————————————————————————————————————————————————————————————————————————————————————————————

//Gets artboard width based on ratio
//Takes null
//Returns number for artboard width after scaling is applied
function getArtboardWidth() {
    var currentDoc = app.activeDocument;
    var board = currentDoc.artboards[0];
    var boardRect = board.artboardRect;
    var boardWidth = Math.abs(boardRect[0] - boardRect[2]);
    return boardWidth * ratio;
}

//Gets artboard height based on ratio
//Takes null
//Returns number for artboard height after scaling is applied
function getArtboardHeight() {
    var currentDoc = app.activeDocument;
    var board = currentDoc.artboards[0];
    var boardRect = board.artboardRect;
    var boardHeight = Math.abs(boardRect[1] - boardRect[3]);
    return boardHeight * ratio;
}

//Finds the grid of artboards for a page
//Takes null
//Returns vector [max artboards per page horizontally, max artboards per page vertically]
function gridPerPage() {
    var porWidth = getArtboardWidth();
    var porHeight = getArtboardHeight();
    var horAmount = Math.floor((pageWidth - (pageMargin*2)) / porWidth); 
    var verAmount = Math.floor((pageHeight - pageMargin - (1.5*72)) / porHeight); //Accounts for bottom info text 
    if (horAmount < 1 && verAmount < 1 && response != null) {
        alert("An error has occurred. The ratio you have chosen is to big.")
    }
    //Horizontal amount, Vertical amount
    return [horAmount,verAmount];
}

//Creates cords for artboard rect
//Takes X-coordinate, Y-coordinate, Width in pixels, Height in pixels
//Returns a rect for drawing
function artboardRect(x, y, width, height) {
    var rect = [x, -y, width + x, -(height - (-y))];
    return rect;
}

//Puts the selcetd items into a group
//Takes null
//Returns null
function groupSelect() {
    var currentDoc = app.activeDocument;
    docSelection = currentDoc.selection;
    //Creates new desired group
    newGroup = app.activeDocument.groupItems.add();
    for (var i = docSelection.length -1; i >= 0; i--) {
        newItem = docSelection[i];
        newItem.moveToBeginning(newGroup);
    }
    currentDoc.selection = null;
}

//Finds the difference to center the artwork on page for the x-axis
//Takes groupItem width, artboard width, max horizontal artboards on one page
//Returns a number to offset which centers artboards on page
function getXoffset(groupWidth, boardWidth, horAmount) {
    var boardOffset = (((pageWidth-(pageMargin*2)) - (boardWidth*horAmount)) / 2);
    var groupOffset = ((boardWidth - groupWidth) / 2);
    return pageMargin + boardOffset + groupOffset;
}

//Recommends scale based on number of artboards per page wanted
//Takes a number of artboards
//Returns null
function recommend(proxy) {
    var currentDoc = app.activeDocument;
    var totalBoards = currentDoc.artboards.length;
    //Storage vars
    startPageWidth = pageWidth;
    startPageHeight = pageHeight;
    var eScaleClosestIndex = 0;
    var aScaleClosestIndex = 0;
    var eScaleClosestAmount = proxy - 0;
    var aScaleClosestAmount = proxy - 0;
    //Converts to pixels
    pageWidth *= 72;
    pageHeight *= 72;
    //Runs through engineering scale
    for (e = 0; e < eScales.length; e++) {
        ratio = eScales[e];
        var grid = gridPerPage();
        var boardsPerPage = Math.abs(grid[0] * grid[1]);
        if (Math.abs(proxy-boardsPerPage) < eScaleClosestAmount) {
            eScaleClosestAmount = Math.abs(proxy-boardsPerPage);
            eScaleClosestIndex = e;
        }
    }
    for (a = 0; a < aScales.length; a++) {
        ratio = aScales[a];
        var grid = gridPerPage();
        var boardsPerPage = Math.abs(grid[0] * grid[1]);
        if (Math.abs(proxy-boardsPerPage) < aScaleClosestAmount) {
            aScaleClosestAmount = Math.abs(proxy-boardsPerPage);
            aScaleClosestIndex = a;
        }
    }
    if (eScaleClosestAmount < aScaleClosestAmount) {
        check1 = true;
        ratio = eScales[eScaleClosestIndex];
        eSelection = eScaleClosestIndex;

    } else {
        check2 = true;
        ratio = aScales[aScaleClosestIndex];
        aSelection = aScaleClosestIndex;
    }
    //Corrects values for displaying
    pageWidth = startPageWidth;
    pageHeight = startPageHeight;
}

//Creates the popup menu option firs time, opens a setting reminder menu second time
//Takes null
//Returns true to continue, false to exit
function UI() {
    //Corrects values for information display popup after program finishes
    if (response != null) {
        pageWidth = pageWidth/72;
        pageHeight = pageHeight/72;
        pageMargin = pageMargin/72;
        pageSpacing = pageSpacing/72;
    } else {
        recommend(proxy);
        eSelection *= 2;
        aSelection *= 2;
    }

    // DIALOG
    // ======
    var dialog = new Window("dialog"); 
        dialog.text = "Graphic Layout Grid"; 
        dialog.orientation = "column"; 
        dialog.alignChildren = ["center","top"]; 
        dialog.spacing = 10; 
        dialog.margins = 16; 

    // GROUP1
    // ======
    var group1 = dialog.add("group", undefined, {name: "group1"}); 
        group1.orientation = "row"; 
        group1.alignChildren = ["left","center"]; 
        group1.spacing = 10; 
        group1.margins = 0; 

    // PANEL1
    // ======
    var panel1 = group1.add("panel", undefined, undefined, {name: "panel1"}); 
        panel1.text = "Page                       in."; 
        panel1.orientation = "column"; 
        panel1.alignChildren = ["left","top"]; 
        panel1.spacing = 13; 
        panel1.margins = 10; 

    // GROUP2
    // ======
    var group2 = panel1.add("group", undefined, {name: "group2"}); 
        group2.orientation = "row"; 
        group2.alignChildren = ["left","center"]; 
        group2.spacing = 20; 
        group2.margins = 0; 

    var statictext1 = group2.add("statictext", undefined, undefined, {name: "statictext1"}); 
        statictext1.text = "Width"; 
        statictext1.preferredSize.width = 50; 

    var edittext1 = group2.add('edittext {justify: "center", properties: {name: "edittext1"}}'); 
        edittext1.text = pageWidth; 
        edittext1.preferredSize.width = 40; 

    // GROUP3
    // ======
    var group3 = panel1.add("group", undefined, {name: "group3"}); 
        group3.orientation = "row"; 
        group3.alignChildren = ["left","center"]; 
        group3.spacing = 20; 
        group3.margins = 0; 

    var statictext2 = group3.add("statictext", undefined, undefined, {name: "statictext2"}); 
        statictext2.text = "Height"; 
        statictext2.preferredSize.width = 50; 

    var edittext2 = group3.add('edittext {justify: "center", properties: {name: "edittext2"}}'); 
        edittext2.text = pageHeight; 
        edittext2.preferredSize.width = 40; 

    // GROUP4
    // ======
    var group4 = panel1.add("group", undefined, {name: "group4"}); 
        group4.orientation = "row"; 
        group4.alignChildren = ["left","center"]; 
        group4.spacing = 20; 
        group4.margins = 0; 

    var statictext3 = group4.add("statictext", undefined, undefined, {name: "statictext3"}); 
        statictext3.text = "Margin"; 
        statictext3.preferredSize.width = 50; 

    var edittext3 = group4.add('edittext {justify: "center", properties: {name: "edittext3"}}'); 
        edittext3.text = pageMargin; 
        edittext3.preferredSize.width = 40; 

    // GROUP5
    // ======
    var group5 = panel1.add("group", undefined, {name: "group5"}); 
        group5.orientation = "row"; 
        group5.alignChildren = ["left","center"]; 
        group5.spacing = 20; 
        group5.margins = 0; 

    var statictext4 = group5.add("statictext", undefined, undefined, {name: "statictext4"}); 
        statictext4.text = "Spacing"; 
        statictext4.preferredSize.width = 50; 

    var edittext4 = group5.add('edittext {justify: "center", properties: {name: "edittext4"}}'); 
        edittext4.text = pageSpacing; 
        edittext4.preferredSize.width = 40; 

    // GROUP6
    // ======
    var group6 = group1.add("group", undefined, {name: "group6"}); 
        group6.preferredSize.width = 184; 
        group6.orientation = "column"; 
        group6.alignChildren = ["left","center"]; 
        group6.spacing = 10; 
        group6.margins = 0; 

    // PANEL2
    // ======
    var panel2 = group6.add("panel", undefined, undefined, {name: "panel2"}); 
        panel2.text = "Scale"; 
        panel2.preferredSize.width = 207; 
        panel2.orientation = "column"; 
        panel2.alignChildren = ["left","top"]; 
        panel2.spacing = 5; 
        panel2.margins = 10; 

    // GROUP7
    // ======
    var group7 = panel2.add("group", undefined, {name: "group7"}); 
        group7.preferredSize.width = 184; 
        group7.orientation = "row"; 
        group7.alignChildren = ["left","center"]; 
        group7.spacing = 10; 
        group7.margins = 0; 

    var checkbox1 = group7.add("checkbox", undefined, undefined, {name: "checkbox1"}); 
        checkbox1.text = "Engineering"; 
        checkbox1.value = check1; 

    var checkbox2 = group7.add("checkbox", undefined, undefined, {name: "checkbox2"}); 
        checkbox2.text = "Architectural";
        checkbox2.value = check2;

    // GROUP8
    // ======
    var group8 = panel2.add("group", undefined, {name: "group8"}); 
        group8.orientation = "row"; 
        group8.alignChildren = ["left","center"]; 
        group8.spacing = 47; 
        group8.margins = 0; 

    var dropdown1_array = ["1:1","-","1:2","-","1:3","-","1:4","-","1:5","-","1:10","-","1:20"]; 
    var dropdown1 = group8.add("dropdownlist", undefined, undefined, {name: "dropdown1", items: dropdown1_array}); 
        dropdown1.selection = eSelection; 

    var dropdown2_array = ["¹⁄₁₆” = 1’","-","³⁄₃₂” = 1’","-","⅛” = 1’","-","³⁄₁₆” = 1’","-","¼” = 1’","-","⅜” = 1’",
                           "-","½” = 1’","-","¾” = 1’","-","1” = 1’","-","1-½” = 1’","-","3” = 1’","-","1” = 1”"]; 
    var dropdown2 = group8.add("dropdownlist", undefined, undefined, {name: "dropdown2", items: dropdown2_array}); 
        dropdown2.selection = aSelection; 

    // PANEL3
    // ======
    var panel3 = group6.add("panel", undefined, undefined, {name: "panel3"}); 
        panel3.text = "Advanced"; 
        panel3.orientation = "column"; 
        panel3.alignChildren = ["left","top"]; 
        panel3.spacing = 10; 
        panel3.margins = 10; 

    // GROUP9
    // ======
    var group9 = panel3.add("group", undefined, {name: "group9"}); 
        group9.orientation = "row"; 
        group9.alignChildren = ["left","center"]; 
        group9.spacing = 10; 
        group9.margins = 0; 

    var statictext5 = group9.add("statictext", undefined, undefined, {name: "statictext5"}); 
        statictext5.text = "Page Columns"; 

    var edittext5 = group9.add('edittext {justify: "center", properties: {name: "edittext5"}}'); 
        edittext5.text = columns; 
        edittext5.preferredSize.width = 40; 

    // PANEL3
    // ======
    var statictext6 = panel3.add("statictext", undefined, undefined, {name: "statictext6"}); 
        statictext6.text = "X: -5000 pts.           Y: 5000 pts."; 

    // GROUP10
    // =======
    var group10 = dialog.add("group", undefined, {name: "group10"}); 
        group10.orientation = "row"; 
        group10.alignChildren = ["left","center"]; 
        group10.spacing = 20; 
        group10.margins = [0,5,0,0];  

    //First time through
    if (response == null) {
        var button1 = group10.add("button", undefined, undefined, {name: "button1"}); 
        button1.text = "OK"; 

        var button2 = group10.add("button", undefined, undefined, {name: "button2"}); 
        button2.text = "CANCEL";

        button1.onClick = function() {
            if (checkbox1.value == false && checkbox2.value == false) {
                alert("Please select one type of scale.");
                return false;
            }
            if (checkbox1.value == true && checkbox2.value == true) {
                alert("Please only select one type of scale.");
                checkbox1.value = false;
                checkbox2.value = false;
                return false;
            }
            pageWidth = parseFloat(edittext1.text)*72;
            pageHeight = parseFloat(edittext2.text)*72;
            pageMargin = parseFloat(edittext3.text)*72;
            pageSpacing = parseFloat(edittext4.text)*72;
            columns = parseFloat(edittext5.text);
            eSelection = dropdown1.selection.index;
            aSelection = dropdown2.selection.index
            check1 = checkbox1.value;
            check2 = checkbox2.value;
            if (check1) {
                ratio = eScales[(eSelection/2)];
                tick = 1;
            } else {
                ratio = aScales[(aSelection/2)];
                tick = 2;
            }
            response = true;
            dialog.close();
            progress.show();
            return true;
        }

        button2.onClick = function() {
            response = false;
            dialog.close();
            return false;
        }
    //Second time through
    } else {
        var button1 = group10.add("button", undefined, undefined, {name: "button1"}); 
        button1.text = "EXIT";

        progress.close();

        button1.onClick = function() {
            response = false;
            dialog.close();
            return false;
        }
    }

    dialog.show();
}

//Transfers current document artboards to a new document
//Takes null
//Returns null
function artboardDocTransfer() {
    //Current document
    var transferDoc = app.activeDocument;
    transferDoc.selectObjectsOnActiveArtboard();
    app.copy();
    //Transfer document
    var finalDoc = app.documents.add();
    finalDoc.artboards.add(artboardRect(-7885,-8587,1,1));
    app.activeDocument.artboards.remove(0);
    app.executeMenuCommand("paste");
    transferDoc.selection = null;
    //Removes excess artboards
    app.activeDocument.artboards.remove(0);
    progress.pbar.value += 1;
}

//Adds the total pages needed for the amount of artboards
//Takes null
//Returns vector [total artboards transfered, total pages created]
function addPages() {
    var currentDoc = app.activeDocument;
    var totalBoards = currentDoc.artboards.length;
    var grid = gridPerPage();
    var boardsPerPage = grid[0] * grid[1];
    var totalPages = Math.ceil(totalBoards / boardsPerPage);
    //Adds pages
    var currentX = startingX;
    var currentY = startingY;
    for (p = 0; p < totalPages; p++) {
        currentDoc.artboards.add(artboardRect(currentX, currentY, pageWidth, pageHeight));
        currentX += pageWidth + pageSpacing;
        if (currentX >= (startingX + (pageWidth * columns) + (pageSpacing * columns))) {
            currentY += pageHeight + pageSpacing;
            currentX = startingX;
        }
    }
    return [totalBoards, totalPages];
}

//Cleans document, then scales and moves the artwork to corresponding spots on the pages
//Takes null
//Returns null
function moveArtwork(totals) {
    var currentDoc = app.activeDocument;
    var board = currentDoc.artboards;
    //Remove pre-existing groups
    for (g = 0; g < currentDoc.groupItems.length; g++) {
        app.executeMenuCommand("selectall");
        app.executeMenuCommand("ungroup");
        progress.pbar.value += 1;
    }
    //Groups the artwork within the boards
    for (a = 0; a < totals[0]; a++) {
        var activeBoard = board.setActiveArtboardIndex(a);
        var activeArtwork = currentDoc.selectObjectsOnActiveArtboard();
        groupSelect();
        progress.pbar.value += 1;
    }
    //Scales the artwork to ratio
    for (a = 0; a < currentDoc.groupItems.length; a++) {
        currentDoc.groupItems[a].resize(ratio*100, ratio*100);
    }
    //Scales the artwork strokes to ratio
    for (i = 0; i < currentDoc.pathItems.length; i++) {
        pathArt = currentDoc.pathItems[i];
        pathArt.strokeWidth = pathArt.strokeWidth * ratio;
        progress.pbar.value += 1;
    }
    //Scales the text strokes to ratio textRef.textRange.characters[i]
    for (f = 0; f < currentDoc.textFrames.length; f++) {
        for (c = 0; c < currentDoc.textFrames[f].contents.length; c++) {  
            var letter = currentDoc.textFrames[f].characters[c].characterAttributes;
            if (letter.stroke || letter.strokeWeight != 1) {
                letter.strokeWeight = letter.strokeWeight * ratio;
            }
        }
        progress.pbar.value += 1;
    }
    //Positions the artwork on the pages
    var boardWidth = getArtboardWidth();
    var boardHeight = getArtboardHeight();
    var grid = gridPerPage();
    var groups = app.activeDocument.groupItems;
    var groupIndex = groups.length-1;
    var xOffset = getXoffset(currentDoc.groupItems[0].width, boardWidth, grid[0]); //Finds the difference to center artwork of x-axis based off first grouping
    var groupXpos = startingX + xOffset;
    var groupYpos = -startingY - pageMargin;
    //Goes through pages
    for (p = 1; p <= totals[1]; p++) {
        //Goes through rows
        for (r = 0; r < grid[1]; r++) {
            //Goes through columns
            for (c = 0; c < grid[0]; c++) {
                //Moves group
                try {
                    var currentGroup = groups[groupIndex];
                    currentGroup.position = [groupXpos, groupYpos];
                    progress.pbar.value += 1;
                } catch (ex) {
                    return null;
                }
                //Calculates next column cord
                groupXpos += boardWidth;
                groupIndex -= 1;
            }
            //Calculates next row cord
            groupXpos -= boardWidth * c
            groupYpos -= boardHeight;
        }
        //Resets page column cord if over columns number
        if (p%columns == 0) {
            groupXpos = startingX + xOffset;
        } else {
            groupXpos += pageWidth + pageSpacing;
        }
        //Adjusts page height
        groupYpos = -startingY - pageMargin - (pageHeight*Math.floor(p/columns)) - (pageSpacing*Math.floor(p/columns));
    }
}

//——————————————————————————————————————————————————————————————————————————————————————————————————————

//Progress bar
progressDoc = app.activeDocument;
var progress = new Window("palette");
    progress.pbar = progress.add("progressbar", undefined, 0, progressDoc.artboards.length*3 + progressDoc.textFrames.length + progressDoc.pathItems.length + progressDoc.groupItems.length);
    progress.pbar.preferredSize.width = 350;
    progress.pbar.preferredSize.height = 30;

//Runs the functions in the proper order
//Takes null
//Returns null
function runScript() {
    UI();
    if(response) {
        artboardDocTransfer();
        var totals = addPages();
        moveArtwork(totals);
        //Removes excess artboards
        for (a = 0; a < totals[0]; a++) {
            app.activeDocument.artboards.remove(0);
        }
        app.executeMenuCommand("fitall"); //Moves view to all pages
        UI();
    }
}

//Calls script, throws error if program failure occurs
try {
    runScript();
} catch (error) {
    progress.close();
    alert("An error has occurred. Make sure you select the artboards you wish to process.");
}

