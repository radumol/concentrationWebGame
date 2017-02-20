//An asynchronous server that serves static files

// load necessary modules
var http = require('http');
var fs = require('fs');
var mime = require('mime-types');
var url = require('url');
var makeBoard = require("./boardNums.js");

const ROOT = "./public_html";
var users = {};
// create http server
var server = http.createServer(handleRequest); 
server.listen(2406);
console.log('Server listening on port 2406');

function handleRequest(req, res) {
	
	//process the request
	console.log(req.method+" request for: "+req.url);
	
	//parse the url
	var urlObj = url.parse(req.url,true);
	var filename = ROOT+urlObj.pathname;
	var client;
	//var choice;
	console.log("THIS PATH NAME: " +urlObj.pathname);	
	
	if (urlObj.pathname === "/memory/intro"){
		if(req.method === "GET"){
			
			var userName = urlObj.query.username;
			client = {name:userName};
			client.boardSize = urlObj.query.size;
			var board = makeBoard.makeBoard(client.boardSize);
			client.board = board;
			
			users[userName] = client;
			respond(200, JSON.stringify({client:users[userName]}));
		}	
	}
	else if (urlObj.pathname === "/memory/card"){
		if(req.method==="GET"){
			
			//user sends i-j coordinates of card
			//server gets the appropriate value of the card
			
			var userName = urlObj.query.username;
			client = users[userName];
			
			var row = urlObj.query.row;
			var col = urlObj.query.col;
			//console.log("row: "+row+" col: "+col);
			var tileVal = client.board[row][col];
			//console.log(tileVal);
			respond(200, JSON.stringify({row:row, col:col, tileValue: tileVal}));
			
		}
		
	}else  {
		
		fs.stat(filename,function(err, stats){
		if(err){   //try and open the file and handle the error, handle the error
			respondErr(err);
		}else{
			if(stats.isDirectory())	filename+="/index.html";
			
			fs.readFile(filename,"utf8",function(err, data){
				if(err)respondErr(err);
				else respond(200,data);
			});
		}
		});
	}
				
	
	//locally defined helper function
	//serves 404 files 
	function serve404(){
		fs.readFile(ROOT+"/404.html","utf8",function(err,data){ //async
			if(err)respond(500,err.mesage);
			else respond(404,data);
		});
	}
		
	//locally defined helper function
	//responds in error, and outputs to the console
	function respondErr(err){
		console.log("Handling error: ",err);
		if(err.code==="ENOENT"){
			serve404();
		}else{
			respond(500,err.message);
		}
	}
		
	//locally defined helper function
	//sends off the response message
	function respond(code, data){
		// content header
		res.writeHead(code, {'content-type': mime.lookup(filename)|| 'text/html'});
		// write message and signal communication is complete
		res.end(data);
	}	
	
};//end handle request



function randEle(list){
	return list[Math.floor(Math.random()*list.length)];
}


	


