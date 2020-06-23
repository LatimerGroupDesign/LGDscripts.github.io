#target illustrator

/*
Develops a series of grids that allow a user to plan out different sized boundaries within a defined border.

06/15/2020
Sergio Perez-Valentin
*/

//——————————————————————————————————————————————————————————————————————————————————————————————————————

var currentDoc;

//Baord
var boardHeight = 36;  
var boardWidth = 72;    
var boardMargin = 1.5;
var boundingTypeB = true;
//Plaque   
var plaqueHeight = 1;       
var plaqueWidth = 2;  
var plaqueSpacing = 0.5;
var constraint = 2;
var boundingTypeP = false;
//Advanced
var extensionTypeH = true;
var extensionTypeV = false;
var ratio = 0.25;
var trials = 100;
//Palette
var coloursIndex = 0;
var outlineCheck = false;
//Amounts
var amounts = [43, 35, 23, 12, 8, 4, "", "", "", "", "", "",];

//Extras
var bound;
var coloursUsed = [];
var colours = [["White", "C=0 M=0 Y=0 K=5", "C=0 M=0 Y=0 K=10", "C=0 M=0 Y=0 K=20", "C=0 M=0 Y=0 K=30", "C=0 M=0 Y=0 K=40",
                "C=0 M=0 Y=0 K=50", "C=0 M=0 Y=0 K=60", "C=0 M=0 Y=0 K=70", "C=0 M=0 Y=0 K=80", "C=0 M=0 Y=0 K=90", "C=0 M=0 Y=0 K=100"],
                ["CYMK Red", "CYMK Yellow", "CYMK Green", "CYMK Cyan", "CYMK Blue", "CYMK Magenta",
                "C=0 M=50 Y=100 K=0", "C=50 M=0 Y=100 K=0", "C=100 M=100 Y=25 K=25", "C=75 M=100 Y=0 K=0", "C=10 M=100 Y=50 K=0", "C=25 M=25 Y=40 K=0"],
                [],[]];

//UI operators
var response = null;    //Determines if program continues
var check = true;
var sendAlert = false;

//——————————————————————————————————————————————————————————————————————————————————————————————————————

//Creates cords for artboard rect
//Takes X-coordinate, Y-coordinate, Width in pixels, Height in pixels
//Returns a rect for drawing
function artboardRect(x, y, width, height) {
    var rect = [x, -y, width + x, -(height - (-y))];
    return rect;
}

function findGrid() {
    var hp = 0;
    var hs = 0;
    while ((plaqueWidth*hp + plaqueSpacing*hs) < (boardWidth - boardMargin*2)) {
        hp += 1
        if ((plaqueWidth*hp + plaqueSpacing*hs) < (boardWidth - boardMargin*2)) {
            hs += 1;
        }
    }

    vp = 0
    vs = 0
    while ((plaqueHeight*vp + plaqueSpacing*vs) < (boardHeight - boardMargin*2)) {
        vp += 1
        if ((plaqueHeight*vp + plaqueSpacing*vs) < (boardHeight - boardMargin*2)) {
            vs += 1;
        }
    }
    return [hp, vp];
}

function convert() {
    boardHeight *= ratio;
    boardWidth *= ratio;
    boardMargin *= ratio;
    plaqueHeight *= ratio;
    plaqueWidth *= ratio;
    plaqueSpacing *= ratio;
}

function findColor(col) {
    var index = false;
    try {
        for (i = 1; i < currentDoc.swatches.length; i++) {
            if (currentDoc.swatches[i].name == col) {
                index = i;
            }
        }
        return index;
    } catch (er) {
        return index;
    }
}

/*
l1: Top Left coordinate of first rectangle.
r1: Bottom Right coordinate of first rectangle.
l2: Top Left coordinate of second rectangle.
r2: Bottom Right coordinate of second rectangle.
*/
function doOverlap(l1, r1, l2, r2) { 
    // If one rectangle is on left side of other 
    if (l1[0] >= r2[0] || l2[0] >= r1[0]) 
        return false; 
  
    // If one rectangle is above other 
    if (l1[1] <= r2[1] || l2[1] <= r1[1]) 
        return false; 
  
    return true; 
} 

//Creates the popup menu option firs time, opens a setting reminder menu second time
//Takes null
//Returns true to continue, false to exit
function UI() {
    /*
    Code for Import https://scriptui.joonas.me — (Triple click to select): 
    {"activeId":14,"items":{"item-0":{"id":0,"type":"Dialog","parentId":false,"style":{"enabled":true,"varName":null,"windowType":"Dialog","creationProps":{"su1PanelCoordinates":false,"maximizeButton":false,"minimizeButton":false,"independent":false,"closeButton":true,"borderless":false,"resizeable":false},"text":"Grid Builder","preferredSize":[0,0],"margins":16,"orientation":"column","spacing":10,"alignChildren":["center","top"]}},"item-3":{"id":3,"type":"Button","parentId":72,"style":{"enabled":true,"varName":null,"text":"OK","justify":"center","preferredSize":[76,0],"alignment":null,"helpTip":null}},"item-5":{"id":5,"type":"Button","parentId":72,"style":{"enabled":true,"varName":null,"text":"CANCEL","justify":"center","preferredSize":[76,0],"alignment":null,"helpTip":null}},"item-9":{"id":9,"type":"Panel","parentId":34,"style":{"enabled":true,"varName":null,"creationProps":{"borderStyle":"etched","su1PanelCoordinates":false},"text":"Board","preferredSize":[248,86],"margins":10,"orientation":"column","spacing":10,"alignChildren":["left","bottom"],"alignment":null}},"item-14":{"id":14,"type":"Panel","parentId":34,"style":{"enabled":true,"varName":null,"creationProps":{"borderStyle":"etched","su1PanelCoordinates":false},"text":"Defining Plaque","preferredSize":[248,119],"margins":10,"orientation":"column","spacing":10,"alignChildren":["left","bottom"],"alignment":null}},"item-15":{"id":15,"type":"Group","parentId":14,"style":{"enabled":true,"varName":null,"preferredSize":[0,0],"margins":0,"orientation":"row","spacing":10,"alignChildren":["left","center"],"alignment":null}},"item-16":{"id":16,"type":"StaticText","parentId":15,"style":{"enabled":true,"varName":null,"creationProps":{"truncate":"none","multiline":false,"scrolling":false},"softWrap":false,"text":"Dimensions","justify":"left","preferredSize":[90,0],"alignment":null,"helpTip":null}},"item-17":{"id":17,"type":"EditText","parentId":15,"style":{"enabled":true,"varName":null,"creationProps":{"noecho":false,"readonly":false,"multiline":false,"scrollable":false,"borderless":false,"enterKeySignalsOnChange":false},"softWrap":false,"text":"1","justify":"center","preferredSize":[44,0],"alignment":null,"helpTip":null}},"item-18":{"id":18,"type":"Group","parentId":14,"style":{"enabled":true,"varName":null,"preferredSize":[0,0],"margins":0,"orientation":"row","spacing":10,"alignChildren":["left","center"],"alignment":null}},"item-19":{"id":19,"type":"StaticText","parentId":18,"style":{"enabled":true,"varName":null,"creationProps":{"truncate":"none","multiline":false,"scrolling":false},"softWrap":false,"text":"Spacing","justify":"left","preferredSize":[90,0],"alignment":null,"helpTip":null}},"item-20":{"id":20,"type":"EditText","parentId":18,"style":{"enabled":true,"varName":null,"creationProps":{"noecho":false,"readonly":false,"multiline":false,"scrollable":false,"borderless":false,"enterKeySignalsOnChange":false},"softWrap":false,"text":"0.5","justify":"center","preferredSize":[44,0],"alignment":null,"helpTip":null}},"item-21":{"id":21,"type":"Group","parentId":9,"style":{"enabled":true,"varName":null,"preferredSize":[0,0],"margins":0,"orientation":"row","spacing":10,"alignChildren":["left","center"],"alignment":null}},"item-22":{"id":22,"type":"Group","parentId":9,"style":{"enabled":true,"varName":null,"preferredSize":[0,0],"margins":0,"orientation":"row","spacing":10,"alignChildren":["left","center"],"alignment":null}},"item-23":{"id":23,"type":"StaticText","parentId":21,"style":{"enabled":true,"varName":null,"creationProps":{"truncate":"none","multiline":false,"scrolling":false},"softWrap":false,"text":"Dimensions","justify":"left","preferredSize":[90,0],"alignment":null,"helpTip":null}},"item-24":{"id":24,"type":"EditText","parentId":21,"style":{"enabled":true,"varName":null,"creationProps":{"noecho":false,"readonly":false,"multiline":false,"scrollable":false,"borderless":false,"enterKeySignalsOnChange":false},"softWrap":false,"text":"36","justify":"center","preferredSize":[44,0],"alignment":null,"helpTip":null}},"item-26":{"id":26,"type":"EditText","parentId":21,"style":{"enabled":true,"varName":null,"creationProps":{"noecho":false,"readonly":false,"multiline":false,"scrollable":false,"borderless":false,"enterKeySignalsOnChange":false},"softWrap":false,"text":"72","justify":"center","preferredSize":[44,0],"alignment":null,"helpTip":null}},"item-28":{"id":28,"type":"StaticText","parentId":22,"style":{"enabled":true,"varName":null,"creationProps":{"truncate":"none","multiline":false,"scrolling":false},"softWrap":false,"text":"Margin","justify":"left","preferredSize":[90,0],"alignment":null,"helpTip":null}},"item-29":{"id":29,"type":"EditText","parentId":22,"style":{"enabled":true,"varName":null,"creationProps":{"noecho":false,"readonly":false,"multiline":false,"scrollable":false,"borderless":false,"enterKeySignalsOnChange":false},"softWrap":false,"text":"1.5","justify":"center","preferredSize":[44,0],"alignment":null,"helpTip":null}},"item-31":{"id":31,"type":"EditText","parentId":15,"style":{"enabled":true,"varName":null,"creationProps":{"noecho":false,"readonly":false,"multiline":false,"scrollable":false,"borderless":false,"enterKeySignalsOnChange":false},"softWrap":false,"text":"1","justify":"center","preferredSize":[44,0],"alignment":null,"helpTip":null}},"item-32":{"id":32,"type":"Panel","parentId":83,"style":{"enabled":true,"varName":null,"creationProps":{"borderStyle":"etched","su1PanelCoordinates":false},"text":"Amounts","preferredSize":[146,252],"margins":10,"orientation":"column","spacing":13,"alignChildren":["left","center"],"alignment":null}},"item-33":{"id":33,"type":"Group","parentId":0,"style":{"enabled":true,"varName":null,"preferredSize":[0,0],"margins":0,"orientation":"row","spacing":10,"alignChildren":["left","center"],"alignment":null}},"item-34":{"id":34,"type":"Group","parentId":33,"style":{"enabled":true,"varName":null,"preferredSize":[232,194],"margins":0,"orientation":"column","spacing":10,"alignChildren":["left","center"],"alignment":null}},"item-36":{"id":36,"type":"EditText","parentId":45,"style":{"enabled":true,"varName":"amount5","creationProps":{"noecho":false,"readonly":false,"multiline":false,"scrollable":false,"borderless":false,"enterKeySignalsOnChange":false},"softWrap":false,"text":"12","justify":"center","preferredSize":[36,0],"alignment":null,"helpTip":null}},"item-37":{"id":37,"type":"EditText","parentId":46,"style":{"enabled":true,"varName":"amount3","creationProps":{"noecho":false,"readonly":false,"multiline":false,"scrollable":false,"borderless":false,"enterKeySignalsOnChange":false},"softWrap":false,"text":"23","justify":"center","preferredSize":[36,0],"alignment":null,"helpTip":null}},"item-38":{"id":38,"type":"EditText","parentId":44,"style":{"enabled":true,"varName":"amount7","creationProps":{"noecho":false,"readonly":false,"multiline":false,"scrollable":false,"borderless":false,"enterKeySignalsOnChange":false},"softWrap":false,"text":"","justify":"center","preferredSize":[36,0],"alignment":null,"helpTip":null}},"item-39":{"id":39,"type":"EditText","parentId":43,"style":{"enabled":true,"varName":"amount9","creationProps":{"noecho":false,"readonly":false,"multiline":false,"scrollable":false,"borderless":false,"enterKeySignalsOnChange":false},"softWrap":false,"text":"","justify":"center","preferredSize":[36,0],"alignment":null,"helpTip":null}},"item-42":{"id":42,"type":"StaticText","parentId":43,"style":{"enabled":true,"varName":null,"creationProps":{"truncate":"none","multiline":false,"scrolling":false},"softWrap":false,"text":"9","justify":"left","preferredSize":[16,0],"alignment":null,"helpTip":null}},"item-43":{"id":43,"type":"Group","parentId":32,"style":{"enabled":true,"varName":null,"preferredSize":[64,0],"margins":0,"orientation":"row","spacing":10,"alignChildren":["left","center"],"alignment":null}},"item-44":{"id":44,"type":"Group","parentId":32,"style":{"enabled":true,"varName":null,"preferredSize":[64,0],"margins":0,"orientation":"row","spacing":10,"alignChildren":["left","center"],"alignment":null}},"item-45":{"id":45,"type":"Group","parentId":32,"style":{"enabled":true,"varName":null,"preferredSize":[64,0],"margins":0,"orientation":"row","spacing":10,"alignChildren":["left","center"],"alignment":null}},"item-46":{"id":46,"type":"Group","parentId":32,"style":{"enabled":true,"varName":null,"preferredSize":[64,0],"margins":0,"orientation":"row","spacing":10,"alignChildren":["left","center"],"alignment":null}},"item-47":{"id":47,"type":"StaticText","parentId":46,"style":{"enabled":true,"varName":null,"creationProps":{"truncate":"none","multiline":false,"scrolling":false},"softWrap":false,"text":"3","justify":"left","preferredSize":[16,0],"alignment":null,"helpTip":null}},"item-48":{"id":48,"type":"StaticText","parentId":45,"style":{"enabled":true,"varName":null,"creationProps":{"truncate":"none","multiline":false,"scrolling":false},"softWrap":false,"text":"5","justify":"left","preferredSize":[16,0],"alignment":null,"helpTip":null}},"item-49":{"id":49,"type":"StaticText","parentId":44,"style":{"enabled":true,"varName":null,"creationProps":{"truncate":"none","multiline":false,"scrolling":false},"softWrap":false,"text":"7","justify":"left","preferredSize":[16,0],"alignment":null,"helpTip":null}},"item-50":{"id":50,"type":"EditText","parentId":51,"style":{"enabled":true,"varName":"amount11","creationProps":{"noecho":false,"readonly":false,"multiline":false,"scrollable":false,"borderless":false,"enterKeySignalsOnChange":false},"softWrap":false,"text":"","justify":"center","preferredSize":[36,0],"alignment":null,"helpTip":null}},"item-51":{"id":51,"type":"Group","parentId":32,"style":{"enabled":true,"varName":null,"preferredSize":[0,0],"margins":0,"orientation":"row","spacing":10,"alignChildren":["left","center"],"alignment":null}},"item-52":{"id":52,"type":"StaticText","parentId":51,"style":{"enabled":true,"varName":null,"creationProps":{"truncate":"none","multiline":false,"scrolling":false},"softWrap":false,"text":"11","justify":"left","preferredSize":[16,0],"alignment":null,"helpTip":null}},"item-53":{"id":53,"type":"Group","parentId":70,"style":{"enabled":true,"varName":null,"preferredSize":[0,0],"margins":0,"orientation":"row","spacing":10,"alignChildren":["left","center"],"alignment":null}},"item-54":{"id":54,"type":"StaticText","parentId":53,"style":{"enabled":true,"varName":null,"creationProps":{"truncate":"none","multiline":false,"scrolling":false},"softWrap":false,"text":"Trials","justify":"left","preferredSize":[50,0],"alignment":null,"helpTip":null}},"item-57":{"id":57,"type":"EditText","parentId":46,"style":{"enabled":true,"varName":"amount4","creationProps":{"noecho":false,"readonly":false,"multiline":false,"scrollable":false,"borderless":false,"enterKeySignalsOnChange":false},"softWrap":false,"text":"8","justify":"center","preferredSize":[36,0],"alignment":null,"helpTip":null}},"item-58":{"id":58,"type":"EditText","parentId":45,"style":{"enabled":true,"varName":"amount6","creationProps":{"noecho":false,"readonly":false,"multiline":false,"scrollable":false,"borderless":false,"enterKeySignalsOnChange":false},"softWrap":false,"text":"4","justify":"center","preferredSize":[36,0],"alignment":null,"helpTip":null}},"item-59":{"id":59,"type":"EditText","parentId":44,"style":{"enabled":true,"varName":"amount8","creationProps":{"noecho":false,"readonly":false,"multiline":false,"scrollable":false,"borderless":false,"enterKeySignalsOnChange":false},"softWrap":false,"text":"","justify":"center","preferredSize":[36,0],"alignment":null,"helpTip":null}},"item-60":{"id":60,"type":"EditText","parentId":43,"style":{"enabled":true,"varName":"amount10","creationProps":{"noecho":false,"readonly":false,"multiline":false,"scrollable":false,"borderless":false,"enterKeySignalsOnChange":false},"softWrap":false,"text":"","justify":"center","preferredSize":[36,0],"alignment":null,"helpTip":null}},"item-61":{"id":61,"type":"EditText","parentId":51,"style":{"enabled":true,"varName":"amount12","creationProps":{"noecho":false,"readonly":false,"multiline":false,"scrollable":false,"borderless":false,"enterKeySignalsOnChange":false},"softWrap":false,"text":"","justify":"center","preferredSize":[36,0],"alignment":null,"helpTip":null}},"item-63":{"id":63,"type":"StaticText","parentId":46,"style":{"enabled":true,"varName":null,"creationProps":{"truncate":"none","multiline":false,"scrolling":false},"softWrap":false,"text":"4","justify":"left","preferredSize":[0,0],"alignment":null,"helpTip":null}},"item-64":{"id":64,"type":"StaticText","parentId":45,"style":{"enabled":true,"varName":null,"creationProps":{"truncate":"none","multiline":false,"scrolling":false},"softWrap":false,"text":"6","justify":"left","preferredSize":[0,0],"alignment":null,"helpTip":null}},"item-65":{"id":65,"type":"StaticText","parentId":44,"style":{"enabled":true,"varName":null,"creationProps":{"truncate":"none","multiline":false,"scrolling":false},"softWrap":false,"text":"8","justify":"left","preferredSize":[0,0],"alignment":null,"helpTip":null}},"item-66":{"id":66,"type":"StaticText","parentId":43,"style":{"enabled":true,"varName":null,"creationProps":{"truncate":"none","multiline":false,"scrolling":false},"softWrap":false,"text":"10","justify":"left","preferredSize":[0,0],"alignment":null,"helpTip":null}},"item-67":{"id":67,"type":"StaticText","parentId":51,"style":{"enabled":true,"varName":null,"creationProps":{"truncate":"none","multiline":false,"scrolling":false},"softWrap":false,"text":"12","justify":"left","preferredSize":[0,0],"alignment":null,"helpTip":null}},"item-68":{"id":68,"type":"StaticText","parentId":71,"style":{"enabled":true,"varName":"","creationProps":{"truncate":"none","multiline":false,"scrolling":false},"softWrap":false,"text":"Ratio","justify":"left","preferredSize":[50,0],"alignment":null,"helpTip":null}},"item-69":{"id":69,"type":"EditText","parentId":71,"style":{"enabled":true,"varName":"","creationProps":{"noecho":false,"readonly":false,"multiline":false,"scrollable":false,"borderless":false,"enterKeySignalsOnChange":false},"softWrap":false,"text":"0.25","justify":"center","preferredSize":[44,0],"alignment":null,"helpTip":null}},"item-70":{"id":70,"type":"Panel","parentId":87,"style":{"enabled":true,"varName":null,"creationProps":{"borderStyle":"etched","su1PanelCoordinates":false},"text":"Advanced","preferredSize":[147,139],"margins":10,"orientation":"column","spacing":10,"alignChildren":["left","top"],"alignment":null}},"item-71":{"id":71,"type":"Group","parentId":70,"style":{"enabled":true,"varName":null,"preferredSize":[85,0],"margins":0,"orientation":"row","spacing":10,"alignChildren":["left","center"],"alignment":null}},"item-72":{"id":72,"type":"Group","parentId":83,"style":{"enabled":true,"varName":null,"preferredSize":[146,104],"margins":0,"orientation":"column","spacing":20,"alignChildren":["center","center"],"alignment":null}},"item-73":{"id":73,"type":"Checkbox","parentId":21,"style":{"enabled":true,"varName":null,"text":"","preferredSize":[0,0],"alignment":null,"helpTip":null,"checked":true}},"item-74":{"id":74,"type":"Checkbox","parentId":15,"style":{"enabled":true,"varName":null,"text":"","preferredSize":[0,0],"alignment":null,"helpTip":null,"checked":false}},"item-75":{"id":75,"type":"Group","parentId":14,"style":{"enabled":true,"varName":null,"preferredSize":[0,0],"margins":0,"orientation":"row","spacing":10,"alignChildren":["left","center"],"alignment":null}},"item-76":{"id":76,"type":"StaticText","parentId":75,"style":{"enabled":true,"varName":null,"creationProps":{"truncate":"none","multiline":false,"scrolling":false},"softWrap":false,"text":"Constraint","justify":"left","preferredSize":[90,0],"alignment":null,"helpTip":null}},"item-77":{"id":77,"type":"EditText","parentId":75,"style":{"enabled":true,"varName":null,"creationProps":{"noecho":false,"readonly":false,"multiline":false,"scrollable":false,"borderless":false,"enterKeySignalsOnChange":false},"softWrap":false,"text":"3","justify":"center","preferredSize":[44,0],"alignment":null,"helpTip":null}},"item-80":{"id":80,"type":"Checkbox","parentId":70,"style":{"enabled":true,"varName":null,"text":"Horizontal Extend","preferredSize":[125,0],"alignment":null,"helpTip":null,"checked":true}},"item-81":{"id":81,"type":"Checkbox","parentId":70,"style":{"enabled":true,"varName":null,"text":"Vertical Extend","preferredSize":[125,0],"alignment":null,"helpTip":null}},"item-82":{"id":82,"type":"EditText","parentId":53,"style":{"enabled":true,"varName":null,"creationProps":{"noecho":false,"readonly":false,"multiline":false,"scrollable":false,"borderless":false,"enterKeySignalsOnChange":false},"softWrap":false,"text":"100","justify":"center","preferredSize":[44,0],"alignment":null,"helpTip":null}},"item-83":{"id":83,"type":"Group","parentId":33,"style":{"enabled":true,"varName":null,"preferredSize":[0,0],"margins":0,"orientation":"column","spacing":10,"alignChildren":["left","center"],"alignment":null}},"item-85":{"id":85,"type":"Panel","parentId":87,"style":{"enabled":true,"varName":null,"creationProps":{"borderStyle":"etched","su1PanelCoordinates":false},"text":"Palette","preferredSize":[91,139],"margins":8,"orientation":"column","spacing":30,"alignChildren":["center","center"],"alignment":null}},"item-86":{"id":86,"type":"DropDownList","parentId":85,"style":{"enabled":true,"varName":null,"text":"DropDownList","listItems":"Dark, -, Vibe, -, Blank, -, Void","preferredSize":[0,0],"alignment":null,"selection":0,"helpTip":null}},"item-87":{"id":87,"type":"Group","parentId":34,"style":{"enabled":true,"varName":null,"preferredSize":[0,0],"margins":0,"orientation":"row","spacing":10,"alignChildren":["left","center"],"alignment":null}},"item-88":{"id":88,"type":"Group","parentId":32,"style":{"enabled":true,"varName":null,"preferredSize":[0,0],"margins":0,"orientation":"row","spacing":10,"alignChildren":["left","center"],"alignment":null}},"item-89":{"id":89,"type":"StaticText","parentId":88,"style":{"enabled":true,"varName":null,"creationProps":{"truncate":"none","multiline":false,"scrolling":false},"softWrap":false,"text":"1","justify":"left","preferredSize":[16,0],"alignment":null,"helpTip":null}},"item-90":{"id":90,"type":"EditText","parentId":88,"style":{"enabled":true,"varName":"amount1","creationProps":{"noecho":false,"readonly":false,"multiline":false,"scrollable":false,"borderless":false,"enterKeySignalsOnChange":false},"softWrap":false,"text":"62","justify":"center","preferredSize":[36,0],"alignment":null,"helpTip":null}},"item-91":{"id":91,"type":"StaticText","parentId":88,"style":{"enabled":true,"varName":null,"creationProps":{"truncate":"none","multiline":false,"scrolling":false},"softWrap":false,"text":"2","justify":"left","preferredSize":[15,0],"alignment":null,"helpTip":null}},"item-92":{"id":92,"type":"EditText","parentId":88,"style":{"enabled":true,"varName":"amount2","creationProps":{"noecho":false,"readonly":false,"multiline":false,"scrollable":false,"borderless":false,"enterKeySignalsOnChange":false},"softWrap":false,"text":"35","justify":"left","preferredSize":[36,0],"alignment":null,"helpTip":null}},"item-93":{"id":93,"type":"Checkbox","parentId":85,"style":{"enabled":true,"varName":null,"text":"Outline","preferredSize":[64,0],"alignment":null,"helpTip":null,"checked":true}},"item-94":{"id":94,"type":"Panel","parentId":0,"style":{"enabled":true,"varName":null,"creationProps":{"borderStyle":"etched","su1PanelCoordinates":false},"text":"Plaque Replace","preferredSize":[414,0],"margins":10,"orientation":"row","spacing":48,"alignChildren":["left","center"],"alignment":null}},"item-95":{"id":95,"type":"Button","parentId":94,"style":{"enabled":true,"varName":null,"text":"RUN","justify":"center","preferredSize":[76,0],"alignment":null,"helpTip":null}},"item-96":{"id":96,"type":"StaticText","parentId":94,"style":{"enabled":true,"varName":null,"creationProps":{"truncate":"none","multiline":false,"scrolling":false},"softWrap":false,"text":"Replaces plaques based on selection.","justify":"left","preferredSize":[0,0],"alignment":null,"helpTip":null}}},"order":[0,33,34,9,21,23,24,26,73,22,28,29,14,15,16,17,31,74,18,19,20,75,76,77,87,70,80,81,71,68,69,53,54,82,85,86,93,83,32,88,90,89,92,91,46,37,47,57,63,45,36,48,58,64,44,38,49,59,65,43,39,42,60,66,51,50,52,61,67,72,3,5,94,96,95],"settings":{"importJSON":true,"indentSize":false,"cepExport":false,"includeCSSJS":true,"showDialog":true,"functionWrapper":false,"afterEffectsDockable":false,"itemReferenceList":"None"}}
    */ 

    loadData();

    // DIALOG
    // ======
    var dialog = new Window("dialog"); 
        dialog.text = "Grid Builder"; 
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

    // GROUP2
    // ======
    var group2 = group1.add("group", undefined, {name: "group2"}); 
        group2.preferredSize.width = 232; 
        group2.preferredSize.height = 194; 
        group2.orientation = "column"; 
        group2.alignChildren = ["left","center"]; 
        group2.spacing = 10; 
        group2.margins = 0; 

    // PANEL1
    // ======
    var panel1 = group2.add("panel", undefined, undefined, {name: "panel1"}); 
        panel1.text = "Board"; 
        panel1.preferredSize.width = 248; 
        panel1.preferredSize.height = 86; 
        panel1.orientation = "column"; 
        panel1.alignChildren = ["left","bottom"]; 
        panel1.spacing = 10; 
        panel1.margins = 10; 

    // GROUP3
    // ======
    var group3 = panel1.add("group", undefined, {name: "group3"}); 
        group3.orientation = "row"; 
        group3.alignChildren = ["left","center"]; 
        group3.spacing = 10; 
        group3.margins = 0; 

    var statictext1 = group3.add("statictext", undefined, undefined, {name: "statictext1"}); 
        statictext1.text = "Dimensions"; 
        statictext1.preferredSize.width = 90; 

    var edittext1 = group3.add('edittext {justify: "center", properties: {name: "edittext1"}}'); 
        edittext1.text = boardHeight; 
        edittext1.preferredSize.width = 44; 

    var edittext2 = group3.add('edittext {justify: "center", properties: {name: "edittext2"}}'); 
        edittext2.text = boardWidth; 
        edittext2.preferredSize.width = 44; 

    var checkbox1 = group3.add("checkbox", undefined, undefined, {name: "checkbox1"}); 
        checkbox1.value = boundingTypeB; 

    // GROUP4
    // ======
    var group4 = panel1.add("group", undefined, {name: "group4"}); 
        group4.orientation = "row"; 
        group4.alignChildren = ["left","center"]; 
        group4.spacing = 10; 
        group4.margins = 0; 

    var statictext2 = group4.add("statictext", undefined, undefined, {name: "statictext2"}); 
        statictext2.text = "Margin"; 
        statictext2.preferredSize.width = 90; 

    var edittext3 = group4.add('edittext {justify: "center", properties: {name: "edittext3"}}'); 
        edittext3.text = boardMargin; 
        edittext3.preferredSize.width = 44; 

    // PANEL2
    // ======
    var panel2 = group2.add("panel", undefined, undefined, {name: "panel2"}); 
        panel2.text = "Defining Plaque"; 
        panel2.preferredSize.width = 248; 
        panel2.preferredSize.height = 119; 
        panel2.orientation = "column"; 
        panel2.alignChildren = ["left","bottom"]; 
        panel2.spacing = 10; 
        panel2.margins = 10; 

    // GROUP5
    // ======
    var group5 = panel2.add("group", undefined, {name: "group5"}); 
        group5.orientation = "row"; 
        group5.alignChildren = ["left","center"]; 
        group5.spacing = 10; 
        group5.margins = 0; 

    var statictext3 = group5.add("statictext", undefined, undefined, {name: "statictext3"}); 
        statictext3.text = "Dimensions"; 
        statictext3.preferredSize.width = 90; 

    var edittext4 = group5.add('edittext {justify: "center", properties: {name: "edittext4"}}'); 
        edittext4.text = plaqueHeight; 
        edittext4.preferredSize.width = 44; 

    var edittext5 = group5.add('edittext {justify: "center", properties: {name: "edittext5"}}'); 
        edittext5.text = plaqueWidth; 
        edittext5.preferredSize.width = 44; 

    var checkbox2 = group5.add("checkbox", undefined, undefined, {name: "checkbox2"});
        checkbox2.value = boundingTypeP; 

    // GROUP6
    // ======
    var group6 = panel2.add("group", undefined, {name: "group6"}); 
        group6.orientation = "row"; 
        group6.alignChildren = ["left","center"]; 
        group6.spacing = 10; 
        group6.margins = 0; 

    var statictext4 = group6.add("statictext", undefined, undefined, {name: "statictext4"}); 
        statictext4.text = "Spacing"; 
        statictext4.preferredSize.width = 90; 

    var edittext6 = group6.add('edittext {justify: "center", properties: {name: "edittext6"}}'); 
        edittext6.text = plaqueSpacing; 
        edittext6.preferredSize.width = 44; 

    // GROUP7
    // ======
    var group7 = panel2.add("group", undefined, {name: "group7"}); 
        group7.orientation = "row"; 
        group7.alignChildren = ["left","center"]; 
        group7.spacing = 10; 
        group7.margins = 0; 

    var statictext5 = group7.add("statictext", undefined, undefined, {name: "statictext5"}); 
        statictext5.text = "Constraint"; 
        statictext5.preferredSize.width = 90; 

    var edittext7 = group7.add('edittext {justify: "center", properties: {name: "edittext7"}}'); 
        edittext7.text = constraint; 
        edittext7.preferredSize.width = 44; 

    // GROUP8
    // ======
    var group8 = group2.add("group", undefined, {name: "group8"}); 
        group8.orientation = "row"; 
        group8.alignChildren = ["left","center"]; 
        group8.spacing = 10; 
        group8.margins = 0; 

    // PANEL3
    // ======
    var panel3 = group8.add("panel", undefined, undefined, {name: "panel3"}); 
        panel3.text = "Advanced"; 
        panel3.preferredSize.width = 147; 
        panel3.preferredSize.height = 139; 
        panel3.orientation = "column"; 
        panel3.alignChildren = ["left","top"]; 
        panel3.spacing = 10; 
        panel3.margins = 10; 

    var checkbox3 = panel3.add("checkbox", undefined, undefined, {name: "checkbox3"}); 
        checkbox3.text = "Horizontal Extend"; 
        checkbox3.value = extensionTypeH; 
        checkbox3.preferredSize.width = 125; 

    var checkbox4 = panel3.add("checkbox", undefined, undefined, {name: "checkbox4"}); 
        checkbox4.text = "Vertical Extend"; 
        checkbox4.value = extensionTypeV; 
        checkbox4.preferredSize.width = 125; 

    // GROUP9
    // ======
    var group9 = panel3.add("group", undefined, {name: "group9"}); 
        group9.preferredSize.width = 85; 
        group9.orientation = "row"; 
        group9.alignChildren = ["left","center"]; 
        group9.spacing = 10; 
        group9.margins = 0; 

    var statictext6 = group9.add("statictext", undefined, undefined, {name: "statictext6"}); 
        statictext6.text = "Ratio"; 
        statictext6.preferredSize.width = 50; 

    var edittext8 = group9.add('edittext {justify: "center", properties: {name: "edittext8"}}'); 
        edittext8.text = ratio; 
        edittext8.preferredSize.width = 44; 

    // GROUP10
    // =======
    var group10 = panel3.add("group", undefined, {name: "group10"}); 
        group10.orientation = "row"; 
        group10.alignChildren = ["left","center"]; 
        group10.spacing = 10; 
        group10.margins = 0; 

    var statictext7 = group10.add("statictext", undefined, undefined, {name: "statictext7"}); 
        statictext7.text = "Trials"; 
        statictext7.preferredSize.width = 50; 

    var edittext9 = group10.add('edittext {justify: "center", properties: {name: "edittext9"}}'); 
        edittext9.text = trials; 
        edittext9.preferredSize.width = 44; 

    // PANEL4
    // ======
    var panel4 = group8.add("panel", undefined, undefined, {name: "panel4"}); 
        panel4.text = "Palette"; 
        panel4.preferredSize.width = 91; 
        panel4.preferredSize.height = 144; 
        panel4.orientation = "column"; 
        panel4.alignChildren = ["center","center"]; 
        panel4.spacing = 30; 
        panel4.margins = 8; 

    var dropdown1_array = ["Dark","-","Vibe","-","Blank","-","Void"]; 
    var dropdown1 = panel4.add("dropdownlist", undefined, undefined, {name: "dropdown1", items: dropdown1_array}); 
        dropdown1.selection = coloursIndex; 

    var checkbox5 = panel4.add("checkbox", undefined, undefined, {name: "checkbox5"}); 
        checkbox5.text = "Outline"; 
        checkbox5.value = outlineCheck; 
        checkbox5.preferredSize.width = 64; 

    // GROUP11
    // =======
    var group11 = group1.add("group", undefined, {name: "group11"}); 
        group11.orientation = "column"; 
        group11.alignChildren = ["left","center"]; 
        group11.spacing = 10; 
        group11.margins = 0; 

    // PANEL5
    // ======
    var panel5 = group11.add("panel", undefined, undefined, {name: "panel5"}); 
        panel5.text = "Amounts"; 
        panel5.preferredSize.width = 146; 
        panel5.preferredSize.height = 255; 
        panel5.orientation = "column"; 
        panel5.alignChildren = ["left","center"]; 
        panel5.spacing = 13; 
        panel5.margins = 10; 

    // GROUP12
    // =======
    var group12 = panel5.add("group", undefined, {name: "group12"}); 
        group12.orientation = "row"; 
        group12.alignChildren = ["left","center"]; 
        group12.spacing = 10; 
        group12.margins = 0; 

    var amount1 = group12.add('edittext {justify: "center", properties: {name: "amount1"}}'); 
        amount1.text = amounts[0]; 
        amount1.preferredSize.width = 36; 

    var statictext8 = group12.add("statictext", undefined, undefined, {name: "statictext8"}); 
        statictext8.text = "1"; 
        statictext8.preferredSize.width = 16; 

    var amount2 = group12.add('edittext {justify: "center", properties: {name: "amount2"}}'); 
        amount2.text = amounts[1]; 
        amount2.preferredSize.width = 36; 

    var statictext9 = group12.add("statictext", undefined, undefined, {name: "statictext9"}); 
        statictext9.text = "2"; 
        statictext9.preferredSize.width = 15; 

    // GROUP13
    // =======
    var group13 = panel5.add("group", undefined, {name: "group13"}); 
        group13.preferredSize.width = 64; 
        group13.orientation = "row"; 
        group13.alignChildren = ["left","center"]; 
        group13.spacing = 10; 
        group13.margins = 0; 

    var amount3 = group13.add('edittext {justify: "center", properties: {name: "amount3"}}'); 
        amount3.text = amounts[2]; 
        amount3.preferredSize.width = 36; 

    var statictext10 = group13.add("statictext", undefined, undefined, {name: "statictext10"}); 
        statictext10.text = "3"; 
        statictext10.preferredSize.width = 16; 

    var amount4 = group13.add('edittext {justify: "center", properties: {name: "amount4"}}'); 
        amount4.text = amounts[3]; 
        amount4.preferredSize.width = 36; 

    var statictext11 = group13.add("statictext", undefined, undefined, {name: "statictext11"}); 
        statictext11.text = "4"; 

    // GROUP14
    // =======
    var group14 = panel5.add("group", undefined, {name: "group14"}); 
        group14.preferredSize.width = 64; 
        group14.orientation = "row"; 
        group14.alignChildren = ["left","center"]; 
        group14.spacing = 10; 
        group14.margins = 0; 

    var amount5 = group14.add('edittext {justify: "center", properties: {name: "amount5"}}'); 
        amount5.text = amounts[4]; 
        amount5.preferredSize.width = 36; 

    var statictext12 = group14.add("statictext", undefined, undefined, {name: "statictext12"}); 
        statictext12.text = "5"; 
        statictext12.preferredSize.width = 16; 

    var amount6 = group14.add('edittext {justify: "center", properties: {name: "amount6"}}'); 
        amount6.text = amounts[5]; 
        amount6.preferredSize.width = 36; 

    var statictext13 = group14.add("statictext", undefined, undefined, {name: "statictext13"}); 
        statictext13.text = "6"; 

    // GROUP15
    // =======
    var group15 = panel5.add("group", undefined, {name: "group15"}); 
        group15.preferredSize.width = 64; 
        group15.orientation = "row"; 
        group15.alignChildren = ["left","center"]; 
        group15.spacing = 10; 
        group15.margins = 0; 

    var amount7 = group15.add('edittext {justify: "center", properties: {name: "amount7"}}'); 
        amount7.text = amounts[6]; 
        amount7.preferredSize.width = 36; 

    var statictext14 = group15.add("statictext", undefined, undefined, {name: "statictext14"}); 
        statictext14.text = "7"; 
        statictext14.preferredSize.width = 16; 

    var amount8 = group15.add('edittext {justify: "center", properties: {name: "amount8"}}');
        amount8.text = amounts[7]; 
        amount8.preferredSize.width = 36; 

    var statictext15 = group15.add("statictext", undefined, undefined, {name: "statictext15"}); 
        statictext15.text = "8"; 

    // GROUP16
    // =======
    var group16 = panel5.add("group", undefined, {name: "group16"}); 
        group16.preferredSize.width = 64; 
        group16.orientation = "row"; 
        group16.alignChildren = ["left","center"]; 
        group16.spacing = 10; 
        group16.margins = 0; 

    var amount9 = group16.add('edittext {justify: "center", properties: {name: "amount9"}}');
        amount9.text = amounts[8]; 
        amount9.preferredSize.width = 36; 

    var statictext16 = group16.add("statictext", undefined, undefined, {name: "statictext16"}); 
        statictext16.text = "9"; 
        statictext16.preferredSize.width = 16; 

    var amount10 = group16.add('edittext {justify: "center", properties: {name: "amount10"}}');
        amount10.text = amounts[9]; 
        amount10.preferredSize.width = 36; 

    var statictext17 = group16.add("statictext", undefined, undefined, {name: "statictext17"}); 
        statictext17.text = "10"; 

    // GROUP17
    // =======
    var group17 = panel5.add("group", undefined, {name: "group17"}); 
        group17.orientation = "row"; 
        group17.alignChildren = ["left","center"]; 
        group17.spacing = 10; 
        group17.margins = 0; 

    var amount11 = group17.add('edittext {justify: "center", properties: {name: "amount11"}}');
        amount11.text = amounts[10]; 
        amount11.preferredSize.width = 36; 

    var statictext18 = group17.add("statictext", undefined, undefined, {name: "statictext18"}); 
        statictext18.text = "11"; 
        statictext18.preferredSize.width = 16; 

    var amount12 = group17.add('edittext {justify: "center", properties: {name: "amount12"}}');
        amount12.text = amounts[11]; 
        amount12.preferredSize.width = 36; 

    var statictext19 = group17.add("statictext", undefined, undefined, {name: "statictext19"}); 
        statictext19.text = "12"; 

    // GROUP18
    // =======
    var group18 = group11.add("group", undefined, {name: "group18"}); 
        group18.preferredSize.width = 146; 
        group18.preferredSize.height = 104; 
        group18.orientation = "column"; 
        group18.alignChildren = ["center","center"]; 
        group18.spacing = 20; 
        group18.margins = 0; 

    var button1 = group18.add("button", undefined, undefined, {name: "button1"}); 
        button1.text = "OK"; 
        button1.preferredSize.width = 76; 

    var button2 = group18.add("button", undefined, undefined, {name: "button2"}); 
        button2.text = "CANCEL"; 
        button2.preferredSize.width = 76; 

    // PANEL6
    // ======
    var panel6 = dialog.add("panel", undefined, undefined, {name: "panel6"}); 
        panel6.text = "Plaque Replace"; 
        panel6.preferredSize.width = 416; 
        panel6.orientation = "row"; 
        panel6.alignChildren = ["left","center"]; 
        panel6.spacing = 64; 
        panel6.margins = 10; 

    var statictext20 = panel6.add("statictext", undefined, undefined, {name: "statictext20"}); 
        statictext20.text = "Replaces plaques based on selection."; 

    var button3 = panel6.add("button", undefined, undefined, {name: "button3"}); 
        button3.text = "RUN"; 
        button3.preferredSize.width = 76;

    button1.onClick = function() {

        if (checkbox1.value == false && checkbox2.value == false) {
            alert("Please select a bounding type.");
            return false;
        }
        if (checkbox1.value == true && checkbox2.value == true) {
            alert("Please only select one bounding type.");
            checkbox1.value = false;
            checkbox2.value = false;
            return false;
        }

        if (checkbox3.value == false && checkbox4.value == false) {
            alert("Please select an extension type.");
            return false;
        }
        if (checkbox3.value == true && checkbox4.value == true) {
            alert("Please only select one extension type.");
            checkbox3.value = false;
            checkbox4.value = false;
            return false;
        }

        if (checkbox1.value) {
            boundingType = 2;
        } else {
            boundingType = 1;
        }
        boundingTypeB = checkbox1.value;
        boundingTypeP = checkbox2.value;

        if (checkbox3.value) {
            extensionType = 1;
        } else {
            extensionType = 2;
        }
        extensionTypeH = checkbox3.value;
        extensionTypeV = checkbox4.value;

        boardHeight = parseFloat(edittext1.text)*72;      
        boardWidth = parseFloat(edittext2.text)*72;     
        boardMargin = parseFloat(edittext3.text)*72;            
        plaqueHeight = parseFloat(edittext4.text)*72;        
        plaqueWidth = parseFloat(edittext5.text)*72;      
        plaqueSpacing = parseFloat(edittext6.text)*72;
        constraint = parseInt(edittext7.text);      
        ratio = parseFloat(edittext8.text);
        trials = parseInt(edittext9.text);; 
        amounts = [parseInt(amount1.text), parseInt(amount2.text), parseInt(amount3.text), parseInt(amount4.text), parseInt(amount5.text), parseInt(amount6.text), 
                   parseInt(amount7.text), parseInt(amount8.text), parseInt(amount9.text), parseInt(amount10.text), parseInt(amount11.text), parseInt(amount12.text)];
        coloursIndex = dropdown1.selection/2;
        outlineCheck = checkbox5.value;

        for (n = 0; n < amounts.length; n++) {
            if (!isNaN(amounts[n])) {
                check = false
            }
        }

        if (check) {
            alert("Please insert atleast one amount.");
            return false;
        }
            
        response = true;
        dialog.close();
        return true;
    }

    button2.onClick = function() {
        response = false;
        dialog.close();
        return false;
    }

    button3.onClick = function() {
        response = false;
        dialog.close();
        replaceBoard();
        return false;
    }

    dialog.show();
}

//Bounds boarder to fix size issues
function createBoard1() {
    //Remove work on active artboard
    currentDoc.artboards.setActiveArtboardIndex(0);
    currentDoc.selectObjectsOnActiveArtboard();
    app.executeMenuCommand("clear");
    //Calculates boarder to fix size issues
    grid = findGrid();
    boardWidth = boardMargin*2 + plaqueWidth*grid[0] + plaqueSpacing*(grid[0]-1);
    boardHeight = boardMargin*2 + plaqueHeight*grid[1] + plaqueSpacing*(grid[1]-1);
    //Resize artboard and create boarder
    currentDoc.artboards[0].artboardRect = artboardRect(-boardWidth/2, -boardHeight/2, boardWidth, boardHeight);
    var rect = currentDoc.pathItems.rectangle(boardHeight/2, -boardWidth/2, boardWidth, boardHeight);
    rect.name = "bound";
    bound = rect;
}

//Bounds plaques to fix size issues
function createBoard2() {
    //Remove work on active artboard
    currentDoc.artboards.setActiveArtboardIndex(0);
    currentDoc.selectObjectsOnActiveArtboard();
    app.executeMenuCommand("clear");
    //Calculates plaques to fix size issues
    grid = findGrid();
    plaqueWidth = ((boardWidth - boardMargin*2) - plaqueSpacing*(grid[0]-1)) / grid[0];
    plaqueHeight = ((boardHeight - boardMargin*2) - plaqueSpacing*(grid[1]-1)) / grid[1];
    //Resize artboard and create boarder
    currentDoc.artboards[0].artboardRect = artboardRect(-boardWidth/2, -boardHeight/2, boardWidth, boardHeight);
    var rect = currentDoc.pathItems.rectangle(boardHeight/2, -boardWidth/2, boardWidth, boardHeight);
    rect.name = "bound";
    bound = rect;
}

function createGrid() {
    var startingX = -boardWidth/2 + boardMargin;
    var startingY = boardHeight/2 - boardMargin
    var nameNum = 0;
    var grid = findGrid();
    for (r = 0; r < grid[1]; r++) {
        for (c = 0; c < grid[0]; c++) {
            var rect = currentDoc.pathItems.rectangle(startingY, startingX, plaqueWidth, plaqueHeight);
            rect.name = nameNum;
            if (!outlineCheck) {
                rect.strokeColor = currentDoc.swatches[findColor("White")].color
            }
            startingX += plaqueWidth + plaqueSpacing
            nameNum += 1;
        }
        startingX = -boardWidth/2 + boardMargin;
        startingY -= plaqueHeight + plaqueSpacing
    }
}

function findCombinations() {
    var sizeTotal = 0;
    var order = [];
    var combinations = []
    
    for (n = 0; n < amounts.length; n++) {
        if (!isNaN(amounts[n])) {
            sizeTotal += 1
            order.push(amounts[n]);
        }
    }

    h = 1;
    v = 1;
    for (i = 0; i < sizeTotal; i++) {
        combinations.push([h,v]);
        if (extensionType == 1) {
            if ((h-v) > constraint-2) {
                v += 1;
            } else {
                h += 1;
            }
        } else if (extensionType == 2) {
            if ((v-h) >= constraint-2) {
                h += 1;
            } else {
                v += 1;
            }
        }
    }

    return [order.reverse(), combinations.reverse()];
}

function placePlaques() {
    var temp = findCombinations();
    var amounts = temp[0];
    var combinations = temp[1];
    var wrapValue = grid[0];
    var dropValue = grid[1]
    var combinedRects = [];

    for (a = 0; a < combinations.length; a++) {

        var randColor = Math.floor(Math.random() * currentDoc.swatches.length); //Any color except transparent
        var breaker = 0;
        
        for (r = 0; r < amounts[a]; r++) {
            
            var comb = combinations[a];
            var index = Math.floor(Math.random() * currentDoc.pathItems.length) + combinedRects.length; //chance to grab any rect except board

            try {

                if (bound == currentDoc.pathItems[index]) {
                    index = null;
                } else if (currentDoc.pathItems[index].position[0] + ((comb[0] * plaqueWidth) + (plaqueSpacing * (comb[0] - 1))) > bound.position[0] + boardWidth - boardMargin) {
                    index = null;
                } else if (currentDoc.pathItems[index].position[1] - ((comb[1] * plaqueHeight) + (plaqueSpacing * (comb[1] - 1))) < bound.position[1] -boardHeight + boardMargin) {
                    index = null;
                }

                for (c = 0; c < combinedRects.length; c++) {
                    if (doOverlap([combinedRects[c].position[0], combinedRects[c].position[1]],
                                  [combinedRects[c].position[0] + combinedRects[c].width, combinedRects[c].position[1] - combinedRects[c].height],
                                  [currentDoc.pathItems[index].position[0], currentDoc.pathItems[index].position[1]],
                                  [currentDoc.pathItems[index].position[0] + ((comb[0] * plaqueWidth) + (plaqueSpacing * (comb[0] - 1))), currentDoc.pathItems[index].position[1] - ((comb[1] * plaqueHeight) + (plaqueSpacing * (comb[1] - 1)))])
                                  ) {
                        index = null;
                    }
                }

                var rectPos = currentDoc.pathItems[index].position;
                
                //Creates new rect
                combRect = currentDoc.pathItems.rectangle(0, 0, ((comb[0] * plaqueWidth) + (plaqueSpacing * (comb[0] - 1))), ((comb[1] * plaqueHeight) + (plaqueSpacing * (comb[1] - 1))));
                combRect.position = rectPos;
                //Adds color
                if (coloursIndex == 1) {
                    combRect.fillColor = currentDoc.swatches[randColor].color;
                } else if (coloursIndex == 2) {
                    combRect.fillColor = currentDoc.swatches[findColor("White")].color;
                } else if (coloursIndex == 3) {
                    combRect.fillColor = currentDoc.swatches[findColor("Black")].color;
                } else {
                    combRect.fillColor = currentDoc.swatches[findColor(colours[coloursIndex][Math.floor(a*(12/combinations.length))])].color;
                }

                combinedRects.push(currentDoc.pathItems[0]);
                breaker = 0;

            } catch (er) {
                if (breaker < trials) {
                    r -= 1;
                    breaker += 1;
                } else {
                    sendAlert = true;
                }
            }
        }
        //Remembers color
        if (coloursIndex == 1) {
            coloursUsed.push(randColor);
        } else if (coloursIndex == 2) {
            coloursUsed.push(findColor("White"));
        } else if (coloursIndex == 3) {
            coloursUsed.push(findColor("Black"));
        } else {
            coloursUsed.push(findColor(colours[coloursIndex][Math.floor(a*(12/combinations.length))]));
        }
    }
}

function addTemplates() {
    var combinations = findCombinations()[1].reverse();
    var xSpacing = 72;
    var ySpacing = 72;
    var startingX = currentDoc.artboards[0].artboardRect[0];
    var border = 10;

    //Flips colors
    coloursUsed.reverse()

    for (i = 0; i < combinations.length; i++) {
        
        startingY = currentDoc.artboards[0].artboardRect[1] - boardHeight - (combinations[i][1] * plaqueHeight) - (plaqueSpacing * (combinations[i][1] - 1)) - ySpacing;
        
        currentDoc.artboards.add(artboardRect(startingX, startingY, 
                                              combinations[i][0] * plaqueWidth + (plaqueSpacing * (combinations[i][0] - 1)) + border, 
                                              combinations[i][1] * plaqueHeight + (plaqueSpacing * (combinations[i][1] - 1)) + border));
        
        rect = currentDoc.pathItems.rectangle(-startingY - border/2, startingX + border/2, 
                                              combinations[i][0] * plaqueWidth + (plaqueSpacing * (combinations[i][0] - 1)), 
                                              combinations[i][1] * plaqueHeight + (plaqueSpacing * (combinations[i][1] - 1)));

        rect.fillColor = currentDoc.swatches[parseInt(coloursUsed[i])].color;
        
        try {

            if (startingX + combinations[i][0] * plaqueWidth + (plaqueSpacing * (combinations[i][0] - 1)) + xSpacing + combinations[i+1][0] * plaqueWidth + (plaqueSpacing * (combinations[i+1][0] - 1)) 
                < currentDoc.artboards[0].artboardRect[0] + boardWidth) {
                
                startingX += (combinations[i][0] * plaqueWidth) + (plaqueSpacing * (combinations[i][0] - 1)) + xSpacing;

            } else {

                startingX = currentDoc.artboards[0].artboardRect[0];
                ySpacing += (combinations[i][1] * plaqueHeight) + (plaqueSpacing * (combinations[i][1] - 1)) + 72;

            }

        } catch (er) {}
    }
}

function saveData() {
    var textData = currentDoc.textFrames.add();
    textData.position = [currentDoc.artboards[0].artboardRect[0], currentDoc.artboards[0].artboardRect[1] - boardHeight - 72];
    textData.contents = "- Board Height: " + boardHeight/72/ratio + "\n" +
                        "- Board Width: " + boardWidth/72/ratio + "\n" +
                        "- Board Margin: " + boardMargin/72/ratio + "\n" +
                        "- Board Bounding: " + boundingTypeB + "\n" +
                        "- Plaque Height: " + plaqueHeight/72/ratio + "\n" +
                        "- Plaque Width: " + plaqueWidth/72/ratio + "\n" +
                        "- Plaque Spacing: " + plaqueSpacing/72/ratio + "\n" +
                        "- Constraint: " + constraint + "\n" +
                        "- Plaque Bounding: " + boundingTypeP + "\n" +
                        "- Extend Horizontal: " + extensionTypeH + "\n" +
                        "- Extend Vertical: " + extensionTypeV + "\n" +
                        "- Ratio: " + ratio + "\n" +
                        "- Trails: " + trials + "\n" +
                        "- Color Palette: " + coloursIndex + "\n" +
                        "- Outline: " + outlineCheck + "\n" +
                        "- Amounts: " + amounts;
}

function loadData() {
    
    try {
        currentDoc = app.activeDocument;
        var strings = ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ["", "", "", "", "", "", "", "", "", "", "", ""]];
        var stringIndex = 0;
        var amountIndex = 0;
        var textInfo = currentDoc.textFrames[currentDoc.textFrames.length - 1].textRanges
        var record = false;
        
        for (i = 0; i < textInfo.length; i++) {
            if (textInfo[i].contents == "-" && i != 0) {
                record = false
                strings[stringIndex] = strings[stringIndex].substr(0, strings[stringIndex].length-1);
                stringIndex += 1;
            } else if (textInfo[i].contents == ":"){
                record = true;
                i += 2;
            }

            if (record) {
                if (stringIndex == 15) {
                    if (textInfo[i].contents == ",") {
                        amountIndex += 1;
                    } else {
                        strings[stringIndex][amountIndex] += textInfo[i].contents;
                    }
                } else {
                    strings[stringIndex] += textInfo[i].contents;
                }
            } 
        }

        //Clean up
        for (i = 0; i < strings.length; i++) {
            if (strings[i] == 'true') {
                strings[i] = true;
            } else if (strings[i] == 'false') {
                strings[i] = false;
            } else if (strings[i] == NaN) {
                strings[i] = "";
            }
        }

        boardHeight = strings[0];  
        boardWidth = strings[1];    
        boardMargin = strings[2];
        boundingTypeB = strings[3];
        //Plaque   
        plaqueHeight = strings[4];       
        plaqueWidth = strings[5];  
        plaqueSpacing = strings[6];
        constraint = strings[7];
        boundingTypeP = strings[8];
        //Advanced
        extensionTypeH = strings[9];
        extensionTypeV = strings[10];
        ratio = strings[11];
        trials = strings[12];
        //Palette
        coloursIndex = strings[13]*2;
        outlineCheck = strings[14];
        //Amounts
        amounts = strings[15];

    } catch (error) {}
}

//——————————————————————————————————————————————————————————————————————————————————————————————————————

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
}

function replaceBoard() {
    //Operators
    currentDoc = app.activeDocument;
    
    try {
        var set = currentDoc.dataSets;
    } catch (er) {}
        
    try {
        var item = currentDoc.selection[0];
        var compareWidth = item.width;
        var compareHeight = item.height;
    } catch (error) {
        alert("Select an object to comapre.");
        return false;
    }
    
    if (currentDoc.artboards.getActiveArtboardIndex() != 0) {
        
        //Gets positions of all plaques to replace
        positions = [];
        for (i = 0; i < currentDoc.pathItems.length; i++) {
            if (currentDoc.pathItems[i].width <= (compareWidth+2) && currentDoc.pathItems[i].width >= (compareWidth-2)) {
                if ((currentDoc.pathItems[i].height <= (compareHeight+2) && currentDoc.pathItems[i].height >= (compareHeight-2))) {
                    positions.push(currentDoc.pathItems[i]);
                }
            }
        }

        //Removes the excess plaque if needed
        if (positions[0] == item) {
            positions.splice(0, 1);
        }

        //Goes through each plaque, or until data set is complete
        for (i = 0; i < amounts[currentDoc.artboards.getActiveArtboardIndex()-1]; i++) {
            //Selects the plaque
            currentDoc.selection = null;
            currentDoc.selectObjectsOnActiveArtboard();
            //Attempts dataset display
            if (set.length != 0) {
                try {
                    set[i].display();
                } catch (er) {
                    currentDoc.selection = null;
                    app.executeMenuCommand("fitall")
                    return false;
                }
            }
            //Centers objects on plaque
            for (n = 0; n < currentDoc.selection.length; n++) {
                if (currentDoc.selection[n] != item) {
                    try {
                        currentDoc.selection[n].position = [item.position[0] + (compareWidth - currentDoc.selection[n].width)/2, item.position[1] - (compareHeight - currentDoc.selection[n].height)/2]
                    } catch (er) {}
                }
            }
            //Groups and moves a duplicate of the plaque
            app.copy();
            app.executeMenuCommand("pasteFront");
            groupSelect();
            currentDoc.groupItems[0].position = positions[i].position;
            //Removes hidden plaque
            try {
                if (positions[i].parent.typename != "Layer") {
                    positions[i].parent.remove();
                } else {
                    positions[i].remove();
                }
            } catch (er) {}
        }

    } else {
        currentDoc.selection = null;
        app.executeMenuCommand("fitall")
        alert("Activate an artboard other than the main board.");
        return false;
    }
    currentDoc.selection = null;
    app.executeMenuCommand("fitall")
}

//——————————————————————————————————————————————————————————————————————————————————————————————————————

//Runs the functions in the proper order
//Takes null
//Returns null
function runScript() {
    UI();
    if(response) {
        currentDoc = app.documents.add(); //Create new document
        convert();
        if (boundingType == 1) {
            createBoard1();
        } else if (boundingType == 2) {
            createBoard2();
        }
        createGrid();
        placePlaques();
        addTemplates();
        saveData();
        app.executeMenuCommand("fitall"); //Moves view to all pages
        currentDoc.artboards.setActiveArtboardIndex(0);
        if (sendAlert) {
            alert("Not every plaque was able to be placed.");
        }
    }
}

//Calls script, throws error if program failure occurs
try {
    runScript();
} catch (error) {
    alert("An error has occurred.");
}