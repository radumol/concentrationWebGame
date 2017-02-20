var user;
var size = 2;
var level = 1;

$(document).ready(function(){
	user = prompt("What's your name?") || "User";
	$.ajax({
		method:"GET",
		url:"/memory/intro",
		data: {'username':user, size:size},
		success: displayTiles,
		dataType:'json'
	});
});

function displayTiles(){
	
	
	$("#gameboard").empty();
	$('#level').text("Current level: " + level);
	for(var i=0; i<size; i++){
		var row = "row"+i;
		$('#gameboard').append($('<tr id="'+row+'"></tr>'));
		for(var j=0; j<size; j++){
			//console.log("this is i and j: "+i+" " + j);
			$('#'+row).append($('<div id="'+i+j+ '"; class="tile"></div>'));
			$('#'+i+j).attr("row", i);
			$('#'+i+j).attr("col", j);
			$('#'+i+j).click(chooseTile);
		}
	}
}

function chooseTile(){
		var row = $(this).attr("row");
		var col = $(this).attr("col");
		//console.log("row: "+row+" col: "+col);
		
		$.ajax({
		method:"GET",
		url:"/memory/card",
		data: {'username':user, row:row, col:col },
		success: tileClick,
		dataType:'json'
		});
}

var clickCount = 0;
var tile1; //the 2 tiles that we'll compare
var tile2;
var vars = {};  //how I figured to get tile1 and tile2
var attempts =0;
var success = 0; //how many good tile pairs there are, to be used for win condition

function tileClick(data){
	
	var tileValue = data.tileValue;
	var row = data.row;
	var col = data.col;
	//condition for following if statement
	var ifClicked = $("#"+row+col).css("background-color") === "rgb(0, 0, 255)";
	
	if (ifClicked && clickCount <2){
		
		$("#"+row+col).animate({fontSize: '3em'}, "medium"); //animation
		$("#"+row+col).text(tileValue);
		$("#"+row+col).css("background-color", "white");
		clickCount++;
		//records tile+1 or tile+2:
		vars['tile' + clickCount] = {div:$("#"+row+col), val: tileValue};
		//once the 2 tiles will be clicked:
		if(clickCount === 2){
			//will count as an attempt
			attempts++;
			//in case both tiles have the same value
			if(vars['tile1'].val===vars['tile2'].val){
				success++;
				console.log("JESUS CHRIST");
				//deactivates clicability of both tiles
				vars['tile1'].div.click(false);
				vars['tile2'].div.click(false);
				//resets the clickcount and empties the vars
				clickCount=0;
				vars={};
				//success condition:
				if((size*size)/success===2){
					success = 0;
					var att = attempts;
					attempts = 0;
					setTimeout (function(){
						//number of attempts presented to the user
						alert("You win in "+att+" attempts, CONGRATULATION!");
						size = size+2;
						level++;
						$.ajax({
						method:"GET",
						url:"/memory/intro",
						data: {'username':user, size:size},
						success: displayTiles,
						dataType:'json'
						});
					}, 400);
				}
			}else{//else it will flip both tiles
				setTimeout(function(){ 				
					vars['tile1'].div.css("background-color","blue");
					vars['tile2'].div.css("background-color","blue");
					vars['tile1'].div.text("");
					vars['tile2'].div.text("");
					vars['tile1'].div.css("fontSize", '16px');
					vars['tile2'].div.css("fontSize", '16px');
					
					clickCount=0;
					vars={};
				}, 800);
			}
		}
	}
	
	
	
	
}


		