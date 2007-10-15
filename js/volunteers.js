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
		document.getElementById('divEvents').firstChild.nodeValue += (entries[i].getTitle().getText() + " ");
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