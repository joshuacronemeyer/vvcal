<html>
<head>
	<script type="text/javascript" src="http://www.google.com/jsapi?key=ABQIAAAAKYmOqEXuSTJLmIQnR5PK0BT2yXp_ZAY8_ufC3CFXhHIE1NvwkxRY1xD4kh0qjbX_xcdZnGjjKoA4cA"></script>
	<script type="text/javascript" src="js/volunteers.js"></script>
	<script type="text/javascript">
	function reload(form){
		var val=form.volunteers.options[form.volunteers.options.selectedIndex].value;
		var firstNameVal = val.substring(0, val.indexOf(" "));
		var lastNameVal = val.substring(val.indexOf(" ") + 1);
		self.location="volunteers.php?firstName=" + firstNameVal + "&lastName=" + lastNameVal;
		refreshVillageItinerary();
	}
</script>

</head>
<body>
<?php
	$servername='localhost';

	// username and password to log onto db server
	$dbusername='root';
	$dbpassword='password';

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

	<img src="images/pixel.gif" style="position: absolute; top: -10; left: 0;"/>
	<div align="center">
	<input type="button" name='volunteerButton' id='volunteerButton' value="Click to get list of volunteers" onclick="initVolunteers()" /><br><br>
	<form name="populate" method="get">
	<select name='volunteers' id='volunteers' onChange='reload(this.form)'>
	</select>
	</form>
	<hr width="80%" align="center">
	</div>
	<div id="info" name="info">
	<?php
	if (!empty($_GET['firstName'])){

		$query="select * from people where FirstName='".$_GET['firstName']."' and LastName='".$_GET['lastName']."'";
		$rt=mysql_query($query);
		echo mysql_error();

		//echo mysql_num_rows($rt);
		while($nt=mysql_fetch_array($rt)){
			echo "Email: $nt[Email]<br>";
			echo "Phone: $nt[Phone]<br>";
		}



	}
	?>
	</div>
	<br>
	<span id="itinerary" name="itinerary">&nbsp;</span>
</body>
</html>