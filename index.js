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
	_port = 40008;


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

var
	random = 1,
	text_limit = 300;

iod.sockets.on( "connection", function( client ) {

	//nicks[client.id] = "random" + random++;
	// client.nick = "random" + random++;
	var nick = "random" + ( random++ );

	// iod.sockets.emit( "message", { nick: nick, text: "" } );

	//Get user list too.

	client.on( "message", function( text ) {
		if( text.length > text_limit )
			text = text.substr( 0, text_limit );
		//Initial replace rules.
		text = text
			.replace( /\</g, "&lt;" )
			.replace( /\>/g, "&gt;" )
			.replace( /\&/g, "&amp;" )
			.replace( /\"/g, "&quot;" )
			.replace( /\n/g, "<br />" ); //To do: replace only 10
		var data = {
			id: client.id,
			nick: nick,
			text: text
		};
		iod.sockets.emit( "message", data );
	} );

	client.on( "rename", function( name ) {
		nick = name.replace( /[^\wĄąĆćĘęŁłŃńÓóŚśŻżŹź]/g, "" );
	} );

	client.on( "disconnect", function() {
		var data = {
			type: "bye",
			id: client.id
		}
		iod.sockets.emit( "status", data );
	} );

} );


console.log( "Live chat server started at port " + _port + "." );
