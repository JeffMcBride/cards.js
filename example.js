//Tell the library which element to use for the table
cards.init({
    table: '#card-table'
});

$('#drop').hide();
$('#deal').hide();
$('#pile').hide();
$('#deck').hide();

var player = 1;



var validMove = true;

//Create a new deck of cards
var deck = new cards.Deck();




//Now lets create a couple of hands, one face down, one face up.
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

$('#play').one("click", function() {
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
$('#deal').one("click", function() {
    //Deck has a built in method to deal to hands.
    $('#deal').hide()
    deck.deal(7, [upperhand, lowerhand], 50, function() {
        //This is a callback function, called when the dealing
        //is done.
        discardPile.addCard(deck.topCard());
        discardPile.render();
    });
    pickUp();
    //dropCards();
});

function pickUp() {
    validMove = false;
    $('#pile').show();
    $('#deck').show();
}

$('#pile').click(function() {
    $('#pile').hide();
    $('#deck').hide();
    lowerhand.addCard(discardPile.topCard());
    discardPile.render();
    lowerhand.render();
    selectedCards = [];
    dropCards();
    return;
});


$('#deck').click(function() {
    $('#pile').hide();
    $('#deck').hide();
    lowerhand.addCard(deck.topCard());
    lowerhand.render();
    deck.render();
    selectedCards = [];
    dropCards();
    return;
});


function dropCards() {
    lowerhand.click(function(card) {
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
        if (selectedCards.length > 0) {
            $('#drop').show();
        } else {
            $('#drop').hide();
        }

        var ranks = [];
        validMove = true;
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
    });
    $('#drop').one("click", function() {
        $('#drop').hide();
        if (validMove == true) {
            for (var i = 0; i < selectedCards.length; i++) {
                discardPile.addCard(selectedCards[i]);
            }
            discardPile.render();
            lowerhand.render();
            selectedCards = [];
            pickUp();
        } else {
            alert("Invalid Move");
            selectedCards = [];
            discardPile.render();
            lowerhand.render();
            dropCards();

        }
    });
    return;
}
