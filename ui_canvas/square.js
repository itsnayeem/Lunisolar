	
function getSquareLayer()
{
	console.log("this is square:"+params.currentYear);
//	var squareLayer = new Kinetic.Layer();
	
	var tooltip = new Kinetic.Shape(
	{
		drawFunc: function()
		{
			var context = this.getContext();
        	context.font = params.myFont;
        	context.fillStyle = params.grey[5];
        	context.fillText(this.text1, params.stooltipX+bsize, params.stooltipY);
        	context.fillText(this.text2, params.stooltipX+bsize, params.stooltipY+30);
        	context.fillText(this.text3, params.stooltipX+bsize, params.stooltipY+60);
		}
	});
	tooltip.text1 = "";
	tooltip.text2 = "";
	tooltip.text3 = "";
	tooltip.hide();
	squareLayer.add(tooltip);
	
	// year tag	
	var yearPos = calculateSquareBlockPosition(1, 0, 0, true);
	var blockYear = new Kinetic.Shape(
	{
		drawFunc: function()
		{
			var context = this.getContext();		
			context.strokeStyle = params.grey[1];
			context.lineWidth = 2;
			context.beginPath();
			context.strokeRect(yearPos.topx, yearPos.topy-(yearPos.sizey*4), yearPos.sizex*(params.stotalBlockX-3), yearPos.sizey*3);	
			context.closePath();
			context.stroke();
			context.save();
			context.font = params.myYearFont;
			context.fillStyle = params.grey[3];
			context.fillText(params.currentYear, yearPos.topx+yearPos.sizex, yearPos.topy-(yearPos.sizey*4/2));
			context.restore();
		}
	});
	squareLayer.add(blockYear);

	// month tags
	for(var i = 0; i < 12; i++)
	{(function(){
		var num = i;
		var monthPos = calculateSquareBlockPosition(num+1, 0, 0, true);
		var blockMonth = new Kinetic.Shape(
		{
			drawFunc: function()
			{
				var context = this.getContext();		
				// context.fillStyle = params.grey[0];
				context.strokeStyle = params.grey[1];
				context.lineWidth = 2;
				context.beginPath();
				// context.rect(monthPos.topx, monthPos.topy, monthPos.sizex, monthPos.sizey/3*2);	
				context.strokeRect(monthPos.topx, monthPos.topy, monthPos.sizex*7, monthPos.sizey*9);	
				for(var j = 0; j < 7; j++)
					context.rect(monthPos.topx+(monthPos.sizex*j), monthPos.topy+(monthPos.sizey*2), monthPos.sizex, monthPos.sizey);
				context.closePath();
				// context.fill();
				context.stroke();
				context.save();
				context.font = params.myFont;
				context.fillStyle = params.grey[4];
				context.fillText(params.monthName[num], monthPos.topx+monthPos.sizex, monthPos.topy+(monthPos.sizey*3/2));
				context.font = params.myCalendarFont;
				context.fillStyle = params.grey[3];
				for(var j = 0; j < 7; j++)
					context.fillText(params.dayNameShort[j], monthPos.topx+(monthPos.sizex*j)+(monthPos.sizex/4), monthPos.topy+(monthPos.sizey*2)+(monthPos.sizey/3*2));
				context.restore();
			}
		});
		squareLayer.add(blockMonth);
	}());}
	
	// dates tags	
	var year = params.currentYear;
	var dataindex = data["index"][year];
	var datadata = data["data"];
	var startid = dataindex[1];
	var endid = data["index"][year+1][1];

	for(var i = startid; i < endid; i++)
	{(function(){
		var info = datadata[i];
		var month = info["m"];
		var date = info["d"];
        var day = info["wd"];
		var week = info["wn"]-datadata[dataindex[month]]["wn"];
		var holiday = info["h"];
		
		var thisbgcolor = params.grey[1];
		var positions = calculateSquareBlockPosition(month, day, week, false);
		var blockDay = new Kinetic.Shape(
		{
			drawFunc: function()
			{
				var context = this.getContext();
				// context.globalAlpha = this.alpha;
				// context.fillStyle = params.colors[6+month];
				context.fillStyle = this.mycolor;
				// context.strokeStyle = params.colors[5];
				if(holiday != null)
					context.strokeStyle = params.colors[0];
				context.lineWidth = 2;
				context.beginPath();
				context.rect(positions.topx, positions.topy, positions.sizex, positions.sizey);	
				context.closePath();
				context.fill();
				if(holiday != null)
					context.stroke();
				context.save();
				context.font = params.myCalendarFont;
				// context.fillStyle = params.colors[0];
				context.fillStyle = textColor(this.mycolor);
				context.fillText(date, positions.topx+(positions.sizex/3), positions.topy+(positions.sizey/3*2));
				context.restore();
			}
		});
		// blockDay.alpha = 1.0;
		blockDay.mycolor = thisbgcolor;
		squareLayer.add(blockDay);
		
		if(holiday != null)
		{
			// blockDay.alpha = 0.8;
			blockDay.on("mouseover", function()
			{
				// this.alpha = 1.0;
				tooltip.text1 = params.dayName[day]+" "+date+ " " +params.monthName[(month+11)%12]+" "+year;
				tooltip.text2 = "Holiday : "+ holiday;
				tooltip.text3 = "Calendar : "+ "Gregorian";//calendarType;
				tooltip.show();
				blockDay.mycolor = "#f00";
				squareLayer.draw();
			});
			blockDay.on("mouseout", function()
			{
				// this.alpha = 0.8;
				tooltip.hide();
				blockDay.mycolor = thisbgcolor;
				squareLayer.draw();
			});
		}
	}());}
	
//	return squareLayer;
}

function calculateSquareBlockPosition(thisMonth, dayInWeek, weekInMonth, head)
{
	var monthgroup = params.smonthgroup;
	var blockX = params.sblockX;
	var blockY = params.sblockY;
	
	var monthX = (thisMonth-1)%monthgroup;
	var monthY = Math.floor((thisMonth-1)/monthgroup);
	
	var oneMonthX = blockX*8;
	var oneMonthY = blockY*10;
	var startX = bsize+(blockX*2)+(oneMonthX*monthX);
	var startY = (blockY*6)+(oneMonthY*monthY);
	var headY = blockY*3;
	var topX = startX+(blockX*dayInWeek);
	var topY = startY+headY+(blockY*weekInMonth);	
	var sizeX = blockX;
	var sizeY = blockY;
	
	if(head == true)
	{
		topY = topY-headY;
    	// sizeX = blockX*7;
    	// sizeY = blockY*3;
	}
	
    return {
    	topx: topX,
    	topy: topY,
    	sizex: sizeX,
    	sizey: sizeY
    };
}