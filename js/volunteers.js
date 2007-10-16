google.load("gdata", "1");

var SCOPE = 'http://www.google.com/calendar/feeds/';
var FEED = 'http://www.google.com/calendar/feeds/default/owncalendars/full';

var myService;
var volunteerList = new Array();

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

var SelectOne = new volunteer("Select", "One", "Volunteer not selected", "Volunteer not selected");
var Jimmy = new volunteer("Jimmy", "Staggs", "jimmy@tw.com", "555-555-5555");
var Jeremy = new volunteer("Jeremy", "Stitz", "jeremy@tw.com", "555-555-2222");
var Holly = new volunteer("Holly", "Bowen", "holly@tw.com", "555-555-1111");
	
volunteerList[0] = SelectOne;
volunteerList[1] = Jimmy;
volunteerList[2] = Jeremy;
volunteerList[3] = Holly;
	
function populateVolunteerList()
{
	comboBox = "<select name='volunteers' id='volunteers' onChange='displayInfo(this.options[this.selectedIndex].value)'>";
	
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
}
