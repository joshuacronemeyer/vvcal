google.load("gdata", "1");

var SCOPE = 'http://www.google.com/calendar/feeds/';
var FEED = 'http://www.google.com/calendar/feeds/default/allcalendars/full';

var myService;
var volunteerList = new Array();
var volunteerCounter = 0;
var selectedVolunteerName;

var monthAbbr = initializeMonthArray();

function initVolunteers() 
{
	google.gdata.client.init(handleError);
	var token = google.accounts.user.checkLogin(SCOPE);
	myService = new google.gdata.calendar.CalendarService("Village Volunteer Calendar");

	if (token) { refreshVillageItinerary(); }
	
};


function initService()
{
	var token = google.accounts.user.checkLogin(SCOPE);
	myService = new google.gdata.calendar.CalendarService("Village Volunteer Calendar");

	if (token) { refreshVillageItinerary(); }
}

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


function volunteer(fullName, email, phone) 
{
	this.fullName = fullName;
	this.email = email;
	this.phone = phone;
}

function refreshVillageItinerary() {

	myService.getAllCalendarsFeed(FEED, handleAllCalendarsForVillages, handleError);

};

function handleAllCalendarsForVillages(feedRoot)
{
	removeAllChildNodesFrom(document.getElementById('volunteers'));
	volunteerCounter = 0;

	/* loop through each calendar in the feed */
	var calendars = feedRoot.feed.getEntries();
	
	for (var i = 0; i < calendars.length; i++) 
	{
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
			if (volunteerCounter == 0)
				fullName = " Select One";		
			option = document.createElement('option');
			option.setAttribute('value', fullName);
			option.innerHTML = fullName;
			volunteerBox.appendChild(option);
			addSortedNodeToElement(volunteerBox, option, false);
			volunteerCounter ++;
		}
	}

};

function isDuplicated(fullName){
	currentList = document.getElementsByTagName("option");

	for (var j = 0; j < currentList.length; j++){
		currentName = currentList.item(j).getAttribute("value");
		if (currentName == fullName)
			return true;
	}
	return false;
}

function displayItinerary(volunteerName)
{
	selectedVolunteerName = volunteerName;

	initVolunteers();
	
	/* reset volunteer itinerary info on page */
	removeAllChildNodesFrom(document.getElementById('itineraryTable'));

	/* make itinerary title visible */
	var volunteerItinerary = document.getElementById('itineraryHeader').style.display = 'inline';

	myService.getAllCalendarsFeed(FEED, handleAllCalendarsForSingleVolunteer, handleError);
}

function handleAllCalendarsForSingleVolunteer(feedRoot)
{

	/* loop through each calendar in the feed */
	var calendars = feedRoot.feed.getEntries();
	for (var i = 0; i < calendars.length; i++) {
		var calendar = calendars[i];

		/* construct volunteer name query for calendar */
		var volunteerQuery = new google.gdata.calendar.CalendarEventQuery(calendar.getLink().getHref());
		volunteerQuery.setFullTextQuery(selectedVolunteerName);
		volunteerQuery.setFutureEvents(true);
		volunteerQuery.setSingleEvents(true);
		volunteerQuery.setMaxResults(1000);
		myService.getEventsFeed(volunteerQuery, handleVolunteerItinerary, handleError);
	}
};

function handleVolunteerItinerary(feedRoot)
{
	var calendarId = feedRoot.feed.getTitle().getText();
	var entries = feedRoot.feed.getEntries();
	var entryTableElement = document.getElementById('itineraryTable');
	
	for (var i = 0; i < entries.length; i++) {
		var entry = entries[i];
		var times = entry.getTimes();
		if (times.length > 0) {		
			var entryRowElement = document.createElement('tr');
			
			var calNameElement = createElementWithText('td', calendarId.replace(/ \(\d+ Beds\)/i, ''));
			calNameElement.setAttribute('class', 'leftCol');
			entryRowElement.appendChild(calNameElement);
			
			var startDate = times[0].getStartTime().getDate();
			var endDate = new Date(times[0].getEndTime().getDate().getTime() - 1);
			var dateRangeElement = createElementWithText('td', getDateStringFrom(startDate) + " - " + getDateStringFrom(endDate));
			dateRangeElement.setAttribute('class', 'rightCol');
			entryRowElement.appendChild(dateRangeElement);
			
			entryRowElement.setAttribute('id', times[0].getStartTime().getDate().getTime());
			addSortedNodeToElement(entryTableElement, entryRowElement, true);
		}
	}
};

function getDateStringFrom(date)
{
	var dayString = '' + date.getDate();
	if (dayString.length < 2) dayString = "0" + dayString;
	var result = monthAbbr[date.getMonth()];
	result += " " + dayString;
	result += " " + date.getFullYear();
	return result;
	
};

function getVolunteerInfo(fullName){
	found = 0;
	volunteerfound = new volunteer("", "Not found", "Not found");
	for (var i = 0; i < volunteerList.length; i++) {
		if (fullName == volunteerList[i].fullName)
		{
			found ++;
			volunteerfound = volunteerList[i];
		}
	}
	
	if (found > 1)
		volunteerfound = new volunteer("","Not available due to multiple records", "Not available due to multiple records");
		
	return volunteerfound;

}

function createElementWithText(elementType, input)
{
	var result = document.createElement(elementType);
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
	volunteerCounter = 0;

};

function addSortedNodeToElement(element, childNodeToInsert, doSortById)
{	
	if (element.hasChildNodes() == true) {
		var newId = (doSortById == true) ? childNodeToInsert.getAttribute('id') : childNodeToInsert.innerHTML;
		for (i = 0; i < element.childNodes.length; i++) {
			var childNode = element.childNodes[i];
			var currentId = (doSortById == true) ? childNode.getAttribute('id') : childNode.innerHTML;
			if (newId < currentId) {
				element.insertBefore(childNodeToInsert, childNode);
				return;
			}
		}
	}
	element.appendChild(childNodeToInsert);
};

function initializeMonthArray()
{
	var result = new Array();
	
	result.push('Jan');
	result.push('Feb');
	result.push('Mar');
	result.push('Apr');
	result.push('May');
	result.push('Jun');
	result.push('Jul');
	result.push('Aug');
	result.push('Sep');
	result.push('Oct');
	result.push('Nov');
	result.push('Dec');
	
	return result;
};
