//Tell the library which element to use for the table
cards.init({
    table: '#card-table'
});

$('#drop').hide();
$('#deal').hide();
$('#pile').hide();
$('#pile2').hide();
$('#deck').hide();
$('#yaniv').hide();

var dropReady = true;
var player = 1;
var turn = 0;
droppedAtTurn = []
droppedAtTurn[0] = 1;


var validMove = true;

//Create a new deck of cards
var deck = new cards.Deck();

upperhand = new cards.Hand({
    faceUp: true,
    y: 60
});
lowerhand = new cards.Hand({
    faceUp: true,
    y: 340
});

//Lets add a discard pile
discardPile = new cards.Deck({
    faceUp: true
});
discardPile.x += 50;

var selectedCards = [];
var droppedCards = [];

$('#play').click(function() {
    $('#deal').show();
    $('#play').hide();
    //By default it's in the middle of the container, put it slightly to the side
    deck.x -= 50;
    //cards.all contains all cards, put them all in the deck
    deck.addCards(cards.all);
    //No animation here, just get the deck onto the table.
    deck.render({
        immediate: true
    });

});


//Let's deal when the Deal button is pressed:
$('#deal').click(function() {
    //Deck has a built in method to deal to hands.
    $('#deal').hide()
    deck.deal(7, [upperhand, lowerhand], 50, function() {
        //This is a callback function, called when the dealing
        //is done.
        discardPile.addCard(deck.topCard());
        discardPile.render();
    });
    dropCards();
});

function pickUp() {
	$('#yaniv').hide();
	dropReady = false;
    validMove = false;
	$("#pile").html(setButtonName(discardPile[discardPile.length-1-selectedCards.length]));
	$('#deck').show();
    $('#pile').show();
	if (droppedAtTurn[turn-1] > 1){
		$('#pile2').show();
		$("#pile2").html(setButtonName(discardPile[discardPile.length-droppedAtTurn[turn-1]-selectedCards.length]));
	}
}

$('#pile').click(function() {
    $('#pile').hide();
    $('#deck').hide();
	$('#pile2').hide();
	lowerhand.addCard(discardPile[discardPile.length-selectedCards.length-1]);
    discardPile.render();
    lowerhand.render();
    selectedCards = [];
    dropCards();
    return;
});

$('#pile2').click(function() {
    $('#pile').hide();
    $('#deck').hide();
	$('#pile2').hide();
    lowerhand.addCard(discardPile[discardPile.length-droppedAtTurn[turn-1]-selectedCards.length]);
    discardPile.render();
    lowerhand.render();
    selectedCards = [];
    dropCards();
    return;
});

$('#deck').click(function() {
    $('#pile').hide();
	$('#pile2').hide();
    $('#deck').hide();
    lowerhand.addCard(deck.topCard());
    lowerhand.render();
    deck.render();
    selectedCards = [];
    dropCards();
    return;
});


$('#yaniv').one("click", function(){
	deck.addCards(cards.all);
	selectedCards = [];
	droppedCards = [];
	cards.shuffle(deck);
	turn = 0;
	droppedAtTurn = []
	droppedAtTurn[0] = 1; 
	deck.render();
	validMove = true;
	$('#yaniv').hide();
	$('#drop').hide();
	$('#deal').show();
	lowerhand.render();
	upperhand.render();
	discardPile.render();
});



function dropCards() {
	dropReady = true;
	$('#drop').show();
	turn += 1;
	if (lowerhand.sum <= 70){
		$('#yaniv').show();
	}
	lowerhand.click(function(card) {
		if (dropReady == true){
			if (selectedCards.includes(card)) {
				card.rotate(0);
				var index = selectedCards.indexOf(card);
				if (index > -1) {
					selectedCards.splice(index, 1);
				}
			} else {
				selectedCards.push(card);
				card.rotate(8);
			}
			var ranks = [];
			validMove = true;
			var joker = 0;
			var pair = true;
			//Check for valid move
			for (var j = 0; j < selectedCards.length; j++) {
				//Check for pairs
				if (selectedCards[j].rank != selectedCards[0].rank) {
					pair = false;
					// Check for same suit
					if (selectedCards[j].suit != selectedCards[0].suit) {
						validMove = false;
					}
				}
				ranks.push(selectedCards[j].rank);
			}
			ranks.sort();
			// Check for a run
			if (validMove == true && pair == false) {
				if (ranks.length < 3) {
					validMove = false;
				} else {
					//Check for a run
					for (var k = 1; k < ranks.length; k++) {
						if (ranks[k] != (ranks[k - 1] + 1)) {
							validMove = false;
						}
					}
				}
			}
		}
	});
		
    $('#drop').one("click", function() {
		alert(selectedCards.length);
		if (selectedCards.length == 0){
			alert("Selected your cards homie")
			dropCards();
		}
		else{
			$('#drop').hide();
			if (validMove == true) {
				for (var i = 0; i < selectedCards.length; i++) {
					discardPile.addCard(selectedCards[i]);	
				}
				discardPile.render();
				lowerhand.render();
				droppedAtTurn[turn] = selectedCards.length;
				pickUp();
			} 
			else {
				alert("Invalid Move");
				selectedCards = [];
				discardPile.render();
				lowerhand.render();
				dropCards();
			}
		}
    });
    return;
}

function setButtonName(card){
	var rank = card.rank;
	var suit = card.suit;
	switch(rank){
		case 11: //Jack
			rank = "J"
			break;
		case 12: //Queen
			rank = "Q"		
			break;
		case 13: //King
			rank = "K"		
			break;
		case 0: //Joker
			rank = "JOKER"
			if (suit == "bj"){suit = " Black"}
			if (suit == "rj"){suit = " Red"}
			break;
		case 1: //Ace
			rank = "A"
			break;
	}			
	return (rank + suit.charAt(0).toUpperCase());
}


