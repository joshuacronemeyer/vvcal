var SCOPE = 'http://www.google.com/calendar/feeds/';
var FEED = 'http://www.google.com/calendar/feeds/default/owncalendars/full';

var myService;

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
  removeAllChildNodesFrom(document.getElementById('villageItinerary'));


  var calendars = feedRoot.feed.getEntries();
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

function getVolunteerNames(feedRoot) {
  var volunteer_list = new Array();
  var volunteer_id = 0;

  var calendarId = feedRoot.feed.getTitle().getText();
  var entries = feedRoot.feed.getEntries();
  
  for (var i = 0; i < entries.length; i++) {
    var entry = entries[i];
    var event = entry.getTitle().getText();
    var indexOfHypen = event.indexOf("-");
    
    var fullName = event.substring(0, indexOfHypen);
    
    var indexOfSpace = fullName.indexOf(" ");
    
    var firstName = fullName.substring(0, indexOfSpace);
    var lastName = fullName.substring(indexOfSpace);
    
    var email = firstName +"@thoughtworks.com";
    var phone = "555-5555";
    
    volunteer_list[volunteer_id] = new volunteer(firstName, lastName, email, phone); 
    volunteer_id ++;
  }

};

function getListOfVolunteers() {
	alert("Getting List of Volunteers");

  myService.getAllCalendarsFeed(FEED, handleAllCalendarsForVillages, handleError);
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

