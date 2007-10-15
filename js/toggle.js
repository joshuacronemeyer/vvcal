function showFrame()
{
	var divTabber = self.thoughtworks.document.getElementById('tabber');
	var buttonToggle = document.getElementById('toggle');
	var frameThoughtWorks = document.getElementById('thoughtworks');
	var frameCalendar = document.getElementById('calendar');

	divTabber.style.display = 'block';
	buttonToggle.style.visibility = 'visible';
	frameThoughtWorks.width = '25%';
	frameCalendar.width= '74%';
}

function hideFrame()
{
	var divTabber = document.getElementById('tabber');
	var buttonToggle = document.getElementById('toggle');
	var frameThoughtWorks = parent.document.getElementById('thoughtworks');
	var frameCalendar = parent.document.getElementById('calendar');

	divTabber.style.display = 'none';
	buttonToggle.style.visibility = 'hidden';
	frameThoughtWorks.width = '1%';
	frameCalendar.width = '98%';
}