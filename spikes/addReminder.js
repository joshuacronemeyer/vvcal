
/*
This spike came from villages.js and it was attempting to add a reminder when a volunteer leaves a village.


absoluteTime would seem to work better than days, but it is not supported:
http://groups.google.com/group/google-calendar-help-dataapi/browse_thread/thread/37a823a606d0248c/7ea039b49a5b840b?lnk=gst&q=absoluteTime#7ea039b49a5b840b
*/

// This would go in handleVillageItinerary as names are being added to the list
setAlert(entry, Math.round((entryEndDate - entryStartDate)/(1000*60*60*24)));

function setAlert(entry, daysVisiting)
{
	foundLeaveReminder = false;
	reminders = entry.getReminders();
	for (i = 0; i < reminders.length; i++)
	{
		days = reminders[i].getDays();
		if (days == daysVisiting) { foundLeaveReminder = true; }
	}
	
	if (!foundLeaveReminder)
	{
		//daysVisiting = negative that matches a google time increment
		reminder = new google.gdata.Reminder({days:daysVisiting, method:"email"});
		entry.addReminder(reminder);
		myService.updateEntry(entry.getEditLink().getHref(), entry, handleSetAlert, handleError);
	}
};

function handleSetAlert(entryRoot) {};