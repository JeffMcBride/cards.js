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
var dropReady = [false, false];
var validMove = true;
var yaniv = false;
var turn = 0;
var current = 1;
var selectedCards = [];
var droppedAtTurn = [1];
var deck = new cards.Deck();
upperhand = new cards.Hand({
    faceUp: true,
    y: 60
});
lowerhand = new cards.Hand({
    faceUp: true,
    y: 340
});
var hand = [lowerhand, upperhand]
//Lets add a discard pile
discardPile = new cards.Deck({
    faceUp: true
});
discardPile.x += 50;

scores = [0, 0]
var upperScore = document.getElementById('score2');
upperScore.innerHTML = "Score: " + scores[1];
var lowerScore = document.getElementById('score1');
lowerScore.innerHTML = "Score: " + scores[0];

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
	dropReady[current] = false;
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
	hand[current].addCard(discardPile[discardPile.length-selectedCards.length-1]);
    discardPile.render();
    hand[current].render();
    selectedCards = [];
    dropCards();
    return;
});

$('#pile2').click(function() {
    $('#pile').hide();
    $('#deck').hide();
	$('#pile2').hide();
    hand[current].addCard(discardPile[discardPile.length-droppedAtTurn[turn-1]-selectedCards.length]);
    discardPile.render();
    hand[current].render();
    selectedCards = [];
    dropCards();
    return;
});

$('#deck').click(function() {
    $('#pile').hide();
	$('#pile2').hide();
    $('#deck').hide();
    hand[current].addCard(deck.topCard());
    hand[current].render();
    deck.render();
    selectedCards = [];
    dropCards();
    return;
});


$('#yaniv').click(function() {
	if (hand[current].sum < hand[+!current].sum){
		scores[+!current] += hand[+!current].sum
		current = +!current;
	}
	else{
		scores[current] += 20 + hand[current].sum
	}
	upperScore.innerHTML = "Score: " + scores[1];
	lowerScore.innerHTML = "Score: " + scores[0];
	deck.addCards(cards.all);
	selectedCards = [];
	cards.shuffle(deck);
	turn = 0;
	droppedAtTurn = [1] 
	deck.render();
	validMove = true;
	$('#yaniv').hide();
	$('#drop').hide();
	$('#deal').show();
	lowerhand.render();
	upperhand.render();
	discardPile.render();
	yaniv = true;
});



function dropCards() {
	$('#drop').show();
	turn += 1;
	current = +!current;
	dropReady[current] = true;
	if (hand[current].sum <= 20){
		$('#yaniv').show();
	}
	hand[current].click(function(card) {
		if (dropReady[current] == true){
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
		return;
	});
	
    $('#drop').one("click", function() {
		if (yaniv == true){ 
			yaniv = false;
			return; 
		}
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
				hand[current].render();
				droppedAtTurn[turn] = selectedCards.length;
				pickUp();
			} 
			else {
				alert("Invalid Move");
				selectedCards = [];
				discardPile.render();
				hand[current].render();
				dropCards();
			}
		}
		yaniv = false;
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


