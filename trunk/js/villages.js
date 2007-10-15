google.load("gdata", "1");
google.setOnLoadCallback(init);

var SCOPE = 'http://www.google.com/calendar/feeds/';
var FEED = 'http://www.google.com/calendar/feeds/default/owncalendars/full';

var myService;

/* Variables for the Villages tab. */
var villageInfoString = "";
var msgNoVolunteers = "No volunteers scheduled for this village.";
var beginSelectedDate;
var endSelectedDate;

function init() 
{
	google.gdata.client.init(handleError);
	var token = google.accounts.user.checkLogin(SCOPE);
	myService = new google.gdata.calendar.CalendarService("Village Volunteer Calendar");
	
	// temp until we get a login button
	//var token = google.accounts.user.login(SCOPE);
	
	if (token) { refreshVillageItinerary(Today); }
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

function handleEventFeed(feedRoot) 
{
	entries = feedRoot.feed.getEntries();
	
	for (i = 0; i < entries.length; i++) 
	{
		document.getElementById('divEvents').firstChild.nodeValue += (entries[i].getTitle().getText() + " ");
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

function handleAllCalendarsForVillages(feedRoot)
{
	/* reset village itinerary info on page */
	removeAllChildNodesFrom(document.getElementById('villageItinerary'));
	
	/* loop through each calendar in the feed */
	var calendars = feedRoot.feed.getEntries();
	for (var i = 0; i < calendars.length; i++) {
		var calendar = calendars[i];
		var calendarTitle = calendar.getTitle().getText();
		
		/* write calendar title to screen */
		var villageElement = document.createElement('p');
		villageElement.setAttribute('id', calendarTitle);
		villageElement.appendChild(createElementWithText('u', calendarTitle));
		villageElement.appendChild(document.createElement('br'));
		document.getElementById('villageItinerary').appendChild(villageElement);

		myService.getEventsFeed(calendar.getLink().getHref(), handleVillageItinerary, handleError);
	}
};

function dummyFunction(feedRoot) {};

function handleVillageItinerary(feedRoot)
{
	var calendarId = feedRoot.feed.getTitle().getText();
	var entries = feedRoot.feed.getEntries();
	var foundMatchingEntries = false;
	var countMatchingEntries = 0;
	
	var entryListElement = document.createElement('ul');
	entryListElement.setAttribute('class', 'volunteerList');
	for (var i = 0; i < entries.length; i++) {
		var entry = entries[i];
		var times = entry.getTimes();
		if (times.length > 0) {
			var entryStartDate = times[0].getStartTime().getDate();
			var entryEndDate = times[0].getEndTime().getDate();
			if (entryStartDate < endSelectedDate && entryEndDate > beginSelectedDate) {
				foundMatchingEntries = true;
				entryListElement.appendChild(createElementWithText('li', entry.getTitle().getText()));
				countMatchingEntries++;
			}
		}
	}
	
	if (entryListElement.hasChildNodes() == false) {
		entryListElement = createElementWithText('i', msgNoVolunteers);
	}

	availability = document.getElementById(calendarId).firstChild.innerHTML.replace(/(\d+)/, countMatchingEntries + " out of $1");
	document.getElementById(calendarId).firstChild.innerHTML = availability;
		
	document.getElementById(calendarId).appendChild(entryListElement);
};

function refreshVillageItinerary(selectedDate) {
  /* set global variables beginSelectedDate and endSelectedDate - need them when examining the feed */
  beginSelectedDate = new Date(selectedDate);
  endSelectedDate = new Date(selectedDate);
  endSelectedDate.setDate(endSelectedDate.getDate() + 1);
  
  myService.getAllCalendarsFeed(FEED, handleAllCalendarsForVillages, handleError);
};

function createElementWithText(elementType, input)
{
	var result = document.createElement(elementType);
	result.innerHTML = input;
	return result;
};

function createDivWithClassAndText(divClass, input)
{
	var result = document.createElement('div');
	result.setAttribute('class', divClass);
	result.innerHTML = input;
	return result;
};

function removeAllChildNodesFrom(element)
{
	if (element.hasChildNodes()) {
		while (element.childNodes.length > 0 ) {
			element.removeChild(element.firstChild );
		}
	}
};