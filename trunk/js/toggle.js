function showFrame()
{
	var divTabber = self.thoughtworks.document.getElementById('tabber');
	var divToggle = self.thoughtworks.document.getElementById('toggle');
	var frameThoughtWorks = document.getElementById('thoughtworks');
	var frameCalendar = document.getElementById('calendar');

	divTabber.style.display = 'block';
	divToggle.style.display = 'block';
	frameThoughtWorks.style.width = '25%';
	frameCalendar.style.width= '74%';
}

function hideFrame()
{
	var divTabber = document.getElementById('tabber');
	var divToggle = document.getElementById('toggle');
	var frameThoughtWorks = parent.document.getElementById('thoughtworks');
	var frameCalendar = parent.document.getElementById('calendar');

	divTabber.style.display = 'none';
	divToggle.style.display = 'none';
	frameThoughtWorks.style.width = '1%';
	frameCalendar.style.width = '98%';
}