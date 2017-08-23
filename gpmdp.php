<!DOCTYPE html>
<html>

<head>
    <title>Google Play Music Desktop Player - Playify</title>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
	<title>Spotify Playlist - Playify</title>
	<link href="icon.png" rel="icon">
	<meta content="width=device-width, initial-scale=1" name="viewport">
	<meta content="#10BC4C" name="theme-color">
	<link href="css/materialize.min.css" type="text/css" rel="stylesheet">
	<link href="css/style.css" type="text/css" rel="stylesheet">
    <style type="text/css">
	  	* {
	    	user-select: none;
	  	}
	  </style>
</head>

<body>
    <nav class="black" role="navigation">
		<div class="nav-wrapper container">
			<a href="#!" class="brand-logo center">Playify</a>
		</div>
	</nav>
	
    <div class="valign-wrapper section-start">
    	<div class="container center">
	        <h1 class="white-text">GPMDP</h1>
	        <br>
	        <br>
	        <div class="playing">
	            <p>Connecting...</p>
	        </div>
	        <div class="error" style="display: none;">
	            <p>Error: GPMDP is probably configured wrong. Please click on the Playify icon in Chrome, then on "Setup" next to "Google Play Music Desktop Player" and follow the instructions.</p>
	        </div>
		</div>
		<div class="eq-wrapper">
			<div class="eq">
				<span></span>
				<span></span>
				<span></span>
				<span></span>
				<span></span>
				<span></span>
				<span></span>
				<span></span>
				<span></span>
				<span></span>
			</div>
		</div>
    </div>
    <script type="text/javascript" src="js/jquery.min.js"></script>
    <script type="text/javascript" src="js/materialize.min.js"></script>
    <script type="text/javascript">
    var socket = new WebSocket("ws://localhost:5672");
    var parser = document.createElement("a");
    parser.href = window.location.href;
    var payload = parser.hash.substring(1);

    socket.onmessage = function(message) {
        var data = JSON.parse(message.data);

        if (data.channel == "connect") {
            if (data.payload == "CODE_REQUIRED") {
                error();
            }
        }
      
        if (data.channel == "search-results" && data.payload.searchText == "<?php echo $search; ?>") {
          console.log(data.payload.<?php echo $category; ?>[0]);
            console.log("sending");
            socket.send(JSON.stringify({
                namespace: "search",
                method: "playResult",
                arguments: [data.payload.<?php echo $category; ?>[0]]
            }));
            <?php
              if (intval($_GET["v"]) >= 2) {
                ?>
                setTimeout(function(){
                	window.location.href = "https://krmax44.de/playify/close";
                }, 2000);
                <?php
              }
            ?>
        }
    };

    socket.onopen = function() {
        socket.send(JSON.stringify({
            namespace: "connect",
            method: "connect",
            arguments: ["Playify", payload]
        }));
        socket.send(JSON.stringify({
            namespace: "search",
            method: "performSearch",
            arguments: ["<?php echo $search; ?>"]
        }));
    };

    socket.onerror = function() {
        error();
    };
    
    function error () {
    	$(".eq span").css("animation-play-state", "paused");
    	$(".playing").hide();
    	$(".error").show();
    }
    </script>
</body>

</html>