// Dependencies
var fs = require('fs')

var jokes = {}

var joke_A = (function(){
    var file_content = fs.readFileSync(__dirname+'/jokes.txt', 'utf-8')
    var joke_A = file_content.split(/\r?\n/)
    return joke_A})()

jokes.get_jokes = function(){
    return joke_A
}

module.exports = jokes