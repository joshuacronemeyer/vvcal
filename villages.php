<html>
<head>
<?php include 'includes\googlekey.php'; ?>

<?php

echo "<script type='text/javascript' src='$key'></script>";

?>
	<script type="text/javascript" src="js/villages.js"></script>
	<script type="text/javascript" src="js/calendarDateInput.js">
	/***********************************************
	 * Jason's Date Input Calendar- By Jason Moon http://calendar.moonscript.com/dateinput.cfm
	 * Script featured on and available at http://www.dynamicdrive.com
	 * Keep this notice intact for use.
	 ***********************************************/
	</script>
	<link rel="stylesheet" href="css/style.css" TYPE="text/css" MEDIA="screen">
</head>
<body onload="toggleDateType();">
	<img src="images/pixel.gif" style="position: absolute; top: -10; left: 0;"/>
	<div align="center">
		<form name="dateForm">
			<table><tr>
				<td><input type="radio" name="dateType" value="single" checked="checked" onclick="toggleDateType();"> Single Day</td>
				<td width="15" />
				<td><input type="radio" name="dateType" value="range" onclick="toggleDateType();"> Date Range</td>
			</tr></table>
		</form>
		<div id="datesContainer">
			<table>
				<tr>
					<td id="firstDateLabel" class="dateLabel">Date:</td>
					<td><script>DateInput('startDate', true, 'YYYY-MM-DD')</script></td>
					<td><input type="button" class="dateButton" value="Go" onclick="initVillages();" /></td>
				</tr>
				<tr id="endDateRow">
					<td class="dateLabel">To:</td>
					<td><script>DateInput('endDate', true, 'YYYY-MM-DD')</script></td>
				</tr>
			</table>
		</div>
		<hr width="80%" align="center">
	</div>
	<div id="villageItinerary"></div>
</body>
</html>
