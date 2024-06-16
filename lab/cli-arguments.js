#!/usr/bin/env node
const argv = process.argv
const argc = argv.length

console.log( '========== Command Line Arguments ==========')
console.log( `Argument Count: ${argc}` )
for(var i=0; i<argc; i++){
	console.log( `Argument #${i}: ${argv[i]}` )
}