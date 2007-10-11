
//<![CDATA[

google.load("gdata", "1");
google.setOnLoadCallback(dummyGetMyFeed);

var myService;
var feedUrl = "http://www.google.com/calendar/feeds/ctan@thoughtworks.com/public/full";
var villageItineraryDiv = "villageItinerary";
var selectedDate;

function logMeIn() {
  scope = "http://www.google.com/calendar/feeds";
  var token = google.accounts.user.login(scope);
}

function setupMyService() {
  var myService =
    new google.gdata.calendar.CalendarService('exampleCo-exampleApp-1');
  logMeIn();
  return myService;
}

function dummyGetMyFeed() {
}

function getMyFeed() {
  myService = setupMyService();
  myService.getEventsFeed(feedUrl, handleMyFeed, handleError);
}

function handleMyFeed(myResultsFeedRoot) {
  alert("This feed's title is: " +
    myResultsFeedRoot.feed.getTitle().getText());
  insertIntoMyFeed(myResultsFeedRoot);
}

function handleError(e) {
  alert("There was an error!");
  alert(e.cause ? e.cause.statusText : e.message);
}

function logMeOut() {
  google.accounts.user.logout();
}

function handleVillageItinerary(feedRoot) {
  var eventDiv = document.getElementById(villageItineraryDiv);
  if (eventDiv.childNodes.length > 0) {
    eventDiv.removeChild(eventDiv.childNodes[0]);
  }	  

  var entries = feedRoot.feed.getEntries();
  /* create a new unordered list */
  var ul = document.createElement('ul');
  /* loop through each event in the feed */
  var len = entries.length;
  for (var i = 0; i < len; i++) {
    var entry = entries[i];
    var times = entry.getTimes();
    if (times.length > 0) {
      var endJSDate = times[0].getEndTime().getDate();
      if (selectedDate < endJSDate) {
        var li = document.createElement('li');
        li.appendChild(document.createTextNode(entry.getTitle().getText()));
        ul.appendChild(li);
      }
    }
  }
  eventDiv.appendChild(ul);
}

function refreshVillageItinerary(pickedDate) {
  /* set global variable selectedDate - need this when examining the feed */
  selectedDate = new Date(pickedDate.date);

  var endDate = new Date(pickedDate.date);
  endDate.setDate(endDate.getDate() + 1);
  var service = new google.gdata.calendar.CalendarService('villageVolunteersCalendar');
  var query = new google.gdata.calendar.CalendarEventQuery(feedUrl);
  query.setMaximumStartTime(google.gdata.DateTime.toIso8601(new google.gdata.DateTime(endDate, true)));
  service.getEventsFeed(query, handleVillageItinerary, handleError);
}

//]]>
