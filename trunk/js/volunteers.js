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
		option = document.createElement('option');
		option.setAttribute('value', fullName);
		option.innerHTML = fullName;
		volunteerBox.appendChild(option);
	}
};


function checkForDuplicates(firstName, lastName){
	for (var j = 0; j < volunteerList.length; j++){
		if (volunteerList[j].firstName = firstName)
			return true;		
	}
	return false;
}
	
function populateVolunteerList()
{
	comboBox = "<b>Please Select A Volunteer:</b><br>";
	comboBox += "";
	
	for (i = 0 ;i<volunteerList.length; i++)
	{
		if (i==0)
			comboBox += "<option value='" + i +"' selected='yes'>" + volunteerList[i].firstName + " " + volunteerList[i].lastName + "</option>";
		else
			comboBox += "<option value='" + i +"'>" + volunteerList[i].firstName + " " + volunteerList[i].lastName + "</option>";
	}
	
	comboBox += "</select>";
	
	document.getElementById('combo').innerHTML = comboBox;
}


function displayInfo(index)
{
	displayContactInfo(index);
	displayItinerary(index);
}

function displayContactInfo(index)
{		
	contactInfo = "<u><b>Contact Information</b></u><br>";
	contactInfo += "Email: " + volunteerList[index].email + "<br>";
	contactInfo += "Phone: " + volunteerList[index].phone + "<br>";
	
	document.getElementById('info').innerHTML = contactInfo;
}

function displayItinerary()
{
	itineraryInfo = "<u><b>Itinerary Information</b></u><br>";
		
	document.getElementById('itinerary').innerHTML = itineraryInfo;
}s