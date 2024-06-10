// configuration
const LISTEN_PORT = 8080

// using a native http module
const http = require('http')

let request_count = 0
const server = http.createServer( function( request, response ){
	request_count++
	console.log( "REQUEST #" + request_count + " " + request.headers.host + " " + request.method + " " + request.url )

	response.write( `<html>
<head>
<style>
* {
	box-sizing: border-box;
}
html, body {
	margin: 0;
	padding: 0;
	font-size: 16pt;
}
header {
	background-color: DarkBlue;
	color: white;
	text-align: center;
	padding: 16px;
	font-size: 24pt;
	font-weight: bold;
}
footer {
	display: block;
	border: 1px solid black;
	text-align: center;
	/*position: absolute;
	bottom: 0px;*/
	width: 100%;
	background-color: DarkSlateBlue;
	color: white;
}
</style>
</head>
<body>
<header>Nodejs at your service</header>
` )
	response.write( "\n<h2>Request Method</h2>\n" )
	response.write( request.method )
	response.write( "\n<h2>Request Url</h2>\n" )
	response.write( request.url )
	response.write( "\n<h2>Request Headers</h2>\n" )
	response.write( "\n<xmp>" )
	for( prop in request.headers ){
		response.write(`${prop} : ${request.headers[prop]}\n`)
	}
	response.write( "</xmp>\n" )
	response.write( `<footer>
<h3>Page requests count: ${request_count}</h3>
</footer>
</body>
</html>` )
	response.end( "\n" )
} )

server.listen( LISTEN_PORT, function(){
	console.log(`[INFO] Server is listening on port ${LISTEN_PORT} ... `)
},  )
