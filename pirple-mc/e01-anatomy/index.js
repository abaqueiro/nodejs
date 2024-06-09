/*
The idea of the project is to show the basic structure of a nodejs project

How code is structured in files and how to declare the use of that files.

to run:

node index.js

*/

// Dependencies
var mathlib = require('./lib/math')
var jokeslib = require('./lib/jokes')

var app = {}

app.config = {
    'time_between_jokes_ms': 1000
}

app.print_joke = function(){
	if ( app.joke_index < app.jokes_A.length ){
		console.log( (app.joke_index+1) + ' - ' + app.jokes_A[ app.random_list[ app.joke_index ] ] )
		console.log( '' )
		app.joke_index++
	} else {
		clearInterval( app.pid )
	}
}

app.start_joking = function(){
	app.jokes_A = jokeslib.get_jokes()

	// generate the random index list in B array
	var A = []
	for(var i=0; i<app.jokes_A.length; i++){
		A.push(i)
	}
	var B = []
	while ( A.length > 1 ){
		var i = mathlib.get_random_integer(0,A.length)
		B.push( A[i] )
		A = A.slice(0,i).concat( A.slice(i+1) )
	}
	B.push( A.pop() )
	
	app.random_list = B
	app.joke_index = 0
	app.print_joke()
	app.pid = setInterval( app.print_joke, app.config.time_between_jokes_ms )
}

app.start_joking()
