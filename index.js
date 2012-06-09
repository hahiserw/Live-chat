/*
 * @author Maurycy Skier
 * @description Real time chat.
 *
 */

var
	fs = require( "fs" ),
	http = require( "http" ),
	io = require( "io" );

var random = 1;


var httpd = http.createServer( function( request ) {

	request.lol();

} );

httpd.listen( 80 );


console.log( "Live chat server started." );
