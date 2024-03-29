google.load("gdata", "1");

var SCOPE = 'http://www.google.com/calendar/feeds/';
var FEED = 'http://www.google.com/calendar/feeds/default/allcalendars/full';

var myService;

/* Variables for the Villages tab. */
var villageInfoString = "";
var msgNoVolunteers = "No volunteers scheduled for this village.";
var beginSelectedDate;
var endSelectedDate;
var boolIsSingleDay;

function toggleDateType()
{
	document.getElementById('endDateRow').style.display = (isSingleDay() == true) ? 'none' : '';
	document.getElementById('firstDateLabel').innerHTML = (isSingleDay() == true) ? 'Date:' : 'From:';
};

function initVillages() 
{
	google.gdata.client.init(handleError);
	var token = google.accounts.user.checkLogin(SCOPE);
	myService = new google.gdata.calendar.CalendarService("Village Volunteer Calendar");
	
	if (token) { 
		var startDate = startDate_Object.picked.date;
		var endDate = deriveEndDate();
		if (dateRangeIsValid(startDate, endDate) == true) { refreshVillageItinerary(startDate, endDate); }
		else { alert("Date range is invalid. Please ensure that the start date precedes the end date."); }
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

function isSingleDay()
{
	return document.dateForm.dateType[0].checked;
};

function deriveEndDate()
{
	var result = (isSingleDay() == true) ? new Date(startDate_Object.picked.date) : new Date(endDate_Object.picked.date);
	result.setDate(result.getDate() + 1);
	return result;
};

function dateRangeIsValid(firstDate, secondDate)
{
	return (secondDate > firstDate) ? true : false;
};

function refreshVillageItinerary(startDate, endDate)
{
	/* set global variables for start/end dates and date inquiry type - need them when examining the feed */
	beginSelectedDate = startDate;
	endSelectedDate = endDate;
	boolIsSingleDay = (isSingleDay() == true) ? true : false;
	
	myService.getAllCalendarsFeed(FEED, handleAllCalendarsForVillages, handleError);
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

		if (!calendar.getSelected().getValue()) { continue; }
		
		/* write calendar title to screen */
		var villageElement = document.createElement('p');
		villageElement.setAttribute('id', calendarTitle);
		villageElement.appendChild(createElementWithText('u', calendarTitle));
		villageElement.appendChild(document.createElement('br'));
		addSortedNodeToElement(document.getElementById('villageItinerary'), villageElement, true);
		
		/* construct date range query for calendar */
		var villageQuery = new google.gdata.calendar.CalendarEventQuery(calendar.getLink().getHref());
		villageQuery.setMinimumStartTime(new google.gdata.DateTime(beginSelectedDate, true));
		villageQuery.setMaximumStartTime(new google.gdata.DateTime(endSelectedDate, true));
		villageQuery.setSingleEvents(true);
		villageQuery.setMaxResults(1000);
		myService.getEventsFeed(villageQuery, handleVillageItinerary, handleError);
	}
};

function handleVillageItinerary(feedRoot)
{
	var calendarId = feedRoot.feed.getTitle().getText();
	var entries = feedRoot.feed.getEntries();
	var entryCountPerDay = initializeEntryCountArray();
	
	var entryListElement = document.createElement('ul');
	entryListElement.setAttribute('class', 'volunteerList');
	for (var i = 0; i < entries.length; i++) {
		var entry = entries[i];
		var times = entry.getTimes();
		if (times.length > 0) {
			addSortedNodeToElement(entryListElement, createElementWithText('li', entry.getTitle().getText()), false);
			updateEntryCountPerDay(entryCountPerDay, times[0].getStartTime().getDate(), times[0].getEndTime().getDate());
		}
	}
	
	if (entryListElement.hasChildNodes() == false) {
		entryListElement = createElementWithText('i', msgNoVolunteers);
	}

	/* assumes village name is in <u> element that is first child of <p> with the calendarId id */
	var maxStrMsg = (boolIsSingleDay == true) ? '' : 'maximum: ';
	availability = document.getElementById(calendarId).firstChild.innerHTML.replace(/(\d+) Beds/i, maxStrMsg + getMaxOccupancy(entryCountPerDay) + " out of $1 Beds");
	document.getElementById(calendarId).firstChild.innerHTML = availability;
		
	document.getElementById(calendarId).appendChild(entryListElement);
};


/**********************************************************/
/* Utility functions                                      */
/**********************************************************/

function initializeEntryCountArray()
{
	var msPerDay = 24*60*60*1000;
	var numberOfDays = (endSelectedDate.getTime() - beginSelectedDate.getTime()) / msPerDay;

	var result = new Array();
	for (var i = 0; i < numberOfDays; i++) { 
		result.push(0);
	}
	return result;
};

function updateEntryCountPerDay(entryArray, entryStartDate, entryEndDate)
{
	var msPerDay = 24*60*60*1000;
	var dayStartTime = beginSelectedDate.getTime();
	for (var i = 0; i < entryArray.length; i++) {
		if (entryStartDate.getTime() < (dayStartTime + msPerDay) && entryEndDate.getTime() > dayStartTime) {
			entryArray[i] ++;
		}
		dayStartTime += msPerDay;
	}
};

function getMaxOccupancy(entryArray)
{
	var result = 0;
	for (var i = 0; i < entryArray.length; i++) {
		result = Math.max(result, entryArray[i]);
	}
	return result;
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
};
