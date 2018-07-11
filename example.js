
//Tell the library which element to use for the table
cards.init({table:'#card-table'});

$('#drop').hide()
var validMove = true;
//Create a new deck of cards
deck = new cards.Deck(); 
//By default it's in the middle of the container, put it slightly to the side
deck.x -= 50;

//cards.all contains all cards, put them all in the deck
deck.addCards(cards.all); 
//No animation here, just get the deck onto the table.
deck.render({immediate:true});

//Now lets create a couple of hands, one face down, one face up.
upperhand = new cards.Hand({faceUp:true, y:60});
lowerhand = new cards.Hand({faceUp:true, y:340});

//Lets add a discard pile
discardPile = new cards.Deck({faceUp:true});
discardPile.x += 50;

var selectedCards = [];


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
});


//When you click on the top card of a deck, a card is added
//to your hand
deck.click(function(card){
	if (card === deck.topCard()) {
		selectedCards = [];
		lowerhand.addCard(deck.topCard());
		lowerhand.render();
	}
});

//Finally, when you click a card in your hand, if it's
//the same suit or rank as the top card of the discard pile
//then it's added to it
lowerhand.click(function(card){
		if (selectedCards.includes(card)){
			card.rotate(0);
			var index = selectedCards.indexOf(card);
			if (index > -1) {
				selectedCards.splice(index, 1);
			}
		}
		else {
			selectedCards.push(card);
			card.rotate(8);
		}
		if (selectedCards.length > 0){
			$('#drop').show();
		}
		else{
			$('#drop').hide();
		}
		validMove = true;
		var ranks = [];
		var pair = true;
		//Check for valid move
		for (var j = 0; j < selectedCards.length; j++){
			//Check for pairs
			if (selectedCards[j].rank != selectedCards[0].rank){
				pair = false;
				// Check for same suit
				if (selectedCards[j].suit != selectedCards[0].suit){
					validMove = false;
				}
			}
			ranks.push(selectedCards[j].rank); 
		}
		ranks.sort();
		// Check for a run
		if (validMove == true && pair == false) {
			if (ranks.length < 3){
				validMove = false;
			}
			else {
				//Check for a run
				for (var k = 1; k < ranks.length; k++){
					if (ranks[k] != (ranks[k-1]+1)){
						validMove = false;
					}
				}
			}
		}
		//alert(lowerhand.sum);
});


$('#drop').click(function() {
	$('#drop').hide()
	if (validMove == true){
		for (var i = 0; i < selectedCards.length; i++){
			discardPile.addCard(selectedCards[i]);
			discardPile.render();
		}
		lowerhand.render();
		selectedCards = [];
	}
	else{
		alert("Invalid Move");
	}
});


