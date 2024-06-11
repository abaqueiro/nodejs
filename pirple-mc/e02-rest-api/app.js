// configuration
const LISTEN_PORT = 8080

// using a native http module
const http = require('http')
const url = require('url')
const StringDecoderLib = require('string_decoder')
const { chown } = require('fs')

// server scope variables
let request_count = 0

const server = http.createServer( function( request, response ){
	request_count++
	console.log( "REQUEST #" + request_count + " " + request.headers.host + " " + request.method + " " + request.url )

	// Get the URL path
	let parse_query_params = true
	let parsed_url = url.parse( request.url, parse_query_params )
	let url_path = parsed_url.pathname

	//let url_trimmed_path = url_path.replace(/\/+/g,'/')
	let url_trimmed_path = url_path.replace(/^\/+|\/+$/g,'')
	if ( url_trimmed_path == '' ) {
		url_trimmed_path = '/'
	}

	// Get query string
	let request_query_params = parsed_url.query

	// Get payload if any
	let decoder = new StringDecoderLib.StringDecoder('utf-8')
	let buffer = []
	request.on('data',function(data){
		console.log('request on data callback')
		buffer.push( decoder.write(data) )
	})
	request.on('end',function(){
		buffer.push( decoder.end() )

		// chose request handler
		request_handler = typeof( route_index[ url_trimmed_path ] ) == 'undefined' ? handlers.not_found : route_index[ url_trimmed_path ]

		// prepare request handler data
		let request_params = {
			url: request.url
			, headers: request.headers
			, method: request.method
			, path: url_trimmed_path
			, request_query_params: request_query_params
			, body: buffer.join('')
		}

		// call the handler
		request_handler( request_params, function( response_params ){
			let status_code = typeof(response_params.status_code) == 'number' ? response_params.status_code : 500
			response.writeHead( status_code )
			
			let response_body = typeof(response_params.body) == 'string' ? response_params.body : ''
			response.write( response_body )
			response.end( "\n" )
		} ) 
		
	})
} )

server.listen( LISTEN_PORT, function(){
	console.log(`[INFO] Server is listening on port ${LISTEN_PORT} ... `)
},  )


// HANDLERS
const handlers = {}
handlers.index = function( request_params, response_handler ){
	let response_params = {}

	let buffer = []
	buffer.push( `<html>
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
		buffer.push( "\n<h2>Request Method</h2>\n" )
		buffer.push( request_params.method )
		buffer.push( "\n<h2>Request Url</h2>\n" )
		buffer.push( request_params.url )
		buffer.push( "\n<h2>Request Headers</h2>\n" )
		buffer.push( "\n<xmp>" )
		for( prop in request_params.headers ){
			buffer.push(`${prop}: ${request_params.headers[prop]}\n`)
		}
		buffer.push( "</xmp>\n" )
		buffer.push( "\n<h2>Payload</h2>\n" )
		buffer.push( "\n<xmp>" )
		buffer.push( request_params.body )
		buffer.push( "</xmp>\n" )
		buffer.push( `<footer>
<h3>Page requests count: ${request_count}</h3>
</footer>
</body>
</html>` )

	response_params.status_code = 200
	response_params.body = buffer.join('')
	response_handler( response_params )
}
handlers.not_found = function( request_params, response_handler ){
	let response_params = {}
	response_params.status_code = 404
	response_params.body = 'Not Found!'
	response_handler( response_params )
}

// REQUEST ROUTING
const route_index = {
	'/': handlers.index
}
