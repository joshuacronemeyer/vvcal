google.load("gdata", "1");
google.setOnLoadCallback(init);

var FEED = 'http://www.google.com/calendar/feeds/';

var myService;

function init() 
{
	google.gdata.client.init(handleError);
	var token = google.accounts.user.checkLogin(FEED);
	myService = new google.gdata.calendar.CalendarService("Village Volunteer Calendar");
	
	//if (token) { getEvents(); }
}

function login() 
{
	var token = google.accounts.user.login(FEED);
};

function logout()
{
	google.accounts.user.logout();
	init();
};

function getEvents() 
{
	myService.getCalendarsFeed('http://www.google.com/calendar/feeds/default/owncalendars/full', handleCalendarFeed, handleError);
};

function handleCalendarFeed(feedRoot)
{
  	calendars = feedRoot.feed.getEntries();

    for(i = 0; i < calendars.length; i++)
  	{
		document.write(calendars[i].getLink().getHref() + "<br />");
  		myService.getEventsFeed(calendars[i].getLink().getHref(), handleEventFeed, handleError);
  	}
};

function handleEventFeed(feedRoot) 
{
	var entries = feedRoot.feed.getEntries();
	
	for (i = 0; i < entries.length; i++) 
	{
		document.write(entries[i].getTitle().getText() + "<br />");
	}
};

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