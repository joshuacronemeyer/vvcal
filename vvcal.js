
//<![CDATA[

google.load("gdata", "1");
google.setOnLoadCallback(dummyGetMyFeed);

var myService;
var feedUrl = "http://www.google.com/calendar/feeds/ctan@thoughtworks.com/public/full";
var eventDiv;
var singleVillageItineraryString = "";
var msgNoVolunteers = "No volunteers scheduled for this village.";
var beginSelectedDate;
var endSelectedDate;

function logMeIn() {
  scope = "http://www.google.com/calendar/feeds";
  var token = google.accounts.user.login(scope);
}

function getMyFeed() {
  myService = new google.gdata.calendar.CalendarService('vvcal');
  logMeIn();
  myService.getEventsFeed(feedUrl, handleMyFeed, handleError);
}

function handleMyFeed() {
}

function dummyGetMyFeed() {
}

function handleError(e) {
	alert(e.cause ? e.cause.statusText : e.message);
}

function logMeOut() {
  google.accounts.user.logout();
}


function handleAllCalendarsForVillages(feedRoot) {
  var calendars = feedRoot.feed.getEntries();

  /* loop through each calendar in the feed */
  for (var i = 0; i < calendars.length; i++) {
    var calendar = calendars[i];
    eventDiv.innerHTML += "<u>" + calendar.getTitle().getText() + "</u><br>";
    singleVillageItineraryString = "";
    myService.getEventsFeed(calendar.getLink().getHref(), handleVillageItinerary, handleError);
    eventDiv.innerHTML += "<br>";
  }
}

function handleVillageItinerary(feedRoot) {
  alert("hi! in handleVillageItinerary!");
  var entries = feedRoot.feed.getEntries();
  var foundMatchingEntries = false;
  for (var i = 0; i < entries.length; i++) {
    var entry = entries[i];
    var times = entry.getTimes();
    if (times.length > 0) {
      var entryStartDate = times[0].getStartTime().getDate();
      var entryEndDate = times[0].getEndTime().getDate();
      if (entryStartDate < endSelectedDate && entryEndDate > beginSelectedDate) {
        foundMatchingEntries = true;
        eventDiv.innerHTML += entry.getTitle().getText() + "<br>";
      }
    }
  }
  if (foundMatchingEntries == false) {
    eventDiv.innerHTML += "<i>" + msgNoVolunteers + "</i><br>";
  }
}

function refreshVillageItinerary(pickedDate) {
  /* set global variables beginSelectedDate and endSelectedDate - need them when examining the feed */
  beginSelectedDate = new Date(pickedDate.date);
  endSelectedDate = new Date(pickedDate.date);
  endSelectedDate.setDate(endSelectedDate.getDate() + 1);
  
  /* reset village itinerary info on page */
  eventDiv = document.getElementById("villageItinerary");
  eventDiv.innerHTML = "";

  /* FIXME: when we can retrieve all calendars, uncomment the following line and comment out the portion below it */
  /* myService.getAllCalendarsFeed(calendarsUrl, handleAllCalendarsForVillages, handleError); */
  
  var tempService = new google.gdata.calendar.CalendarService('vvcal');
  tempService.getEventsFeed(feedUrl, handleVillageItinerary, handleError);
}

//]]>
