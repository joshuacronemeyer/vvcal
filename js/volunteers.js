google.load("gdata", "1");
google.setOnLoadCallback(init);

var SCOPE = 'http://www.google.com/calendar/feeds/';
var FEED = 'http://www.google.com/calendar/feeds/default/owncalendars/full';

var myService;

function init() 
{
	google.gdata.client.init(handleError);
	var token = google.accounts.user.checkLogin(SCOPE);
	myService = new google.gdata.calendar.CalendarService("Village Volunteer Calendar");
	
	if (token) { getEvents(); }
};

function login() 
{
	var token = google.accounts.user.login(SCOPE);
};

function logout()
{
	google.accounts.user.logout();
	
	init();
};

function getEvents() 
{
	myService.getCalendarsFeed(FEED, handleCalendarFeed, handleError);
};

function handleCalendarFeed(feedRoot)
{
  	calendars = feedRoot.feed.getEntries();

  	for(i = 0; i < calendars.length; i++)
  	{
	  	entryUrl = calendars[i].getLink().getHref();
		myService.getEventsFeed(entryUrl, handleEventFeed, handleError);
  	}
};

/*
function handleEventFeed(feedRoot) 
{
	entries = feedRoot.feed.getEntries();
	
	for (i = 0; i < entries.length; i++) 
	{
		document.getElementById('divEvents').firstChild.nodeValue += " ";
	}
};
*/

function handleError(e) 
{
	if (e instanceof Error) 
	{
		alert('Error at line ' + e.lineNumber + ' in ' + e.fileName + '\n' + 'Message: ' + e.message);
		if (e.cause) 
		{
	  		var errorStatus = e.cause.status;
	  		var statusText = e.cause.statusText;
	  		alert('Root cause: HTTP error ' + errorStatus + ' with status text of: ' + statusText);
		}
	} 
	else 
	{
		alert(e.toString());
	}
};

function volunteer(firstName, lastName, email, phone) {
	this.firstName 	= firstName;
	this.lastName = lastName;
	this.email = email;
	this.phone = phone;
}

function displayInfo(objval)
{
	var contactInfo;
	contactInfo = "<u><strong>Contact Information</strong></u><br>";
	contactInfo += "Email: " + volunteer_list[objval].email + "<br>";
	contactInfo += "Phone: " + volunteer_list[objval].phone + "<br>";
	document.getElementById("info").innerHTML=contactInfo;
}

function isUserLoggedInt()
{
	return(google.accounts.user.checkLogin(SCOPE));
}
		
var SelectOne = new volunteer("Select", "One", "Volunteer not selected", "Volunteer not selected");
var Jimmy = new volunteer("Jimmy", "Staggs", "jimmy@tw.com", "555-555-5555");
var Jeremy = new volunteer("Jeremy", "Stitz", "jeremy@tw.com", "555-555-2222");
var Holly = new volunteer("Holly", "Bowen", "holly@tw.com", "555-555-1111");
var volunteer_list = new Array();
volunteer_list[0] = SelectOne;
volunteer_list[1] = Jimmy;
volunteer_list[2] = Jeremy;
volunteer_list[3] = Holly;

