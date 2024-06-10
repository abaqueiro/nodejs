// configuration
const LISTEN_PORT = 8080

// using a native http module
const http = require('http')
const url = require('url')
const StringDecoderLib = require('string_decoder')

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
	console.log(`url_trimmed_path: ${url_trimmed_path}`)

	// Get query string
	let request_params = parsed_url.query
	console.log("Request parameters: ", request_params)

	// Get payload if any
	let decoder = new StringDecoderLib.StringDecoder('utf-8')
	let buffer = []
	request.on('data',function(data){
		console.log('request on data callback')
		buffer.push( decoder.write(data) )
	})
	request.on('end',function(){
		buffer.push( decoder.end() )

		// Send response
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
					response.write( "\n<h2>Payload</h2>\n" )
					response.write( "\n<xmp>" )
					response.write( buffer.join('') )
					response.write( "</xmp>\n" )
					response.write( `<footer>
			<h3>Page requests count: ${request_count}</h3>
			</footer>
			</body>
			</html>` )
					response.end( "\n" )

	})
} )

server.listen( LISTEN_PORT, function(){
	console.log(`[INFO] Server is listening on port ${LISTEN_PORT} ... `)
},  )
