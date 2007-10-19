<html>
<head>
	<script type="text/javascript" src="http://www.google.com/jsapi?key=ABQIAAAAKYmOqEXuSTJLmIQnR5PK0BT2yXp_ZAY8_ufC3CFXhHIE1NvwkxRY1xD4kh0qjbX_xcdZnGjjKoA4cA"></script>
	<script type="text/javascript" src="js/volunteers.js"></script>
	<script type="text/javascript">
	function reload(form)
	{
		volunteersBox = document.getElementById('volunteers');
		val = volunteersBox.options[volunteersBox.options.selectedIndex].value;
		if (val.indexOf(" ") == -1)
		{
			var firstNameVal = val;
			var middleNameVal = "none";
			var lastNameVal = "none";
		}
		else
		{
			var firstNameVal = val.substring(0, val.indexOf(" "));
			var remainingName = val.substring(val.indexOf(" ") + 1);

			if (remainingName.indexOf(" ") == -1)
			{
				var middleNameVal = "none";
				var lastNameVal = remainingName;
			}
			else
			{
				var middleNameVal = remainingName.substring(0, remainingName.indexOf(" "));
				var lastNameVal = remainingName.substring(remainingName.indexOf(" ") + 1);
			}
		}

		self.location="volunteers.php?firstName=" + firstNameVal + "&middleName=" + middleNameVal + "&lastName=" + lastNameVal;
		refreshVillageItinerary();
	}
    </script>
	<link rel="stylesheet" href="css/style.css" TYPE="text/css" MEDIA="screen">
</head>
<body>

	<img src="images/pixel.gif" style="position: absolute; top: -10; left: 0;"/>

<?php include 'dbconfig.php'; ?>

	<div align="center">
		<input type="button" name='volunteerButton' id='volunteerButton' value="List Volunteers" onclick="initVolunteers()" /><br><br>
		<select name='volunteers' id='volunteers' onChange='reload(this.form)'></select>
	</div>
	<hr width="80%" align="center" />
	<div id="info" name="info">

<?php
	$firstName = $_GET['firstName'];
	$middleName = $_GET['middleName'];
	$lastName = $_GET['lastName'];

	if (!empty($firstName)){

		$query="select FirstName, MiddleName, LastName, Email, Phone from people where FirstName='".$firstName."'";
		$fullName = $firstName;

		if (!($middleName == "none")){
			$query = $query." and MiddleName='".$middleName."'";
			$fullName = $fullName." ".$middleName;
		}

		if (!($lastName == "none")){
			$query = $query." and LastName='".$lastName."'";
			$fullName = $fullName." ".$lastName;
		}

		$rt=mysql_query($query);
		echo mysql_error();
		$returned_rows = mysql_num_rows($rt);
		mysql_close($link);

		$msg = "Contact Information for ".$fullName." Not Found";

		if ($returned_rows == 1){
			$nt=mysql_fetch_array($rt);
			$msg = "Name: ".$nt[FirstName]." ".$nt[MiddleName]." ".$nt[LastName]."<br>Email: $nt[Email]<br>Phone: $nt[Phone]<br>";
		}
		if ($returned_rows > 1){
			$msg = "Multiple volunteers found with same name: ".$fullName;
		}

		echo $msg;
		echo "<script type='text/javascript'>initVolunteers()</script>";

	}
?>

	</div>
	<br />
	<div id="volunteerItinerary" name="itinerary">
		<span id="itineraryHeader" class="sectionHeader hideOnPageLoad">Itinerary Information</span>
		<table id="itineraryTable" cellspacing="0" cellpadding="0"></table>
	</div>

<?php
	if (!empty($_GET['firstName'])){
		echo "<script>displayItinerary('".$_GET['firstName']." ".$_GET['lastName']."')</script>";
	}
?>

</body>
</html>
