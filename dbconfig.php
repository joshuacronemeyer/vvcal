<?php
$host = "localhost"; //database location
$user = "root"; //database username
$pass = "password"; //database password
$db_name = "villagev_villagedata"; //database name

//database connection
$link = mysql_connect($host, $user, $pass);
mysql_select_db($db_name);

?>