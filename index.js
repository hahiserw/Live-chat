/*
 * @author Maurycy Skier
 * @description Real time chat.
 *
 */

var
	fs = require( "fs" ),
	http = require( "http" ),
	io = require( "socket.io" );

var
	_base = __dirname,
	_port = 8000,
	random = 1;


var httpd = http.createServer( function( request, response ) {

	fs.readFile( _base + "/index.html", function( error, data ) {
		if( error ) {
			response.writeHead( 500 );
			respnose.end( "Lol, no index.html?" );
		} else {
			response.writeHead( 200, { "Content-Type": "text/html" } );
			response.end( data );
		}
	} );

} );

var iod = io.listen( httpd );
httpd.listen( _port );

iod.sockets.on( "connection", function( client ) {

	client.emit( "status", { type: "status", text: "ok" } );

	iod.sockets.emit( "message", { nick: "random" + client.id, text: "" } );

	//Get user list too.

	client.on( "message", function( text ) {
		var data = {
			nick: "random" + client.id,
			text: text
		};
		//Initial replace rules.
		data.text = data.text
			.replace( /\</g, "&lt;" )
			.replace( /\>/g, "&gh;" );
		iod.sockets.emit( "message", data );
	} );

	client.on( "disconnect", function() {
		var data = {
			type: "bye",
			nick: "random" + client.id
		}
		iod.sockets.emit( "status", data );
	} );

} );


console.log( "Live chat server started at port " + _port + "." );
