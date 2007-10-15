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

function handleAllCalendarsForVillages(feedRoot) {
  /* reset village itinerary info on page */
  var calendars = feedRoot.feed.getEntries();

  /* loop through each calendar in the feed */
  for (var i = 0; i < calendars.length; i++) {
    var calendar = calendars[i];
    
    var villageElement = document.createElement('p');
    villageElement.setAttribute('id', calendar.getTitle().getText());
    document.getElementById('villageItinerary').appendChild(villageElement);
    var villageTitle = document.createElement('u');
    villageTitle.appendChild(document.createTextNode(calendar.getTitle().getText()));
    villageElement.appendChild(villageTitle);
    myService.getEventsFeed(calendar.getLink().getHref(), handleVillageItinerary, handleError);
  }
  
};

function handleVillageItinerary(feedRoot) {
  var calendarId = feedRoot.feed.getTitle().getText();
  var entries = feedRoot.feed.getEntries();
  var foundMatchingEntries = false;
  
  var entryListElement = document.createElement('ul');
  document.getElementById(calendarId).appendChild(entryListElement);
  for (var i = 0; i < entries.length; i++) {
    var entry = entries[i];
    var times = entry.getTimes();
    if (times.length > 0) {
      var entryStartDate = times[0].getStartTime().getDate();
      var entryEndDate = times[0].getEndTime().getDate();
      if (entryStartDate < endSelectedDate && entryEndDate > beginSelectedDate) {
        foundMatchingEntries = true;
        entryListElement.appendChild(createListElementWithText(entry.getTitle().getText()));
      }
    }
  }
  if (foundMatchingEntries == false) {
        var entryElement = document.createElement('i');
        entryElement.innerHTML = msgNoVolunteers;
        document.getElementById(calendarId).appendChild(entryElement);
  }
};

function refreshVillageItinerary(selectedDate) {
  /* set global variables beginSelectedDate and endSelectedDate - need them when examining the feed */
  beginSelectedDate = new Date(selectedDate);
  endSelectedDate = new Date(selectedDate);
  endSelectedDate.setDate(endSelectedDate.getDate() + 1);
  
  myService.getAllCalendarsFeed(FEED, handleAllCalendarsForVillages, handleError);
};

function createListElementWithText(input)
{
	var result = document.createElement('li');
	result.innerHTML = input;
	return result;
};
