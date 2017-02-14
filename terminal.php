<!DOCTYPE html>
<html lang="en">
	<head>
		<title>SJSTerm</title>

		<script src="https://code.jquery.com/jquery-2.2.3.min.js"
				  integrity="sha256-a23g1Nt4dtEYOj7bR+vTu7+T8VP13humZFBJNIYoEJo="
				  crossorigin="anonymous"></script>
		<link href='https://fonts.googleapis.com/css?family=Cutive+Mono' rel='stylesheet' type='text/css'>
		<link href='/style.css?time=<?php echo time();?>' rel='stylesheet' type='text/css'>
	</head>
	<body>
		<div id="inputContainer">
			<input type="text" class="active">
		</div>
		<div class="container">
			<div class="header clearfix">
				<h3 class="text-muted">SJSTerm</h3>
			</div>

			<div class="term">
			</div>
		</div>
	</body>
	<script src="/terminal.js?time=<?php echo time();?>"></script>
</html>
