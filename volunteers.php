<html>
<head>
	<script type="text/javascript" src="http://www.google.com/jsapi?key=ABQIAAAAKYmOqEXuSTJLmIQnR5PK0BT2yXp_ZAY8_ufC3CFXhHIE1NvwkxRY1xD4kh0qjbX_xcdZnGjjKoA4cA"></script>
	<script type="text/javascript" src="js/volunteers.js"></script>
	<script type="text/javascript">
	function reload(form){
		volunteersBox = document.getElementById('volunteers');
		val = volunteersBox.options[volunteersBox.options.selectedIndex].value;
		var firstNameVal = val.substring(0, val.indexOf(" "));
		var lastNameVal = val.substring(val.indexOf(" ") + 1);
		self.location="volunteers.php?firstName=" + firstNameVal + "&lastName=" + lastNameVal;
		refreshVillageItinerary();
	}
    </script>
	<link rel="stylesheet" href="css/style.css" TYPE="text/css" MEDIA="screen">
	<link rel="stylesheet" href="css/style.css" TYPE="text/css" MEDIA="screen">
</head>
<body>
	
	<img src="images/pixel.gif" style="position: absolute; top: -10; left: 0;"/>

<?php
	$servername='localhost';

	// username and password to log onto db server
	$dbusername='root';
	$dbpassword='';

	// name of database
	$dbname='villagev_villagedata';

	connecttodb($servername,$dbname,$dbusername,$dbpassword);
	function connecttodb($servername,$dbname,$dbuser,$dbpassword)
	{
	global $link;
	$link=mysql_connect ("$servername","$dbuser","$dbpassword");
	if(!$link){die("Could not connect to MySQL");}
	mysql_select_db("$dbname",$link) or die ("could not open db".mysql_error());
	}
?>

	<input type="button" name='volunteerButton' id='volunteerButton' value="List Volunteers" onclick="initVolunteers()" /><br><br>
	<select name='volunteers' id='volunteers' onChange='reload(this.form)'></select>

	<hr width="80%" align="center" />

	<div id="info" name="info">

<?php
	if (!empty($_GET['firstName'])){

		$query="select * from people where FirstName='".$_GET['firstName']."' and LastName='".$_GET['lastName']."'";
		$rt=mysql_query($query);
		echo mysql_error();
		$returned_rows = mysql_num_rows($rt);

		$msg = "Volunteer Not Found";

		if ($returned_rows == 1){
			$nt=mysql_fetch_array($rt);
			$msg = "Name: $nt[FirstName] $nt[LastName]<br>Email: $nt[Email]<br>Phone: $nt[Phone]<br>";
		}
		if ($returned_rows > 1){
			$msg = "Multiple volunteers found";
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
