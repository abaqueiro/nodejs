var math = {}

// returns an integer between min and max-1 inclusive
// this is nice to use as array
math.get_random_integer = function( min, max ){
    if ( typeof(min) != 'number' ) throw "ERROR: min not a number."
    if ( typeof(max) != 'number' ) throw "ERROR: max not a number."
    var range = max - min
    return Math.floor( min + Math.random()*range )
}

module.exports = math