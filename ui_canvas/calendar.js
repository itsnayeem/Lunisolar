var data;

function calendar()
{
	var dataindex = data.index;
	var datadata = data.data;
	
	var screenWidth = params.screenWidth;
	var screenHeight = params.screenHeight;
	var screenSize = params.screenSize;
	console.log("screen size: "+screenWidth+":"+screenHeight);
	console.log("screen circle: "+screenSize);
	
	space = new Kinetic.Stage(
	{
		container: "space",
        width: screenWidth,
        height: screenHeight
	});
	
//===== button =====
    mainLayer = new Kinetic.Layer();
	activeLayer = 1; // 1.circle 2.square 3.none	
	bsize = params.bsize;//150;
	buttonsize = params.buttonSize;//50;
	screenWidth = screenWidth-bsize;
	console.log("screen width: "+screenWidth);
			
	var b1 = new Kinetic.Shape(squareShape(0, 0, buttonsize, buttonsize, true, params.grey[2]));
	b1.alpha = 1;
	mainLayer.add(b1);
	var b2 = new Kinetic.Shape(squareShape(0, buttonsize, buttonsize, buttonsize, true, params.grey[2]));
	b2.alpha = 0.5;
	mainLayer.add(b2);
	var b3 = new Kinetic.Shape(squareShape(0, buttonsize*2, buttonsize, buttonsize, true, params.grey[2]));
	b3.alpha = 0.5;
	mainLayer.add(b3);
	
	b1.on("click", function()
	{
        if(activeLayer != 1)
        {
            b1.alpha = 1;
            b2.alpha = 0.5;
            b3.alpha = 0.5;
            circleLayer.show();
//            circleLayer.removeChildren();
//            getCircleLayer();
//            circleLayer.draw();
            circleRedraw();
            imgLayer.removeChildren();
            drawMoon();
            balloonLayer.show();
            imgLayer.show();
            squareLayer.hide();
            noneLayer.hide();
            space.draw();
            activeLayer = 1;
        }
	});
    b1.on("mouseover", function()
    {
        if(activeLayer != 1)
            document.body.style.cursor = "pointer";
    });
    b1.on("mouseout", function()
    {
        if(activeLayer != 1)
            document.body.style.cursor = "default";
    });
	b2.on("click", function()
	{
        if(activeLayer != 2)
        {
            b1.alpha = 0.5;
            b2.alpha = 1;
            b3.alpha = 0.5;
            circleLayer.hide();
            squareLayer.show();
            squareLayer.removeChildren();
            getSquareLayer();
            squareLayer.draw();
            noneLayer.hide();
            imgLayer.hide();
            balloonLayer.hide();
            space.draw();
            activeLayer = 2;
        }
	});
    b2.on("mouseover", function()
    {
        if(activeLayer != 2)
            document.body.style.cursor = "pointer";
    });
    b2.on("mouseout", function()
    {
        if(activeLayer != 2)
            document.body.style.cursor = "default";
    });
	b3.on("click", function()
	{
        if(activeLayer != 3)
        {
            activeLayer = 3;
            b1.alpha = 0.5;
            b2.alpha = 0.5;
            b3.alpha = 1;
            circleLayer.hide();
            squareLayer.hide();
            noneLayer.show();
            noneLayer.removeChildren();
            getNoneLayer();
            noneLayer.draw();
            imgLayer.hide();
            balloonLayer.hide();
            space.draw();
            activeLayer = 3;
        }
	});
    b3.on("mouseover", function()
    {
        if(activeLayer != 3)
            document.body.style.cursor = "pointer";
    });
    b3.on("mouseout", function()
    {
        if(activeLayer != 3)
            document.body.style.cursor = "default";
    });

    var icolor = 0;

    cal1 =
    {
        name: "Gregorian",
        on: true
    };
    cal2 =
    {
        name: "Hindu",
        on: true
    };
    cal3 =
    {
        name: "Islamic",
        on: true
    };
    cal4 =
    {
        name: "Jewish",
        on: true
    };

    op1toggle(4, cal1, params.colors[icolor]);
    op1toggle(5, cal2, params.colors[icolor+1]);
    op1toggle(6, cal3, params.colors[icolor+2]);
    op1toggle(7, cal4, params.colors[icolor+3]);

//==========

    balloonLayer = new Kinetic.Layer();
    tooltipOwnLayer = new Kinetic.Layer();
    circleTooltipButtonToggle = false;
    tooltipLayer = new Kinetic.Layer();
    imgLayer = new Kinetic.Layer();
	circleLayer = new Kinetic.Layer();
	getCircleLayer();
    squareLayer = new Kinetic.Layer();
	noneLayer = new Kinetic.Layer();
    drawMoon();

    space.add(imgLayer);
	space.add(mainLayer);
	space.add(circleLayer);
	space.add(squareLayer);
	space.add(noneLayer);
    space.add(tooltipOwnLayer);
    space.add(tooltipLayer);
    space.add(balloonLayer);

	if(activeLayer == 1)
    {
        squareLayer.hide();
        noneLayer.hide();
    }
	space.draw();
}


function circleRedraw()
{
    circleLayer.removeChildren();
    getCircleLayer();
    circleLayer.draw();
    balloonLayer.removeChildren();
    holidayBalloon();
    balloonLayer.draw();
    tooltipOwnLayer.removeChildren();
    drawTooltipFloat();
    tooltipOwnLayer.draw();
}

function squareShape(topx, topy, sizex, sizey, fill, fillcolor, strokecolor)
{
	if(fillcolor == null)
		fillcolor = params.grey[0];
	if(strokecolor == null)
		strokecolor = params.grey[0];

	return {
		drawFunc: function()
		{
			var context = this.getContext();
			context.lineWidth = 2;
			context.strokeStyle = strokecolor;
			context.fillStyle = fillcolor;
			context.beginPath();
			context.rect(topx, topy, sizex, sizey);
			context.closePath();
			if(fill == true)
				context.fill();
			context.stroke();
		}
	};
}

function squareOptionShape(topx, topy, sizex, sizey, strokecolor, mytext, select)
{
    if(strokecolor == null)
        strokecolor = params.grey[0];
    var fillcolor = params.grey[0];
    var fillcolor2 = params.grey[5];
    return {
        drawFunc: function()
        {
            var context = this.getContext();
            context.lineWidth = 2;
            context.strokeStyle = params.grey[1];
            context.fillStyle = fillcolor;
            context.beginPath();
            context.rect(topx, topy, sizex, sizey);
            context.closePath();
            context.fill();
            context.stroke();
            context.fillStyle = textColor(fillcolor);
            context.font =  (sizey/3)+"pt "+params.myFontFamily;
            context.fillText(mytext, topx+sizex/2, topy+sizey/5*3);

//            context.fillStyle = fillcolor2;
            context.strokeStyle = params.grey[1];
            if(select == true)
                context.strokeStyle = strokecolor;
            context.beginPath();
            context.rect(topx+(sizex/6), topy+(sizey/3), sizex/6, sizey/3);
            context.closePath();
//            if(select == true)
//                context.fill();
            context.stroke();
        }
    };
}

function op1toggle(pos, option1 , op1color)
{
    var op1 = new Kinetic.Shape(squareOptionShape(1, buttonsize*pos, buttonsize*3, buttonsize/3*2, op1color, option1.name, option1.on));
    mainLayer.add(op1);
    op1.on("click", function()
    {
        if(option1.on == false)
        {
            mainLayer.remove(op1);
            option1.on = true;
            op1toggle(pos, option1, op1color);
            circleRedraw();
            mainLayer.draw();
        }
        else
        {
            mainLayer.remove(op1);
            option1.on = false;
            op1toggle(pos, option1, op1color);
            circleRedraw();
            mainLayer.draw();
        }
    });
    op1.on("mouseover", function()
    {
        document.body.style.cursor = "pointer";
    });
    op1.on("mouseout", function()
    {
        document.body.style.cursor = "default";
    });

    return op1;
}

function redrawSelection()
{
    switch(activeLayer)
    {
        case 1:
            circleLayer.removeChildren();
            getCircleLayer();
            circleLayer.draw();
            break;
        case 2:
            squareLayer.removeChildren();
            getSquareLayer();
            squareLayer.draw();
            break;
        case 3:
            break;
        default:
            break;
    }
}