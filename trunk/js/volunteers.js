var SCOPE = 'http://www.google.com/calendar/feeds/';
var FEED = 'http://www.google.com/calendar/feeds/default/owncalendars/full';
var volunteer_list = new Array();

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


function volunteer(firstName, lastName, email, phone) {
	this.firstName 	= firstName;
	this.lastName = lastName;
	this.email = email;
	this.phone = phone;
}
	var SelectOne = new volunteer("Select", "One", "Volunteer not selected", "Volunteer not selected");
	var Jimmy = new volunteer("Jimmy", "Staggs", "jimmy@tw.com", "555-555-5555");
	var Jeremy = new volunteer("Jeremy", "Stitz", "jeremy@tw.com", "555-555-2222");
	var Holly = new volunteer("Holly", "Bowen", "holly@tw.com", "555-555-1111");
	var volunteer_list = new Array();
	volunteer_list[0] = SelectOne;
	volunteer_list[1] = Jimmy;
	volunteer_list[2] = Jeremy;
	volunteer_list[3] = Holly;
	
function displaydropdown()
{
	var comboBox;
	comboBox = "<select name='volunteers' onChange='displayInfo(this.options[this.selectedIndex].value)'>";
	for (i=0;i<volunteer_list.length;i++)
	{
	if (i==0)
		comboBox += "<option value='" + i +"' selected='yes'>" + volunteer_list[i].firstName + " " + volunteer_list[i].lastName + "</option>";
	else
		comboBox +="<option value='" + i +"'>" + volunteer_list[i].firstName + " " + volunteer_list[i].lastName + "</option>";
	}
	comboBox += "</select>";
	document.getElementById("combo").innerHTML = comboBox;
	

}

function displayInfo(objval)
{
	var contactInfo;
	contactInfo = "<u><strong>Contact Information</strong></u><br>";
	contactInfo += "Email: " + volunteer_list[objval].email + "<br>";
	contactInfo += "Phone: " + volunteer_list[objval].phone + "<br>";
	document.getElementById("info").innerHTML=contactInfo;
}
