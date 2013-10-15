var params;

function init()
{
	var data = getBrowserSize();

	data.monthName = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");
	data.monthNameShort = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");
    data.dayName = new Array("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday");
	data.dayNameShort = new Array("Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat");
	data.grey = new Array(	"#000", // 0 black
							"#333", 
							"#666",
							"#999",
							"#CCC",
							"#fff"  // 5 white
							);
	data.colors = new Array("#ff0000", // 0 red
							"#FFFF99", // 1 yellow
							"#CCFFFF", // 2 light blue
							"#FF9999", // 3 rose pink
							"#CCCC99", // 4 light green sand
							"#9933FF", // 5 purple
							"#666633", // 6 dark green
							"#6699FF", // 7 dark blue
							"#9933CC", // 8 purple
							"#FF9900", // 9 orange
							"#FF33CC", // 10 pink
							"#CCFF99", // 11 light green
							"#CC99FF" // 12 
							);

	data.screenWidth = data.screenWidth*0.98;
	data.screenHeight = data.screenHeight*0.98;
	data.screenSize = getScreenSmallerSize(data.screenWidth, data.screenHeight);
    var buttnum = 50*10;
    if(data.screenSize < buttnum)
    {
        data.screenHeight = buttnum;
        data.screenSize = buttnum;
    }

    data.buttonSize = data.screenSize/15;//50;
    data.bsize = data.buttonSize*3;

	// circle
	data.lineWidth = 2;
    data.cr = (data.screenSize/7*3)-data.lineWidth-1;;
    data.cangle = Math.PI;
    data.cshellsDist = 5; // make the circle blocks further from center
    data.cshells = 12+data.cshellsDist; // 3:sol, 4-10:days, 11:month, 12:moon
 
    data.ctooltipX = data.screenSize+data.bsize;
    data.ctooltipY = (data.screenSize/5);        
	//-----
	
	// square
	data.stooltipX = (data.screenWidth/5)*4;
    data.stooltipY = 120;
    
    data.smonthgroup = 4;
	data.stotalBlockX = (2+(8*data.smonthgroup));
	var totalBlockY = (6+(10*(data.smonthgroup-1)));
	data.sblockX = data.stooltipX/data.stotalBlockX;
	data.sblockY = data.screenHeight/totalBlockY;
	//-----
	
	data.myFontFamily = "Calibri";
	data.myFont = "12pt "+data.myFontFamily;
    data.myCalendarFont = (data.sblockX/4)+"pt "+data.myFontFamily;
    data.myCircleCalendarFont = (data.cr/data.cshells)/3+"pt "+data.myFontFamily;
    data.myYearFont = (data.sblockX/2)+"pt "+data.myFontFamily;
	
	data.currentYear = 2012;//new Date().getFullYear();
	// console.log("current year = "+data.currentYear);

    moonImages = [];

    for (var x=0; x< 8; x++)
    {
        var i = new Image();
        i.src = "img/m"+x+".gif";
        moonImages.push(i);
    }

	params = data;
}

function getBrowserSize()
{
	var screenWidth = 0;
	var screenHeight = 0;

	//Non-IE 
	if( typeof( window.innerWidth ) == 'number' ) 
	{ 
		screenWidth = window.innerWidth;
		screenHeight = window.innerHeight; 
	} 
	//IE 6+
	else if( document.documentElement && 
		( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) 
	{ 
		screenWidth = document.documentElement.clientWidth; 
		screenHeight = document.documentElement.clientHeight; 	
	} 
	//IE 4 compatible 
	else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) 
	{ 
		screenWidth = document.body.clientWidth; 
		screenHeight = document.body.clientHeight; 	
	}
	
	// console.log("screen size: width = "+screenWidth+", height = "+screenHeight);
	return {
		screenWidth: screenWidth,
		screenHeight: screenHeight
	}
}

function getScreenSmallerSize(screenWidth, screenHeight)
{
	if(screenWidth < screenHeight)
		return screenWidth;
	else
		return screenHeight;
}
function getScreenBiggerSize(screenWidth, screenHeight)
{
    if(screenWidth > screenHeight)
        return screenWidth;
    else
        return screenHeight;
}

function textColor(bgColor)
{
	var white = "#ffffff";
	var black = "#000000";

	var red = parseInt(bgColor.substring(1,3), 16);
	var green = parseInt(bgColor.substring(3,5), 16);
	var blue = parseInt(bgColor.substring(5,7), 16);
	
	var mid = 128;
	
	if(green < mid)
		return white;
		
	return black;
}