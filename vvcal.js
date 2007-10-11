http://www.google.com/jsapi?key=ABQIAAAADRnyuq2mdBHBb4iDhmtuZBQM-KuWdanIH38iecu_8v3ev4H-ExS0xaUAQQ_5vEh_jAbxnNm5CqTd2Q
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


function insertIntoMyFeed(feedRoot) {
  var newEntry = new google.gdata.calendar.CalendarEventEntry({
    authors: [
      {
        name: "Elizabeth Bennet",
        email: "liz@gmail.com"
      }
    ],
    title: {type: 'text', text: 'Tennis with Darcy'},
    content: {type: 'text', text: 'Meet for a quick lesson'},
    locations: [
      {
        rel: "g.event",
        label: "Event location",
        valueString: "Netherfield Park tennis court"
      }
    ],
    times: [
      {
        startTime:
          google.gdata.DateTime.fromIso8601("2007-09-23T18:00:00.000Z"),
        endTime:
          google.gdata.DateTime.fromIso8601("2007-09-23T19:00:00.000Z")
      }
    ]
    }
  );
  feedRoot.feed.insertEntry(newEntry, handleMyInsertedEntry, handleError);
}


function handleError(e) {
  alert("There was an error!");
  alert(e.cause ? e.cause.statusText : e.message);
}

function logMeOut() {
  google.accounts.user.logout();
}