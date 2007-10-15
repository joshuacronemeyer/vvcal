google.load("gdata", "1");
google.setOnLoadCallback(init);

var SCOPE = "http://www.google.com/calendar/feeds";
var FEED = 'http://www.google.com/calendar/feeds/default/owncalendars/full';

var myService;
var myEventsFeed;
var myCalendarsFeed;

var PUBLIC = "public";
var PRIVATE = "private";
var feedUrl;

var num = 3;

function init() {
  google.gdata.client.init(handleError);

  var token = google.accounts.user.checkLogin(FEED);

  myService = new google.gdata.calendar.CalendarService("VillageVolunteersCalendar");
}

function login() {
  var token = google.accounts.user.login(FEED);
}


function getInfo() {
  myService.getCalendarsFeed(FEED, handleCalendarsFeed, handleError);
}

function handleCalendarsFeed(myCalendarsRoot) {
  myCalendarsFeed = myCalendarsRoot.feed;

  calendars = myCalendarsFeed.getEntries();
  
  for(var i = 0; i < calendars.length; i++) {  
    feedUrl = calendars[i].getLink().getHref().replace(PRIVATE, PUBLIC);  
    
    myService.getEventsFeed(feedUrl, handleEventsFeed, handleError);
  }
}

function handleEventsFeed(myEventsRoot) {
  myEventsFeed = myEventsRoot.feed;
  
  events = myEventsFeed.getEntries();

  for(var j = 0; j < events.length; j++) {
      document.getElementById('divEvents').firstChild.nodeValue += (events[j].getTitle().getText() + " ");
  }
}

function handleError(e) {
  if (e instanceof Error) {

    alert('Error at line ' + e.lineNumber + ' in ' + e.fileName + '\n' + 'Message: ' + e.message);

    if (e.cause) {
      var errorStatus = e.cause.status;
      var statusText = e.cause.statusText;

      alert('Root cause: HTTP error ' + errorStatus + ' with status text of: ' + statusText);
    }
  } else {
    alert(e.toString());
  }
}