google.load("gdata", "1");

var SCOPE = 'http://www.google.com/calendar/feeds/';
var FEED = 'http://www.google.com/calendar/feeds/default/allcalendars/full';

var myService;
var volunteerList = new Array();
volunteerList[0] = new volunteer("Select", "One", "Volunteer not selected", "Volunteer not selected");
volunteerList[1] = new volunteer("Holly", "Bowen", "hbowen@thoughtworks.com", "555-111-1111");
volunteerList[2] = new volunteer("Jeremy", "Stitz", "jstitz@thoughtworks.com", "555-222-2222");
volunteerList[3] = new volunteer("Jimmy", "Staggs", "jstaggs@thoughtworks.com", "555-333-3333");


volunteerCounter = 1;

function initVolunteers() 
{
	google.gdata.client.init(handleError);
	var token = google.accounts.user.checkLogin(SCOPE);
	myService = new google.gdata.calendar.CalendarService("Village Volunteer Calendar");
	
	if (token) { refreshVillageItinerary(); }
	
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
}


function volunteer(firstName, lastName, email, phone) 
{
	this.firstName 	= firstName;
	this.lastName = lastName;
	this.email = email;
	this.phone = phone;
}

function refreshVillageItinerary() {


	myService.getAllCalendarsFeed(FEED, handleAllCalendarsForVillages, handleError);
};

function handleAllCalendarsForVillages(feedRoot)
{
	removeAllChildNodesFrom(document.getElementById('volunteers'));

	/* loop through each calendar in the feed */
	var calendars = feedRoot.feed.getEntries();
	for (var i = 0; i < calendars.length; i++) {
		var calendar = calendars[i];
		if (!calendar.getSelected().getValue()) { continue; }
		
		myService.getEventsFeed(calendar.getLink().getHref(), getVolunteerList, handleError);
	}
};

function getVolunteerList(feedRoot)
{
	var entries = feedRoot.feed.getEntries();
	var volunteerBox = document.getElementById('volunteers');
	
	for (var i = 0; i < entries.length; i++) {
		var entry = entries[i];
		var fullName = entry.getTitle().getText();
		if (!isDuplicated(fullName)){
			option = document.createElement('option');
			option.setAttribute('value', fullName);
			option.innerHTML = fullName;
			volunteerBox.appendChild(option);		
		}
	}
};

function isDuplicated(fullName){
	currentList = document.getElementsByTagName("option")

	for (var j = 0; j < currentList.length; j++){
		currentName = currentList.item(j).getAttribute("value");
		if (currentName == fullName)
			return true;
	}
	return false;
}

function displayInfo(index)
{
	displayContactInfo(index);
	displayItinerary(index);
}

function displayContactInfo(index)
{	
	volunteerSelected = getVolunteerInfo(index);
	contactInfo = "<u><b>Contact Information</b></u><br>";
	contactInfo += "Email: " + volunteerSelected.email + "<br>";
	contactInfo += "Phone: " + volunteerSelected.phone + "<br>";
	
	document.getElementById('info').innerHTML = contactInfo;
}

function displayItinerary()
{
	itineraryInfo = "<u><b>Itinerary Information</b></u><br>";
		
	document.getElementById('itinerary').innerHTML = itineraryInfo;
}

function getVolunteerInfo(fullName){
	for (var i = 0; i < volunteerList.length; i++) {
		if (fullName == volunteerList[i].firstName + " " + volunteerList[i].lastName)
			return volunteerList[i];
	}
	return new volunteer("","","Not found", "Not found");
}


function removeAllChildNodesFrom(element)
{
	if (element.hasChildNodes()) {
		while (element.childNodes.length > 0 ) {
			element.removeChild(element.firstChild );
		}
	}
};
