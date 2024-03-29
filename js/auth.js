google.load("gdata", "1");
google.setOnLoadCallback(init);

var SCOPE = 'http://www.google.com/calendar/feeds/';
var FEED  = 'http://www.google.com/calendar/feeds/default/allcalendars/full';

var myService;
var myToken;

function init() 
{	
	google.gdata.client.init(handleError);
	
	myToken = google.accounts.user.checkLogin(SCOPE);
	
	checkUserStatus();
	
	myService = new google.gdata.calendar.CalendarService("Village Volunteer Calendar");
};

function login() 
{
	myToken = google.accounts.user.login(SCOPE);
};

function logout()
{
	google.accounts.user.logout();
	
	window.location = "index.html";
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

function checkUserStatus()
{
	frameThoughtWorks = document.getElementById('thoughtworks');
	frameCalendar = document.getElementById('calendar');
	linkInOut = document.getElementById('inout');
	
	if(myToken)
	{	
		frameThoughtWorks.style.visibility = 'visible';
		frameCalendar.style.visibility = 'visible';
		
		linkInOut.innerHTML = 'Click Here to Logout';
	}
	else
	{	
		frameThoughtWorks.style.visibility = 'hidden';
		frameCalendar.style.visibility = 'hidden';
		
		linkInOut.innerHTML = 'Click Here to Login';
	}	
};

function inout()
{
	if(myToken)
		logout();
	else
		login();
};