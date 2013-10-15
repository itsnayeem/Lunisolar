var calendarData;
var calendarParams = {
    monthName: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    monthNameShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    dayName: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    dayNameShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    grey: ["#000000", // 0 black
        "#222222", // ^
        "#333333", // |
        "#666666", // |
        "#999999", // |
        "#BBBBBB", // v
        "#FFFFFF"  // 6 white
    ],
    colors: ["#FFFF99", // 0 yellow
        "#66CC66", // 1 dark green
        "#FF9999", // 2 rose pink
        "#CC99FF", // 3 light purple
        "#FF3333", // 4 red
        "#CCFFFF", // 5 light blue
        "#CCCC99", // 6 light green sand
        "#9933FF", // 7 purple
        "#6699FF", // 8 dark blue
        "#9933CC", // 9 purple
        "#666633", // 10 dark green
        "#FF9900", // 11 orange
        "#CCFF99", // 12 light green
        "#FF33CC" // 13 pink
    ],
    seasonColor: ["#CCFFFF", // 0 blue
                "#00CC33",   // 1 green
                "#FFCC00",   // 2 yellow
                "#CC3300",   // 3 orange
                "#CCFFFF"    // 0 blue
    ],
    screenWidth: $(window).width()*0.98,
    screenHeight: $(window).height()*0.98,
    screenMin: 0,

    space1Width: 0,
    space1Height: 0,

    space2Width: 0,
    space2Height: 0,

    space3Width: 0,
    space3Height: 0,

    moonImages: [],

    calendarOptions: {
        calendarOpt: [],
        calendarText: [],
        calendarSelect: [],
        calendarSelectBG: [],
        calendarMoveBG: [],
        calendarMove: []
    },

    tooltipText: [],

    myFontFamily: "Calibri",
    myFont: "12pt Calibri",

    shellsDist: 5, // make the circle blocks further from center
    shells: (14+5) // total 14 block + 5 shellsdist;... 3:sol, 4-10:days, 11:month, 13:moon
};

function paramsInit() {

    calendarParams.screenMin = Math.min(calendarParams.screenWidth, calendarParams.screenHeight);

    for(var i = 0; i < 6; i++) {
        var img = new Image();
        img.src = "img/m"+i+".gif";
        calendarParams.moonImages.push(img);
    }
}

function calendar() {
    var screenWidth = calendarParams.screenWidth;
    var screenHeight = calendarParams.screenHeight;
    var screenMin = calendarParams.screenMin;
//    console.log("screen width:"+screenWidth+", height:"+screenHeight+", min:"+screenMin);

    var canvasSpace1Width = screenWidth*0.2;
    var canvasSpace2Width = screenWidth*0.6;
    var canvasSpace3Width = screenWidth*0.2;
    var canvasSpace1 = new Kinetic.Stage({
        container: "space1",
        width: canvasSpace1Width,
        height: screenMin
    });
    calendarParams.space1Width = canvasSpace1.width;
    calendarParams.space1Height = canvasSpace1.height;
    var canvasSpace2 = new Kinetic.Stage({
        container: "space2",
        width: canvasSpace2Width,
        height: Math.min(screenMin, canvasSpace2Width)
    });
    calendarParams.space2Width = canvasSpace2.width;
    calendarParams.space2Height = canvasSpace2.height;
    calendarParams.canvasSpace2 = canvasSpace2;
    var canvasSpace3 = new Kinetic.Stage({
        container: "space3",
        width: canvasSpace3Width,
        height: screenMin
    });
//    console.log("canvasSpace1 width:"+canvasSpace1.width+", height:"+canvasSpace1.height);
//    console.log("canvasSpace2 width:"+canvasSpace2.width+", height:"+canvasSpace2.height);
//    console.log("canvasSpace3 width:"+canvasSpace3.width+", height:"+canvasSpace3.height);

    var activeStyle = 0; // 0 = circle, 1 = square

    var calendarLayer = new Kinetic.Layer();  // calendar style select
    var circleLayer = new Kinetic.Layer();
    var styleOptCircle = createRect();   // calendar style select
    var styleOptSquare = createRect();   // calendar style select
    var moonLayer = new Kinetic.Layer();
    var yearLayer = new Kinetic.Layer();
    var tooltipLayer = new Kinetic.Layer(); // hover tooltip
    calendarParams.tooltipText.push(tooltipLayer);
    var floatLayer = new Kinetic.Layer(); // floating description

    calendarOpt(calendarLayer, circleLayer, styleOptCircle, styleOptSquare);
    canvasSpace1.add(calendarLayer);

    moonInit(moonLayer);
    canvasSpace2.add(moonLayer);

    circleInit(circleLayer, tooltipLayer);
    canvasSpace2.add(circleLayer);

    yearSelect(yearLayer, activeStyle, circleLayer, moonLayer);
    canvasSpace2.add(yearLayer);
    canvasSpace2.add(tooltipLayer);

    styleSelect(activeStyle, calendarLayer, circleLayer, moonLayer, yearLayer, styleOptCircle, styleOptSquare);

    layerRedraw(calendarLayer);
    layerRedraw(moonLayer);

}

//========== calendar options ==========
function calendarOpt(calendarLayer, circleLayer, styleOptCircle, styleOptSquare) {
    var space1Width = calendarParams.space1Width;
    var space1Height = calendarParams.space1Height;
    var screenFit = Math.min(space1Width, space1Height);

    var calendarOptions = calendarParams.calendarOptions.calendarOpt;
    var calendarText = calendarParams.calendarOptions.calendarText;
    var calendarSelect = calendarParams.calendarOptions.calendarSelect;
    var calendarSelectBG = calendarParams.calendarOptions.calendarSelectBG;
    var calendarMoveBG = calendarParams.calendarOptions.calendarMoveBG;
    var calendarMove = calendarParams.calendarOptions.calendarMove;

    // calendar Selection
    var calopt1 = createCalOpt("Roman", calendarParams.colors[0]);
    calendarOptions.push(calopt1);
    var calopt2 = createCalOpt("Hindu", calendarParams.colors[1]);
    calendarOptions.push(calopt2);
    var calopt3 = createCalOpt("Islamic", calendarParams.colors[2]);
    calendarOptions.push(calopt3);
    var calopt4 = createCalOpt("Hebrew", calendarParams.colors[3]);
    calendarOptions.push(calopt4);
    var calopt5 = createCalOpt("Chinese", calendarParams.colors[4]);
    calendarOptions.push(calopt5);

    var blockW = screenFit/2;
    var blockH = blockW/5;
    var halfBlockW = blockW/2;
    var halfBlockH = blockH/2;
    var startx = blockW/3;
    var starty = blockW;
    var size = blockH/3;

    // select circle or square style
    calendarLayer.add(styleOptCircle);
    styleOptCircle.setPosition(startx/2, startx/2);
    styleOptCircle.setSize(halfBlockW, startx);

    calendarLayer.add(styleOptSquare);
    styleOptSquare.setPosition(startx/2+startx*2, startx/2);
    styleOptSquare.setSize(halfBlockW, startx);

    // calendar select
    for(var i = 0; i < calendarOptions.length; i++) {
        var tmp = blockH*(i*3/2);
        // option bg block
        var calOptBG = createRect();
        calendarLayer.add(calOptBG);
        mouseIcon(calOptBG);
        calOptBG.setPosition(startx, starty+tmp);
        calOptBG.setSize(blockW, blockH);
        calendarSelectBG.push(calOptBG);

        // option small block
        var calSelect = createRect();
        calendarLayer.add(calSelect);
        mouseIcon(calSelect);
        calSelect.setPosition(startx+halfBlockH, starty+tmp+size);
        calSelect.setSize(blockH*3/4, size);
        calendarSelect.push(calSelect);

        // option text
        var calOptText = createText();
        calendarLayer.add(calOptText);
        calOptText.setPosition(startx+(startx*5/4), starty+tmp+halfBlockH);
        calOptText.setFontSize(size);
        calOptText.setAlign("left");
        calendarText.push(calOptText);
    }

    // move select opt up/down
    for(var i = 1; i < (calendarOptions.length*2)-1; i++) {
        var tmp;
        var rotate = Math.PI;
        if(i%2 === 0) {
            tmp = (blockH*3/2)*(i/2)-blockH;
        } else {
            tmp = (blockH*3/2)*(i/2)+blockH*3/4;
            rotate = rotate*2;
        }
        var moveBG = createRect();
        calendarLayer.add(moveBG);
        mouseIcon(moveBG);
        moveBG.setPosition(startx+blockW+blockH/5, starty+tmp);
        moveBG.setSize(blockH, halfBlockH);
        calendarMoveBG.push(moveBG);

        var move = createTriangle(rotate);
        calendarLayer.add(move);
        mouseIcon(move);
        move.setPosition(startx+blockW+size*2, starty+tmp+halfBlockH/2);
        move.setRadius(blockH/4);
        calendarMove.push(move);
    }

    optionText(calendarLayer, circleLayer);
    moveOpt(calendarLayer, circleLayer);
}

function styleSelect(activeStyle, calendarLayer, circleLayer, moonLayer, yearLayer, styleOptCircle, styleOptSquare){
    if(activeStyle === 0) { // show circle
        styleOptCircle.fill = calendarParams.grey[2];
        styleOptSquare.fill = calendarParams.grey[0];

        styleOptCircle.on("mouseover", function(){
            document.body.style.cursor = "default";
        });
        styleOptCircle.on("mouseout", function(){
            document.body.style.cursor = "default";
        });
        mouseIcon(styleOptSquare);
        styleOptSquare.on("click", function(){
            activeStyle = 1;
            styleOptCircle.fill = calendarParams.grey[0];
            styleOptSquare.fill = calendarParams.grey[2];
            circleLayer.hide();
            moonLayer.hide();
            styleSelect(activeStyle, calendarLayer, circleLayer, moonLayer, yearLayer, styleOptCircle, styleOptSquare);
            layerRedraw(calendarLayer);
            layerRedraw(circleLayer);
            layerRedraw(moonLayer);
            layerRedraw(yearLayer);
        });
    } else { // show square
        styleOptCircle.fill = calendarParams.grey[0];
        styleOptSquare.fill = calendarParams.grey[2];

        styleOptSquare.on("mouseover", function(){
            document.body.style.cursor = "default";
        });
        styleOptSquare.on("mouseout", function(){
            document.body.style.cursor = "default";
        });
        mouseIcon(styleOptCircle);
        styleOptCircle.on("click", function(){
            activeStyle = 0;
            styleOptCircle.fill = calendarParams.grey[2];
            styleOptSquare.fill = calendarParams.grey[0];
            circleLayer.show();
            moonLayer.show();
            styleSelect(activeStyle, calendarLayer, circleLayer, moonLayer, yearLayer, styleOptCircle, styleOptSquare);
            layerRedraw(calendarLayer);
            layerRedraw(circleLayer);
            layerRedraw(moonLayer);
            layerRedraw(yearLayer);
        });
    }

}

function optionText(calendarLayer, circleLayer){
    var calendarOptions = calendarParams.calendarOptions.calendarOpt;
    var calendarText = calendarParams.calendarOptions.calendarText;
    var calendarSelect = calendarParams.calendarOptions.calendarSelect;
    var calendarSelectBG = calendarParams.calendarOptions.calendarSelectBG;
    var basecolor = calendarParams.grey[2];

    var k = 0;
    for(var i = 0; i < calendarOptions.length; i++) {(function(){
        var item = k;
        calendarText[item].setText((item+1)+". "+calendarOptions[item].name);
        if(calendarOptions[item].on)  {
            calendarSelect[item].stroke = calendarOptions[item].textcolor;
        }

        calendarSelectBG[item].on("click", function(){
            if(calendarOptions[item].on) {
                calendarOptions[item].on = false;
                calendarSelect[item].stroke = basecolor;
            } else {
                calendarOptions[item].on = true;
                calendarSelect[item].stroke = calendarOptions[item].textcolor;
            }
            layerRedraw(calendarLayer);
            circleRedraw(circleLayer);
        });
        calendarSelect[item].on("click", function(){
            if(calendarOptions[item].on) {
                calendarOptions[item].on = false;
                calendarSelect[item].stroke = basecolor;
            } else {
                calendarOptions[item].on = true;
                calendarSelect[item].stroke = calendarOptions[item].textcolor;
            }
            layerRedraw(calendarLayer);
            circleRedraw(circleLayer);
        });
        k++;
    }());}
}

function moveOpt(calendarLayer, circleLayer){
    var calendarMoveBG = calendarParams.calendarOptions.calendarMoveBG;
    var calendarMove = calendarParams.calendarOptions.calendarMove;
    var calendarOptions = calendarParams.calendarOptions.calendarOpt;
    k = 0;
    for(var i = 0; i < calendarMoveBG.length; i++) {(function(){
        var item = k;
        calendarMoveBG[item].on("click", function(){
            var pos = Math.ceil(item/2);
            var tmpOpt = calendarOptions[pos];
            if(item%2 === 0) {
                calendarOptions[pos] = calendarOptions[pos+1];
                calendarOptions[pos+1] = tmpOpt;
            } else {
                calendarOptions[pos] = calendarOptions[pos-1];
                calendarOptions[pos-1] = tmpOpt;
            }
            optionText(calendarLayer);
            layerRedraw(calendarLayer);
            circleRedraw(circleLayer);
        });
        calendarMove[item].on("click", function(){
            var pos = Math.ceil(item/2);
            var tmpOpt = calendarOptions[pos];
            if(item%2 === 0) {
                calendarOptions[pos] = calendarOptions[pos+1];
                calendarOptions[pos+1] = tmpOpt;
            } else {
                calendarOptions[pos] = calendarOptions[pos-1];
                calendarOptions[pos-1] = tmpOpt;
            }
            optionText(calendarLayer);
            layerRedraw(calendarLayer);
            circleRedraw(circleLayer);
        });
        k++;
    }());}
}

function createCalOpt(name, color) {
    var newCal = {
        name: name,
        on: true,
        textcolor: color
    };
    return newCal;
}

//========== year yearSelect ==========

function yearSelect(yearLayer, activeStyle, circleLayer, moonLayer) {

//---------- create block year & button ----------
    var blockYear = createRect();
    var blockYearText = createText();
    blockYearText.setText(calendarData.currentYear);
    yearLayer.add(blockYear);
    yearLayer.add(blockYearText);

    //----- relative year -----
    var relateYearBG = createRect();
    var relateYearText_hindu = createText();
    var relateYearText_islamic = createText();
    var relateYearText_hebrew = createText();
    var relateYearText_chinese = createText();
    yearLayer.add(relateYearBG);
    yearLayer.add(relateYearText_hindu);
    yearLayer.add(relateYearText_islamic);
    yearLayer.add(relateYearText_hebrew);
    yearLayer.add(relateYearText_chinese);

    //----- forward -----
    var forwardYearRectButton = createRect();
    var forwardYearTriButton = createTriangle(Math.PI/2);
    yearLayer.add(forwardYearRectButton);
    yearLayer.add(forwardYearTriButton);
    mouseIcon(forwardYearRectButton);
    mouseIcon(forwardYearTriButton);
    forwardYearRectButton.on("click", function(){
        calendarData.currentYear++;
        yearChangeRedraw(blockYearText, circleLayer, yearLayer, moonLayer,
            relateYearText_hindu,relateYearText_islamic,
            relateYearText_hebrew,relateYearText_chinese)
    });
    forwardYearTriButton.on("click", function(){
        calendarData.currentYear++;
        yearChangeRedraw(blockYearText, circleLayer, yearLayer, moonLayer,
            relateYearText_hindu,relateYearText_islamic,
            relateYearText_hebrew,relateYearText_chinese)
    });

    //----- backward -----
    var backwardYearRectButton = createRect();
    var backwardYearTriButton = createTriangle(Math.PI*3/2);
    yearLayer.add(backwardYearRectButton);
    yearLayer.add(backwardYearTriButton);
    mouseIcon(backwardYearRectButton);
    mouseIcon(backwardYearTriButton);
    backwardYearRectButton.on("click", function(){
        calendarData.currentYear--;
        blockYearText.setText(calendarData.currentYear);
        yearChangeRedraw(blockYearText, circleLayer, yearLayer, moonLayer,
            relateYearText_hindu,relateYearText_islamic,
            relateYearText_hebrew,relateYearText_chinese)
    });
    backwardYearTriButton.on("click", function(){
        calendarData.currentYear--;
        yearChangeRedraw(blockYearText, circleLayer, yearLayer, moonLayer,
            relateYearText_hindu,relateYearText_islamic,
            relateYearText_hebrew,relateYearText_chinese)
    });

    //*****************************************************************
    // not done
    var floatButton = createRect();
    yearLayer.add(floatButton);
    mouseIcon(floatButton);

    // floatLayer


//---------- position block year & button ----------

    if(activeStyle === 0) { // circle
        var radius = calendarParams.space2Height/2;
        var arcx = calendarParams.space2Width/2;
        var arcy = radius;
        var singleBlock = (radius/calendarParams.shells);
        var doubleBlock = singleBlock*2;
        var singleBlock3 = singleBlock*3;
        var biggerBlock = singleBlock*4;

        blockYear.setPosition(arcx-doubleBlock, arcy-biggerBlock);
        blockYear.setSize(biggerBlock, doubleBlock);

        blockYearText.setFontSize(singleBlock);
        blockYearText.setPosition(arcx, arcy-singleBlock3);

        forwardYearRectButton.setPosition(arcx+(biggerBlock*3/5), arcy-biggerBlock);
        forwardYearRectButton.setSize(singleBlock3/2, doubleBlock);

        forwardYearTriButton.setPosition(arcx+singleBlock3, arcy-singleBlock3);
        forwardYearTriButton.setRadius(doubleBlock/3);

        backwardYearRectButton.setPosition(arcx-(biggerBlock)+(singleBlock/12), arcy-biggerBlock);
        backwardYearRectButton.setSize(singleBlock3/2, doubleBlock);

        backwardYearTriButton.setPosition(arcx-singleBlock3, arcy-singleBlock3);
        backwardYearTriButton.setRadius(doubleBlock/3);

        relateYearBG.setPosition(arcx-biggerBlock-singleBlock, arcy-singleBlock);
        relateYearBG.setSize(biggerBlock*2+doubleBlock, biggerBlock+singleBlock);

        relateYearText(relateYearText_hindu, calendarData.currentYear_hindu, doubleBlock/3, arcx, arcy);
        relateYearText(relateYearText_islamic, calendarData.currentYear_islamic, doubleBlock/3, arcx, arcy+singleBlock);
        relateYearText(relateYearText_hebrew, calendarData.currentYear_hebrew, doubleBlock/3, arcx, arcy+doubleBlock);
        relateYearText(relateYearText_chinese, calendarData.currentYear_chinese, doubleBlock/3, arcx, arcy+singleBlock3);

    } else if(activeStyle === 1){ //square

    }


}

function yearChangeRedraw(blockYearText, circleLayer, yearLayer, moonLayer,
                          relateYearText_hindu,relateYearText_islamic,
                          relateYearText_hebrew,relateYearText_chinese) {
    blockYearText.setText(calendarData.currentYear);
    circleRedraw(circleLayer);
    relateYearNewText(relateYearText_hindu,relateYearText_islamic,relateYearText_hebrew,relateYearText_chinese);
    layerRedraw(yearLayer);
    layerRedraw(moonLayer);
}

function relateYearNewText(relateYearText_hindu,relateYearText_islamic,relateYearText_hebrew,relateYearText_chinese){
    relateYearText_hindu.setText(calendarData.currentYear_hindu);
    relateYearText_islamic.setText(calendarData.currentYear_islamic);
    relateYearText_hebrew.setText(calendarData.currentYear_hebrew);
    relateYearText_chinese.setText(calendarData.currentYear_chinese);
}

function relateYearText(textobj, text, fontsize, x, y) {

    textobj.setText(text);
    textobj.setFontSize(fontsize);
    textobj.setPosition(x, y);
}

//========== end yearSelect ==========


function mouseIcon(shape) {
    shape.on("mouseover", function(){
        document.body.style.cursor = "pointer";
    });
    shape.on("mouseout", function(){
        document.body.style.cursor = "default";
    });
}

function createRect() {
    var newRect = new Kinetic.Rect({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        fill: calendarParams.grey[0],
        stroke: calendarParams.grey[2],
        strokeWidth: 2
    });

    return newRect;
}

function createTriangle(rotation) {
    var newTri = new Kinetic.RegularPolygon({
        x: 0,
        y: 0,
        sides: 3,
        radius: 0,
        rotation: rotation,
        fill: calendarParams.grey[2]
    });

    return newTri;
}

function createText() {
    var newText = new Kinetic.Text({
        x: 0,
        y: 0,
        text: "",
        fontSize: 0,
        fontFamily: calendarParams.myFontFamily,
        textFill: calendarParams.grey[4],
        align: "center",
        verticalAlign: "middle"
    });
    return newText;
}


//========== circle ==========

var circleBlocks = {
    blockDateArray: [],
    blockMonthArray: [],
    blockSeasonArray: []
};

function circleInit(circleLayer, tooltipLayer) {

    var radius = calendarParams.space2Height/2;
    var arcx = calendarParams.space2Width/2;
    var arcy = radius;
    var totalWeeks = 54;

//---------- create shape ----------

    var blockDateArray = circleBlocks.blockDateArray;
    var blockMonthArray = circleBlocks.blockMonthArray;
    var blockSeasonArray = circleBlocks.blockSeasonArray;

    // days' block
    for(var i = 0; i < totalWeeks; i++) {
        for(var k = 0; k < 7; k++) {(function(){
            var blockBG = new Kinetic.Shape({
                drawFunc: function() {
                    var context = this.getContext();
                    context.fillStyle = this.fillcolor;
                    context.strokeStyle = this.strokecolor;
                    context.lineWidth = 1;
                    context.beginPath();
                    context.arc(arcx, arcy, this.pos.outer, this.pos.start, this.pos.end, false);
                    context.arc(arcx, arcy, this.pos.inner, this.pos.end, this.pos.start, true);
                    context.closePath();
                    context.fill();
                    context.stroke();

                    var thisSin = Math.sin((this.pos.start+this.pos.end)/2);
                    var thisCos = Math.cos((this.pos.start+this.pos.end)/2);
                    var thisR = (this.pos.outer+this.pos.inner)/2;
                    context.font = (this.pos.outer-this.pos.inner)/2+"px "+calendarParams.myFontFamily;
                    context.fillStyle = this.textcolor;
                    context.fillText(this.textdate, arcx+(thisR*thisCos)-3, arcy+(thisR*thisSin)+3);
                },
                fillcolor: calendarParams.grey[0],
                strokecolor: calendarParams.grey[0],
                textcolor: calendarParams.grey[0],
                textdate: "",
                pos: {
                    outer: 0,
                    inner: 0,
                    start: 0,
                    end: 0
                }
            });
            circleLayer.add(blockBG);
            blockDateArray.push(blockBG);
        }());}
    }
    // months' block
    for(var i = 0; i < 12; i++) {(function(){
        var month = i;
        var blockBG = new Kinetic.Shape({
            drawFunc: function() {
                var context = this.getContext();
                context.fillStyle = this.fillcolor;
                context.strokeStyle = this.strokecolor;
                context.lineWidth = 2;
                context.beginPath();
                context.arc(arcx, arcy, this.pos.outer, this.pos.start, this.pos.end, false);
                context.arc(arcx, arcy, this.pos.inner, this.pos.end, this.pos.start, true);
                context.closePath();
                context.fill();
                context.stroke();

                // month name
                context.save();
                context.font = ((this.pos.outer-this.pos.inner)/2)+"pt "+calendarParams.myFontFamily;
                var word = calendarParams.monthName[month];
                var angleSpace = Math.PI*2/24;
                var angleBlock = (1+this.weekStart+18);
                if(angleBlock >= totalWeeks-1) {
                    angleBlock = angleBlock%totalWeeks+1;
                }
                var range = this.pos.inner+context.lineWidth;
                context.translate(arcx, arcy);
                context.rotate(Math.PI/2 * -1);
                context.rotate(Math.PI*2/totalWeeks * angleBlock);
                for (var n = 0; n < word.length; n++)
                {
                    context.rotate(angleSpace / word.length);
                    context.save();
                    context.translate(0, -1 * range);
                    var charx = word[n];
                    context.fillStyle = this.textcolor;
                    context.fillText(charx, 0, 0);
                    context.restore();
                }
                context.restore();
            },
            fillcolor: calendarParams.grey[0],
            strokecolor: calendarParams.grey[2],
            textcolor: calendarParams.grey[4],//params.colors[mm]
            weekStart: month,
            pos: {
                outer: 0,
                inner: 0,
                start: 0,
                end: 0
            }
        });
        circleLayer.add(blockBG);
        blockMonthArray.push(blockBG);
    }());}

    // solstice
    for(var i = 0; i < 5; i++) {(function(){
        var season = new Kinetic.Shape({
            drawFunc: function() {
                var context = this.getContext();
                context.strokeStyle = this.strokecolor;
                context.lineWidth = 2;
                context.beginPath();
                context.arc(arcx, arcy, this.pos.inner, this.pos.start, this.pos.end, false);
                context.stroke();
            },
            strokecolor: calendarParams.seasonColor[i],
            pos: {
                outer: 0,
                inner: 0,
                start: 0,
                end: 0
            }
        });
        circleLayer.add(season);
        blockSeasonArray.push(season);
    }());}

    var tooltipText = createText();
    tooltipLayer.add(tooltipText);
    var tsize = radius/35;
    tooltipText.setTextFill(textColor(calendarParams.grey[5]));
    tooltipText.setFill(calendarParams.grey[5]);
    tooltipText.setFontSize(tsize);
    tooltipText.setPadding(tsize);
    tooltipText.setAlpha(0.95);

    calendarParams.tooltipText.push(tooltipText);

    circleApply(circleLayer);
}

function circleApply(circleLayer) {

    var radius = calendarParams.space2Height/2;
    var arcx = calendarParams.space2Width/2;
    var arcy = radius;
    var blockDateArray = circleBlocks.blockDateArray;
    var blockMonthArray = circleBlocks.blockMonthArray;
    var blockSeasonArray = circleBlocks.blockSeasonArray;
    var blockMoonArray = moonArray;

//---------- apply data ----------
    var year = calendarData.currentYear;
    var dataIndex = calendarData["index"][year];
    var dataData = calendarData["data"];
    var startID = dataIndex[1];
    var endID = calendarData["index"][year+1][1];
    var totalWeeks = dataData[endID-1]["wn"]-dataData[startID]["wn"]+1;

    calendarData.currentYear_hindu = "Hindu : "+dataData[startID]["hindu_date"]["year"]+" - "+dataData[endID]["hindu_date"]["year"];
    calendarData.currentYear_islamic = "Islamic : "+dataData[startID]["islamic_date"]["year"]+" - "+dataData[endID]["islamic_date"]["year"];
    calendarData.currentYear_hebrew = "Hebrew : "+dataData[startID]["hebrew_date"]["year"]+" - "+dataData[endID]["hebrew_date"]["year"];
//    calendarData.currentYear_chinese = "Chinese : "+dataData[startID]["chinese_date"]["year"]+" - "+dataData[endID]["chinese_date"]["year"];
    calendarData.currentYear_chinese = "Chinese : 4709 - 4710";

    var iArray = 0;
    var currMonth = 0;
    var currWeek = 0;
    var seasonWeeks = [];
    var tmpWeeks = 0;
    for(var i = startID; i < endID; i++) {(function(){
        var info = dataData[i];
        var month = info["m"];
        var date = info["d"];
        var day = info["wd"];
        var weekNum = info["wn"]-dataData[startID]["wn"];
        var holiday = info["h"];
        var weeksInAMonth = dataData[dataIndex[(month%12+1)]]["wn"]-info["wn"];

        // re-assign months' block
        if(currMonth != month) {
            blockMonthArray[currMonth].weekStart = weekNum;
            blockMonthArray[currMonth].pos = calculateCircleBlockPosition(weekNum, weeksInAMonth, 7, totalWeeks, radius);
            currMonth++;
        }
        // re-assign days' block
        var basecolor = calendarParams.grey[3];
        if(day === 0 || day === 6) { // weekend
            basecolor = calendarParams.grey[1];
        } else if(month%2 === 0) { // light/dark between each month
            basecolor = calendarParams.grey[2];
        }

        var fillcolor = basecolor;
        var calendarOptions = calendarParams.calendarOptions.calendarOpt;
        var tooltipLayer = calendarParams.tooltipText[0];
        var tooltipText = calendarParams.tooltipText[1];
        var holidayCheck = false;
        var holidayText = null;
        if(holiday != null) {
            for(var m = 0; m < calendarOptions.length; m++){
                if(holiday[calendarOptions[m].name] != null && calendarOptions[m].on) {
                    fillcolor = calendarOptions[m].textcolor;
                    holidayCheck = true;
                    holidayText = calendarParams.dayNameShort[day]+" "+date+" "+
                        calendarParams.monthNameShort[month-1]+" "+year+": "+holiday[calendarOptions[m].name];
                    break;
                }
            }
        }
        var lociArray = iArray;

        blockDateArray[lociArray].textdate = date;
        blockDateArray[lociArray].pos = calculateCircleBlockPosition(weekNum, 1, day, totalWeeks, radius);

        if(month-1 === 1 && date === 28) {
            console.log(holidayText+" 1"+holidayCheck);
        }
        if(holidayCheck && holidayText != null) {
            blockDateArray[lociArray].on("mouseover mousemove", function() {
                var mousePos = calendarParams.canvasSpace2.getMousePosition();
                tooltipText.setPosition(mousePos.x+10, mousePos.y-20);
                tooltipText.setText(holidayText);
                tooltipText.show();

                var mouseovergrey = calendarParams.grey[6];
                blockDateArray[lociArray].fillcolor = mouseovergrey;
                blockDateArray[lociArray].textcolor = textColor(mouseovergrey);
                layerRedraw(tooltipLayer);
                layerRedraw(circleLayer);
            });
            blockDateArray[lociArray].on("mouseout", function() {
                tooltipText.hide();
                blockDateArray[lociArray].fillcolor = fillcolor;
                blockDateArray[lociArray].textcolor = textColor(fillcolor);
                layerRedraw(tooltipLayer);
                layerRedraw(circleLayer);
            });

            blockDateArray[lociArray].fillcolor = fillcolor;
            blockDateArray[lociArray].textcolor = textColor(fillcolor);
        } else {
            blockDateArray[lociArray].fillcolor = basecolor;
            blockDateArray[lociArray].textcolor = textColor(basecolor);

            blockDateArray[lociArray].off("mouseover mousemove");
            blockDateArray[lociArray].off("mouseout");
        }
        iArray++;

        // moon phase
        var singleBlock = (radius/calendarParams.shells);
        var moonday = dataData[i]["hindu_date"]["day"];
        var locWeek = currWeek;
        if(moonday === 1) { // new moon
            blockMoonArray[locWeek].image = calendarParams.moonImages[0];
        } else if(moonday === 15) {  // full moon
            blockMoonArray[locWeek].image = calendarParams.moonImages[5];
        } else {
            blockMoonArray[locWeek].image = calendarParams.moonImages[2];
        }
        if(moonday === 1 || moonday === 15 || moonday === 8 || moonday === 22) {
            var pos = calculateCircleBlockPosition(weekNum, 1, 9, totalWeeks, radius);
            var thisSin = Math.sin((pos.start+pos.end)/2);
            var thisCos = Math.cos((pos.start+pos.end)/2);
            var thisR = (pos.outer+pos.inner)/2;
            blockMoonArray[locWeek].setPosition(arcx+(thisR*thisCos)-singleBlock/2, arcy+(thisR*thisSin)-singleBlock/2);
            blockMoonArray[locWeek].setSize(singleBlock, singleBlock);
            currWeek++;
        }

        // solstice
        if((month === 3 && date === 20) ||
            (month === 6 && date === 21) ||
            (month === 9 && date === 22) ||
            (month === 12 && date === 21)) {
            seasonWeeks.push(weekNum-tmpWeeks);
            tmpWeeks = weekNum;
        }
    }());}
    seasonWeeks.push(totalWeeks-tmpWeeks);

    while(iArray < blockDateArray.length) {
        blockDateArray[iArray].setPosition(0,0);
        blockDateArray[iArray].off("mouseover mousemove");
        iArray++;
    }

    var tmp = 0;
    for(var i = 0; i < seasonWeeks.length; i++) {
        blockSeasonArray[i].pos = calculateCircleBlockPosition(tmp, seasonWeeks[i], 8, totalWeeks, radius);
        tmp = tmp+seasonWeeks[i];
    }

    while(currWeek < 54){
        blockMoonArray[currWeek].setSize(0, 0);
        currWeek++;
    }

}

// this week -> from total weeks
// week block -> to draw multiple block (ex. month)
// this day -> mon-sun to determine where the block in that week
function calculateCircleBlockPosition(thisWeek, weekBlocks, day, totalWeeks, radius) {
    var pi = Math.PI;
    var shellsDist = parseInt(calendarParams.shellsDist); // make the circle blocks further from center
    var shells = parseInt(calendarParams.shells); // 3:sol, 4-10:days, 11:month, 13:moon
    var thisDay = day+4+shellsDist;

    var startAngle = (pi/(totalWeeks/2) * thisWeek) + (pi*5/3);
    var endAngle = (pi/(totalWeeks/2) * thisWeek) + ((pi/(totalWeeks/2))*weekBlocks) + (pi*5/3);
    var outerRadius = (radius/shells * thisDay);
    var innerRadius = (radius/shells * thisDay) - ((radius/shells));

    return {
        outer: outerRadius,
        inner: innerRadius,
        start: startAngle,
        end: endAngle
    };
}

//========== end circle ==========

//========== moon phase ==========

var moonArray = [];

function moonInit(moonLayer){
    var totalWeeks = 54;

    for(var i = 0; i < totalWeeks; i++) {
        var moonPhase = new Kinetic.Image({
            x: 0,
            y: 0,
            image: calendarParams.moonImages[0],
            width: 0,
            height: 0
        });
        moonLayer.add(moonPhase);
        moonArray.push(moonPhase);
    }
}

//========== end moon phase ==========

function circleRedraw(circleLayer) {
    circleApply(circleLayer);
    layerRedraw(circleLayer);
}

function layerRedraw(layer) {
    layer.clear();
    layer.draw();
}

function textColor(bgColor) {
    var white = "#EEEEEE";
    var black = "#000000";
    var green = parseInt(bgColor.substring(3,5), 16);
//    var red = parseInt(bgColor.substring(1,3), 16);
//    var blue = parseInt(bgColor.substring(5,7), 16);
    var mid = 128;

    if(green < mid) {
        return white;
    }
    return black;
}