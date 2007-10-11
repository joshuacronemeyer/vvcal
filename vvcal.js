
//<![CDATA[

google.load("gdata", "1");
google.setOnLoadCallback(getMyFeed);

var feedUrl =  "http://www.google.com/calendar/feeds/ctan@thoughtworks.com/private/full";

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

//]]>