function getNoneLayer()
{
	console.log("this is none circle:"+params.currentYear);

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
			context.moveTo((arcx/shells)+(bsize*2),arcy);
		    context.lineTo(arcx+bsize-(arcx/shells*(3+shellsDist)),arcy);
		    context.closePath();
		    context.stroke();
		}
	});
    noneLayer.add(blackLine);
	
	var year = params.currentYear;
	var dataindex = data["index"][params.currentYear];
	var datadata = data["data"];
	var startid = dataindex[1];
	var endid = data["index"][params.currentYear+1][1];
	var totalWeeks = 53;
	
	var currMonth = 0;
    var currDay = 0;
    var currWeek = 0;
    var currTotalDay = 0;
    var addOneDay = 0;
    var startWeek = 0;
    if(endid - startid == 365)
    {
        // to add empty spot on Feb 29
        addOneDay = 1;
    }

    var weeksInAMonth = new Array(4,4,5,4,4,5,4,4,5,4,4,6);

	for(var i = startid; i < endid; i++)
	{(function(){
		var info = datadata[i];
		var month = info["m"];
		var date = info["d"];
        var day = currDay;
        var dayForName = info["wd"];
        var weekNum = currWeek;
		var holiday = info["h"];

		if(month != currMonth)
		{
			var wc = weekNum;
			var mm = currMonth;
			var monthPos = calculateCircleBlockPosition(wc, weeksInAMonth[currMonth], shells-shellsDiff, totalWeeks);
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
            noneLayer.add(blockMonth);
			currMonth = month;
		}

		var thisbgcolor = params.grey[1];
		if(month%2 == 0)
			thisbgcolor = params.grey[2];
		// else
			// thisbgcolor = params.grey[2];
		var positions = calculateCircleBlockPosition(weekNum, 1, day, totalWeeks)
		var blockDay = new Kinetic.Shape(
		{
			drawFunc: function()
			{
				var context = this.getContext();
				context.fillStyle = this.mycolor;
				if(holiday != null)
					context.strokeStyle = params.colors[0];
				context.lineWidth = 2;
				context.beginPath();
				context.arc(arcx, arcy, positions.outer, positions.start, positions.end, false);
				context.arc(arcx, arcy, positions.inner, positions.end, positions.start, true);
				context.closePath();
				var thisSin = Math.sin((positions.start+positions.end)/2);
				var thisCos = Math.cos((positions.start+positions.end)/2);
				var thisR = (positions.outer+positions.inner)/2;
				context.fill();
				if(holiday != null)
					context.stroke();
				context.font = params.myCircleCalendarFont;
				context.fillStyle = textColor(thisbgcolor);
				context.fillText(date, arcx+(thisR*thisCos)-3, arcy+(thisR*thisSin)+3);
			}
		});
		blockDay.mycolor = thisbgcolor;
        noneLayer.add(blockDay);
		if(holiday != null)
		{
			blockDay.on("mouseover", function()
			{
				// tooltip.text1 = params.dayName[day]+" "+date+" "+params.monthName[(month+11)%12]+" "+year;
				tooltip.text1 = params.dayName[dayForName]+" "+date+" "+params.monthName[(month+11)%12]+" "+params.currentYear;
				tooltip.text2 = "Holiday : "+ holiday;
				tooltip.text3 = "Calendar : "+ "Gregorian";//calendarType;
				tooltip.show();
				blockDay.mycolor = "#f00";
                noneLayer.draw();
			});
			blockDay.on("mouseout", function()
			{
				tooltip.hide();
				blockDay.mycolor = thisbgcolor;
                noneLayer.draw();
			});
		}

        if(addOneDay == 1 && currTotalDay == 58)
        {
            currDay = currDay+1;
            day = day+1;
        }
        if(day == 6)
        {
            currDay = 0;
            currWeek = currWeek+1;
        }
        else
        {
            currDay = currDay+1;
        }
        currTotalDay = currTotalDay+1;

	}());}
	
	var tooltip = new Kinetic.Shape(
	{
		drawFunc: function()
		{
			var context = this.getContext();
        	context.font = params.myFont;
        	context.fillStyle = params.grey[5];
        	context.fillText(this.text1, params.ctooltipX+bsize, params.ctooltipY);
        	context.fillText(this.text2, params.ctooltipX+bsize, params.ctooltipY+30);
        	context.fillText(this.text3, params.ctooltipX+bsize, params.ctooltipY+60);
		}
	});
	tooltip.text1 = "";
	tooltip.text2 = "";
	tooltip.text3 = "";
	tooltip.hide();
    noneLayer.add(tooltip);
	
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
			context.fillText(params.currentYear, (arcx-midshell/2)+(midshell/4), (arcy-midshell)+(midshell/3));
		}
	});
    noneLayer.add(blockYear);
	var blockYearUp = new Kinetic.RegularPolygon(triangle(arcx,arcy,midshell,1));
    noneLayer.add(blockYearUp);
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
		params.currentYear = params.currentYear+1;
        noneLayer.removeChildren();
        getNoneLayer();
        noneLayer.draw();
	});
	var blockYearDown = new Kinetic.RegularPolygon(triangle(arcx,arcy,midshell,2));
    noneLayer.add(blockYearDown);
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
		params.currentYear = params.currentYear-1;
        noneLayer.removeChildren();
		getNoneLayer();
        noneLayer.draw();
	});
}


