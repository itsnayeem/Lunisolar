function getCircleLayer()
{
	console.log("this is circle:"+params.currentYear);
	// var circleLayer = new Kinetic.Layer();

	// get circle blocks positions
	var arcy = params.screenSize/2;
	var arcx = arcy+(bsize*2);
	var shells = params.cshells;
    var shellsDist = params.cshellsDist;
	var shellsDiff = 5+shellsDist;

	// black cut line
	var blackLine = new Kinetic.Shape(
	{
		drawFunc: function()
		{
			var context = this.getContext();
			context.strokeStyle = params.grey[0];
			context.lineWidth = params.lineWidth*2;
			context.beginPath();
			context.moveTo((arcx/shells)+(bsize*3),arcy);
		    context.lineTo(arcx+bsize-(arcx/shells*(3+shellsDist)),arcy);
		    context.closePath();
		    context.stroke();
		}
	});
	circleLayer.add(blackLine);

	var year = params.currentYear;
	var dataindex = data["index"][params.currentYear];
	// var dataindex = data["index"][year];
	var datadata = data["data"];
	var startid = dataindex[1];
	var endid = data["index"][params.currentYear+1][1];
	// var endid = data["index"][year+1][1];
	var totalWeeks = datadata[endid-1]["wn"]-datadata[startid]["wn"]+1;

    var bcheckholidaytext = {
        week: 0,
        num: 0
    };

    createListOfHoliday();

	var currMonth = 0;
	for(var i = startid; i < endid; i++)
	{(function(){
		var info = datadata[i];
		var month = info["m"];
		var date = info["d"];
        var day = info["wd"];
        var weekNum = info["wn"]-datadata[startid]["wn"];
		var holiday = info["h"];
		var weeksInAMonth = datadata[dataindex[(month%12+1)]]["wn"]-info["wn"];

		if(month != currMonth)
		{
			var wc = weekNum;
			var mm = currMonth;
			var monthPos = calculateCircleBlockPosition(wc, weeksInAMonth, shells-shellsDiff, totalWeeks);
			var blockMonth = new Kinetic.Shape(
			{
				drawFunc: function()
				{
					var context = this.getContext();
					context.fillStyle = params.grey[0];
					context.strokeStyle = params.grey[1];
					context.lineWidth = 1;
					context.beginPath();
					context.arc(arcx, arcy, monthPos.outer, monthPos.start, monthPos.end, false);
					context.arc(arcx, arcy, monthPos.inner, monthPos.end, monthPos.start, true);
					context.closePath();
					context.fill();
					context.stroke();

					// month name
					context.save();
					context.font = ((monthPos.outer-monthPos.inner)/2)+"pt Calibri";
					var word = params.monthName[mm%12];
					var angleSpace = Math.PI*2/24;
					var angleBlock = 1+wc;
					var range = monthPos.inner+(params.lineWidth*2);
					context.translate(arcx, arcy);
					context.rotate(Math.PI*2/4 * -1);
					context.rotate(Math.PI*2/totalWeeks * angleBlock);
					for (var n = 0; n < word.length; n++)
					{
						context.rotate(angleSpace / word.length);
						context.save();
						context.translate(0, -1 * range);
						var charx = word[n];
						context.fillStyle = params.grey[3];//params.colors[mm];
						context.fillText(charx, 0, 0);
						context.restore();
					}
					context.restore();
				}
			});
			circleLayer.add(blockMonth);
			currMonth = month;
		}
		var thisbgcolor = params.grey[1];
		if(month%2 == 0)
			thisbgcolor = params.grey[2];
		// else
			// thisbgcolor = params.grey[2];
		var positions = calculateCircleBlockPosition(weekNum, 1, day, totalWeeks);
        var bcolorcode = params.colors[0];
        var bcolorcase = 0;

        if(holiday != null)
        {
            var tmppretext = date+" "+params.monthNameShort[month-1]+" : ";
            if(cal1.on && holiday[cal1.name] != null)
            {
                bcolorcode = params.colors[0];
                bcolorcase = 1;
                listOfHoliday.c1.push(tmppretext+holiday[cal1.name]);
            }
            else if(cal2.on && holiday[cal2.name] != null)
            {
                bcolorcode = params.colors[1];
                bcolorcase = 2;
                listOfHoliday.c2.push(tmppretext+holiday[cal2.name]);
            }
            else if(cal3.on && holiday[cal3.name] != null)
            {
                bcolorcode = params.colors[2];
                bcolorcase = 3;
                listOfHoliday.c3.push(tmppretext+holiday[cal3.name]);
            }
            else if(cal4.on && holiday[cal4.name] != null)
            {
                bcolorcode = params.colors[3];
                bcolorcase = 4;
                listOfHoliday.c4.push(tmppretext+holiday[cal4.name]);
            }
        }

		var blockDay = new Kinetic.Shape(
		{
			drawFunc: function()
			{
				var context = this.getContext();
				context.fillStyle = this.mycolor;
				context.lineWidth = 2;
				context.beginPath();
				context.arc(arcx, arcy, positions.outer, positions.start, positions.end, false);
				context.arc(arcx, arcy, positions.inner, positions.end, positions.start, true);
				context.closePath();
				var thisSin = Math.sin((positions.start+positions.end)/2);
				var thisCos = Math.cos((positions.start+positions.end)/2);
				var thisR = (positions.outer+positions.inner)/2;
				context.fill();
				context.font = params.myCircleCalendarFont;
				context.fillStyle = textColor(this.mycolor);
				context.fillText(date, arcx+(thisR*thisCos)-3, arcy+(thisR*thisSin)+3);

                if(bcolorcase > 0)
                {
                    context.strokeStyle = bcolorcode;
                    context.stroke();
                }
            }
		});
		blockDay.mycolor = thisbgcolor;
		circleLayer.add(blockDay);
		if(bcolorcase > 0)
		{
            blockDay.on("mousemove", function()
            {
                // color
                blockDay.mycolor = bcolorcode;
                circleLayer.draw();

                // tooltip text date
                var tmptext = params.dayNameShort[day]+" "+date+" "+params.monthNameShort[(month+11)%12]+" "+params.currentYear;
                var mousePos = space.getMousePosition();
                tooltipFloatDay.setPosition(mousePos.x+10, mousePos.y+10);
                tooltipFloatDay.setText(tmptext);
                tooltipFloatDay.show();

                // tooltip text holiday
                tmptext = null;
                if(cal1.on && holiday[cal1.name] != null)
                    tmptext = cal1.name+": "+holiday[cal1.name];
                else if(cal2.on && holiday[cal2.name] != null)
                    tmptext = cal2.name+": "+holiday[cal2.name];
                else if(cal3.on && holiday[cal3.name] != null)
                    tmptext = cal3.name+": "+holiday[cal3.name];
                else if(cal4.on && holiday[cal4.name] != null)
                    tmptext = cal4.name+": "+holiday[cal4.name];

                tooltipFloatHoliday.setPosition(mousePos.x+10, mousePos.y+35);
                tooltipFloatHoliday.setText(tmptext);
                tooltipFloatHoliday.show();

                tooltipLayer.draw();
            });
            blockDay.on("mouseover", function()
            {
                // color
                blockDay.mycolor = bcolorcode;
                circleLayer.draw();

                // tooltip text date
                var tmptext = params.dayNameShort[day]+" "+date+" "+params.monthNameShort[(month+11)%12]+" "+params.currentYear;
                var mousePos = space.getMousePosition();
                tooltipFloatDay.setPosition(mousePos.x+10, mousePos.y+10);
                tooltipFloatDay.setText(tmptext);
                tooltipFloatDay.show();

                // tooltip text holiday
                tmptext = null;
                if(cal1.on && holiday[cal1.name] != null)
                    tmptext = cal1.name+": "+holiday[cal1.name];
                else if(cal2.on && holiday[cal2.name] != null)
                    tmptext = cal2.name+": "+holiday[cal2.name];
                else if(cal3.on && holiday[cal3.name] != null)
                    tmptext = cal3.name+": "+holiday[cal3.name];
                else if(cal4.on && holiday[cal4.name] != null)
                    tmptext = cal4.name+": "+holiday[cal4.name];

                tooltipFloatHoliday.setPosition(mousePos.x+10, mousePos.y+35);
                tooltipFloatHoliday.setText(tmptext);
                tooltipFloatHoliday.show();

                tooltipLayer.draw();
            });
			blockDay.on("mouseout", function()
			{
                // color
				blockDay.mycolor = thisbgcolor;
				circleLayer.draw();

                // tooltip text
                tooltipFloatDay.hide();
                tooltipFloatHoliday.hide();
                tooltipLayer.draw();
			});
		}
	}());}

    var tooltipFloatDay = new Kinetic.Text({
        text: "",
        fontFamily: params.myFontFamily,
        fontSize: 12,
        padding: 5,
        textFill: params.grey[0],
        fill: params.grey[3],
        alpha: 0.95,
        visible: false
    });
    tooltipLayer.add(tooltipFloatDay);
    var tooltipFloatHoliday = new Kinetic.Text({
        text: "",
        fontFamily: "Calibri",
        fontSize: 12,
        padding: 5,
        textFill: params.grey[0],
        fill: params.grey[3],
        alpha: 0.95,
        visible: false
    });
    tooltipLayer.add(tooltipFloatHoliday);

	var midshell = (params.cr/params.cshells)*4;

	var blockYear = new Kinetic.Shape(
	{
		drawFunc: function()
		{
			var context = this.getContext();
			context.fillStyle = params.grey[0];
			context.strokeStyle = params.grey[1];
			context.lineWidth = 2;
			context.beginPath();
			context.rect(arcx-midshell/2, arcy-midshell, midshell, midshell/2);
			context.closePath();
			context.fill();
			context.stroke();
			context.font = (midshell/5)+"pt Calibri";
			context.fillStyle = params.grey[3];
			context.fillText(this.selectyear, (arcx-midshell/2)+(midshell/4), (arcy-midshell)+(midshell/3));
		}
	});
    blockYear.selectyear = params.currentYear;
	circleLayer.add(blockYear);
    blockYear.on("mouseover", function()
    {
        document.body.style.cursor = "pointer";
    });
    blockYear.on("mouseout", function()
    {
        document.body.style.cursor = "default";
    });
    blockYear.on("click", function()
    {
        blockYear.selectyear = 2000;
        circleLayer.draw();
    });


	var blockYearUp = new Kinetic.RegularPolygon(triangle(arcx,arcy,midshell,1));
	circleLayer.add(blockYearUp);
	blockYearUp.on("mouseover", function()
	{
		document.body.style.cursor = "pointer";
	});
	blockYearUp.on("mouseout", function()
	{
		document.body.style.cursor = "default";
	});
	blockYearUp.on("click", function()
	{
        var year = params.currentYear+1;
        var datayears = data["index"]["years"];
        var datayears_length = datayears.length-1;

        if(datayears[0] <= year && datayears[datayears_length] >= year)
        {
            params.currentYear = year;
            reDrawNewYear();
        }
	});
	var blockYearDown = new Kinetic.RegularPolygon(triangle(arcx,arcy,midshell,2));
	circleLayer.add(blockYearDown);
	blockYearDown.on("mouseover", function()
	{
		document.body.style.cursor = "pointer";
	});
	blockYearDown.on("mouseout", function()
	{
		document.body.style.cursor = "default";
	});
	blockYearDown.on("click", function()
	{
        var year = params.currentYear-1;
        var datayears = data["index"]["years"];
        var datayears_length = datayears.length-1;

        if(datayears[0] <= year && datayears[datayears_length] >= year)
        {
            params.currentYear = year;
            reDrawNewYear();
        }
	});

    var blockYearPlayForward = new Kinetic.RegularPolygon(triangle(arcx, arcy, midshell, 3));
    circleLayer.add(blockYearPlayForward);
    blockYearPlayForward.on("mouseover", function()
    {
        document.body.style.cursor = "pointer";
    });
    blockYearPlayForward.on("mouseout", function()
    {
        document.body.style.cursor = "default";
    });
    blockYearPlayForward.on("click", function()
    {
        myplay(true, 1);
    });
    var blockYearPlayForward2 = new Kinetic.RegularPolygon(triangle(arcx, arcy, midshell, 5));
    circleLayer.add(blockYearPlayForward2);
    blockYearPlayForward2.on("mouseover", function()
    {
        document.body.style.cursor = "pointer";
    });
    blockYearPlayForward2.on("mouseout", function()
    {
        document.body.style.cursor = "default";
    });
    blockYearPlayForward2.on("click", function()
    {
        myplay(true, 2);
    });

    var blockYearPlayBackward = new Kinetic.RegularPolygon(triangle(arcx, arcy, midshell, 4));
    circleLayer.add(blockYearPlayBackward);
    blockYearPlayBackward.on("mouseover", function()
    {
        document.body.style.cursor = "pointer";
    });
    blockYearPlayBackward.on("mouseout", function()
    {
        document.body.style.cursor = "default";
    });
    blockYearPlayBackward.on("click", function()
    {
        myplay(false, 1);
    });

    var blockYearPlayBackward2 = new Kinetic.RegularPolygon(triangle(arcx, arcy, midshell, 6));
    circleLayer.add(blockYearPlayBackward2);
    blockYearPlayBackward2.on("mouseover", function()
    {
        document.body.style.cursor = "pointer";
    });
    blockYearPlayBackward2.on("mouseout", function()
    {
        document.body.style.cursor = "default";
    });
    blockYearPlayBackward2.on("click", function()
    {
        myplay(false, 2);
    });

    var blockYearRelative = new Kinetic.Shape(
    {
        drawFunc: function()
        {
            var context = this.getContext();
            context.fillStyle = params.grey[0];
            context.strokeStyle = params.grey[1];
            context.lineWidth = 2;
            context.beginPath();
            context.rect(arcx-midshell, arcy+midshell/10, midshell*2, midshell*2/3);
            context.closePath();
            context.fill();
            context.stroke();
            context.font = (midshell/7)+"pt Calibri";
            context.fillStyle = params.grey[3];
            var tmpdateinfo = "Hindu : "+datadata[startid]["hindu_date"]["year"]+" - "+datadata[endid]["hindu_date"]["year"];
            context.fillText(tmpdateinfo,(arcx-midshell+(midshell/4)), (arcy+midshell/2));
        }
    });
    circleLayer.add(blockYearRelative);

    var buttonFloat = new Kinetic.Shape(
    {
        drawFunc: function()
        {
            var context = this.getContext();
            context.fillStyle = params.grey[1];
            context.lineWidth = 2;
            context.beginPath();
            context.rect(arcx-(midshell/4), arcy+midshell, midshell/2, midshell/4);
            context.closePath();
            context.fill();
            context.font = (midshell/8)+"pt Calibri";
            context.fillStyle = params.grey[3];
            context.fillText("?", arcx-(midshell/4)+(midshell/5), arcy+midshell+(midshell/6));
        }
    });
    circleLayer.add(buttonFloat);
    buttonFloat.on("click", function()
    {
        if(circleTooltipButtonToggle)
        {
            tooltipOwnLayer.hide();
            tooltipOwnLayer.draw();
            circleTooltipButtonToggle = false;
        }
        else
        {
            tooltipOwnLayer.show();
            tooltipOwnLayer.draw();
            circleTooltipButtonToggle = true;
        }
    });
    buttonFloat.on("mouseover", function()
    {
        document.body.style.cursor = "pointer";
    });
    buttonFloat.on("mouseout", function()
    {
        document.body.style.cursor = "default";
    });

    holidayBalloon();
    drawTooltipFloat();
}

function myplay(forward, mode)
{
    var loopauto = 4;
    var datayears = data["index"]["years"];
    var datayears_length = datayears.length-1;
    var year = params.currentYear;
    if(forward)
    {
        year = year+loopauto;
        if(datayears[datayears_length] <= year)
        {
            loopauto = datayears[datayears_length]-params.currentYear;
        }
    }
    else
    {
        year = year-loopauto;
        if(datayears[0] >= year)
        {
            loopauto = params.currentYear-datayears[0];
        }
    }

    for(var i = 0; i < loopauto; i++)
    {
        setTimeout(function(){mydelay(forward)}, i*(1000/mode));
    }
}

function mydelay(forward)
{
    var datayears = data["index"]["years"];
    var datayears_length = datayears.length-1;
    var year = params.currentYear;
    if(forward)
    {
        year = year+1;
    }
    else
    {
        year = year-1;
    }

    if(datayears[0] <= year && datayears[datayears_length] >= year)
    {
        params.currentYear = year;
        reDrawNewYear();
    }
}

function reDrawNewYear()
{
    createListOfHoliday();
    balloonLayer.removeChildren();
    circleLayer.removeChildren();
    tooltipOwnLayer.removeChildren();
    getCircleLayer();
    circleLayer.draw();
    balloonLayer.draw();
    tooltipOwnLayer.draw();
    imgLayer.removeChildren();
    drawMoon();
    imgLayer.draw();
}

function drawTooltipFloat()
{
    var arcy = params.screenSize/2;
    var arcx = arcy+(bsize*2);
    var dataindex = data["index"][params.currentYear];
    var datadata = data["data"];
    var startid = dataindex[1];
    var endid = data["index"][params.currentYear+1][1];
    var totalWeeks = datadata[endid-1]["wn"]-datadata[startid]["wn"]+1;

    for(var i = startid; i < endid; i++)
    {(function(){
        var info = datadata[i];
        var day = info["wd"];
        var weekNum = info["wn"]-datadata[startid]["wn"];
        var holiday = info["h"];

        var bcolorcode = params.colors[0];
        var tmptext = null;
        var btext = false;
        if(holiday != null)
        {
            if(cal1.on && holiday[cal1.name] != null)
            {
                bcolorcode = params.colors[0];
                tmptext = holiday[cal1.name];
                btext = true;
            }
            else if(cal2.on && holiday[cal2.name] != null)
            {
                bcolorcode = params.colors[1];
                tmptext = holiday[cal2.name];
            }
            else if(cal3.on && holiday[cal3.name] != null)
            {
                bcolorcode = params.colors[2];
                tmptext = holiday[cal3.name];
            }
            else if(cal4.on && holiday[cal4.name] != null)
            {
                bcolorcode = params.colors[3];
                tmptext = holiday[cal4.name];
            }
        }
        if(tmptext != null)
        {
            var pos = calculateCircleBlockPosition(weekNum, 1, day, totalWeeks);
            var toolSin = Math.sin((pos.start+pos.end)/2);
            var toolCos = Math.cos((pos.start+pos.end)/2);
            var toolR = (pos.outer+pos.inner)/2;

            var fsize = (pos.outer-pos.inner)/2;
            var tooltipOwnFloat = new Kinetic.Text(
            {
                text: "",
                fontFamily: params.myFontFamily,
                fontSize: fsize,
                padding: 5,
                textFill: textColor(bcolorcode),
                fill: bcolorcode,
                alpha: 0.75,
                visible: true
            });
            tooltipOwnLayer.add(tooltipOwnFloat);

            tooltipOwnFloat.setPosition(arcx+(toolR*toolCos)+fsize, arcy+(toolR*toolSin)-(fsize*2));
            tooltipOwnFloat.setText(tmptext);
        }

    }());}
    if(!circleTooltipButtonToggle)
        tooltipOwnLayer.hide();
}

function createListOfHoliday()
{
    listOfHoliday = {
        c1: new Array(),
        c2: new Array(),
        c3: new Array(),
        c4: new Array()
    };
}

function holidayBalloon()
{
    var topx = params.screenWidth-(buttonsize*5);
    var topy = buttonsize/2;
    var holidayNum = 0;
    var num = 0;

    for(var i in listOfHoliday)
    {
        var mycolor = params.colors[num++];
        for(var j in listOfHoliday[i])
        {
            var mytext = listOfHoliday[i][j];
            var balloon = new Kinetic.Text(
            {
                text: "",
                fontFamily: params.myFontFamily,
                stroke: mycolor,
                strokeWidth: 1,
                fontSize: buttonsize/5,
                padding: 5,
                textFill: "white",
                fill: params.grey[0],
                align: "left"
            });
            balloonLayer.add(balloon);
            balloon.setPosition(topx, topy+(buttonsize/2*holidayNum));
            balloon.setText(mytext);

            holidayNum++;
        }
    }
}

function drawMoon()
{
    var arcy = params.screenSize/2;
    var arcx = arcy+(bsize*2);
    var shells = params.cshells;
    var shellsDist = params.cshellsDist;
    var shellsDiff = 5+shellsDist;

    var dataindex = data["index"][params.currentYear];
    var datadata = data["data"];
    var startid = dataindex[1];
    var totalWeeks = 183;

    var hindu_date = datadata[startid]["hindu_date"]["day"];
    var i_date = 1;
    var moonphase = 1;
    var moonup = true;

    if(hindu_date%2 != 0)
    {
        i_date = hindu_date;
    }
    else
    {
        i_date = hindu_date-1;
    }

    if(i_date > 16)
    {
        moonup = false;
        switch (i_date)
        {
            case 17:
                moonphase = 7;
                break;
            case 19:
                moonphase = 6;
                break;
            case 21:
                moonphase = 5;
                break;
            case 23:
                moonphase = 4;
                break;
            case 25:
                moonphase = 3;
                break;
            case 27:
                moonphase = 2;
                break;
            case 29:
                moonphase = 1;
                break;
            default:
                moonphase = 1;
        }
    }
    else
    {
        moonphase = (i_date+1)/2;
    }

    for(var i = 0; i < totalWeeks; i++)
    {
        var moonPos = calculateCircleBlockPosition(i, 1, shells-shellsDiff+moonphase, totalWeeks);
        var moonSin = Math.sin((moonPos.start+moonPos.end)/2);
        var moonCos = Math.cos((moonPos.start+moonPos.end)/2);
        var moonR = (moonPos.outer+moonPos.inner)/2;
        moonImage(moonphase, arcx+(moonR*moonCos)-shellsDist, arcy+(moonR*moonSin)-shellsDist);
        if(moonup)
        {
            if(moonphase < 8)
            {
                moonphase++;
            }
            else
            {
                moonup = false;
                moonphase--;
            }
        }
        else
        {
            if(moonphase > 1)
            {
                moonphase--;
            }
            else
            {
                moonup = true;
            }
        }
    }

}

function moonImage(moonphase, imgx, imgy)
{
    var imgsize = params.cr/params.cshells/3*2;
    var img = moonImages[moonphase-1];

    if (!img){
        console.log("we don't have this image "+ moonphase);
    }

    var image = new Kinetic.Image(
    {
        x: imgx,
        y: imgy,
        image: img,
        width: imgsize,
        height: imgsize
    });
    imgLayer.add(image);
}


function triangle(x,y,midshell,direction)
{
	//1 up, 2 down, 3 left, 4 right
	var rotation = 0;
    var radius = 0;
	switch(direction)
	{
		case 1:
			y = y-midshell-(midshell/5);
            radius = midshell/5;
			break;
		case 2:
			y = y-(midshell/2)+(midshell/5);
			rotation = Math.PI;
            radius = midshell/5;
			break;
		case 3:
			x = x+midshell-(midshell/4);
			y = y-midshell+(midshell/4);
			rotation = (Math.PI/2);
            radius = midshell/5;
			break;
		case 4:
			x = x-midshell+(midshell/4);
            y = y-midshell+(midshell/4);
			rotation = (Math.PI*2-(Math.PI/2));
            radius = midshell/5;
			break;
        case 5:
            x = x+midshell+(midshell/10);
            y = y-midshell+(midshell/4);
            rotation = (Math.PI/2);
            radius = midshell/7;
            break;
        case 6:
            x = x-midshell-(midshell/10);
            y = y-midshell+(midshell/4);
            rotation = (Math.PI*2-(Math.PI/2));
            radius = midshell/7;
            break;
	}
	var t = new Kinetic.RegularPolygon(
	{
		x: x,
		y: y,
		sides: 3,
		radius: radius,
		// stroke: params.grey[1],
		fill: params.grey[1],
		rotation: rotation
	});
	return t;
}

// this week -> from total weeks
// week block -> to draw multiple block (ex. month)
// this day -> mon-sun to determine where the block in that week
function calculateCircleBlockPosition(thisWeek, weekBlocks, day, totalWeeks)
{
	var r = parseInt(params.cr);   
    var angle = params.cangle;
    var weeks = totalWeeks;
    var shells = parseInt(params.cshells);
    var shellsDist = parseInt(params.cshellsDist);
   	var thisDay = parseInt(day)+4+parseInt(shellsDist);
    
	var startAngle = (angle/(weeks/2) * thisWeek) + angle;
    var endAngle = (angle/(weeks/2) * thisWeek) + ((angle/(weeks/2))*weekBlocks) + angle;
    var outerRadius = (r/shells * thisDay);
    var innerRadius = (r/shells * thisDay) - ((r/shells));
    
    return {
    	outer: outerRadius,
    	inner: innerRadius,
    	start: startAngle,
    	end: endAngle
    };
}