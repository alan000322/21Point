///// Main
$(document).ready(function() {
    initCards();   // 卡片初始化
    initButtons(); // 按鈕初始化
});

///// Param & Var
let yourDeck     = [];
let dealerDeck   = []; 
let yourPoint    = 0;
let dealerPoint  = 0;
let inGame       = false;
let winner       = 0; // 0: 未定, 1: 玩家贏, 2: 莊家贏, 3: 平手
let gameTime     = 0;



///// Function


function initCards() {
    // let allCards = document.querySelectorAll('.card div')
    // allCards.forEach( card => {
    //     card.innerHTML = ''
    // } )

    $('.cards div').html('狂')
}

function initButtons() {
    $('#action-new-game').click( evt => newGame() );

    $('#action-hit').click( evt => {
        evt.preventDefault();
        yourDeck.push(deal());
        showGameTable();
        showWinsGames();
    });
    $('#action-stand').click( evt => {
        evt.preventDefault();
        dealerDeck.push(deal());
        //showGameTable();
        //showWinsGames();
        dealerRound();
    });
}

function newGame() {
    gameTime = gameTime + 1;
    if (inGame) {
        alert('你不能毀棋!');
        return 0;
    }
    if ( gameTime != 1 ) {
        console.log(">>>>");
        console.log(gameTime);
        
        initCards();
        
        //$('.transitions::after').css('content', "");
        $('.dealer-cards h1').removeClass("transitions");
        $('.your-cards h1').removeClass("transitions");
        $('.dealer-cards').removeClass("win");
        $('.your-cards').removeClass("win");
        $('.your-cards h1').html(``);
        $('.dealer-cards h1').html(``);
        $('.your-cards h1').html(`你`);
        $('.dealer-cards h1').html(`莊家`);
        //return 0;
    }
    console.log(gameTime);
    resetGame(); //遊戲初始化
    //initCards();
    console.log("New Game!!");
    
    deck = shuffle(buildDeck());

    yourDeck.push(deal()); //   開始發牌:給我
    dealerDeck.push(deal()); // 開始發牌:給莊家
    yourDeck.push(deal()); //   開始發牌:給我
    
    
    //開始遊戲中!!
    
    inGame = true;
    

    showGameTable(); //在桌面上畫出牌
    if (winner == 3) winner = 0;
    showWinsGames();
    showWinsGames();

}

function deal() {
    // 發牌
    return deck.shift();
}

function buildDeck() {
    // 建立卡牌
    let deck = [];
    
    for ( let suit=1; suit<=4; suit++ ) { 
        for ( let number=1; number<=13; number++ ) {
            
            let c = new Card(suit, number);
            deck.push(c); // 相當於append塞到array後面
        } // for number 數字
    } //for suit 花色
    return deck;
}

function showGameTable() {
    yourDeck.forEach((card, i) => {
        let theCard = $(`#yourCard${i+1}`);
        theCard.html(card.cardNumber());
        theCard.prev().html(card.cardSuit());//抓到前一個html tag
    })
    dealerDeck.forEach((card, i) => {
        let theCard = $(`#dealerCard${i+1}`);
        theCard.html(card.cardNumber());
        theCard.prev().html(card.cardSuit());//抓到前一個html tag
    })

    // 算點數
    yourPoint   = calcPoint(yourDeck);
    dealerPoint = calcPoint(dealerDeck);

    if ( yourPoint >= 21 || dealerPoint >= 21 ) {
        inGame = false;
    }

    checkGameTable();
        
    
    
    

    $('.your-cards h1').html(`你的點數是:${yourPoint}點`);
    $('.dealer-cards h1').html(`莊家的點數是:${dealerPoint}點`);
    
    // 按鈕
    //if (inGame) {
    //    $('#action-hit').attr('disabled', false);
    //    $('#action-stand').attr('disabled', false);
    //} else {
    //    $('#action-hit').attr('disabled', true);
    //    $('#action-stand').attr('disabled', true);
    //}
    buttonDisable();
}
function checkGameTable() {
    //論輸贏
    switch (true) {
        // 2. 如果點數爆掉
        case yourPoint > 21:
            winner = 2;
            break;
        case dealerPoint > 21:
            winner = 1;
            break;
        // 3. 平手
        case yourPoint == dealerPoint:
            winner = 3;
            break;
        // 1. 如果玩家21點，玩家贏
        case yourPoint == 21:
            winner = 1;
            break;
        default:
            winner = 0;
            break;
        
        
        
    } 
    console.log(winner)  
}

function calcPoint(deck) {
    let point = 0;
    deck.forEach( card => {
        point += card.cardPoint();
    });
    if ( point > 21 ) {
        deck.forEach( card => {
            if ( card.cardNumber() === "A" ) {
                point -= 10;
            }
        })
    }

    return point;
}
function buttonDisable() {
    $('#action-hit').attr('disabled', !inGame);
    $('#action-stand').attr('disabled', !inGame);
}

function resetGame() {
    deck = [];
    yourDeck    = [];
    dealerDeck = [];
    yourPoint   = 0;
    dealerPoint = 0;
    winner = 0;
}


function dealerRound() {
    // 1. 發牌
    // 2. 如果點數 >= 玩家，結束，莊家贏
    // 3. < 玩家，繼續發，重複
    // 4. 爆了，結束，玩家贏
    while ( dealerDeck.length <= 5 ) {
        dealerPoint = calcPoint(dealerDeck);
        if ( dealerPoint <= yourPoint ) {
            dealerDeck.push(deal());
            showGameTable();
            showWinsGames();
            console.log('counting');
        } else {
            showGameTable();
            showWinsGames();
            if ( winner == 0 )  {
                winner = 2;
                showWinsGames();
                buttonDisable();
                break;
            }
            else {
                buttonDisable();
                break;
            }
            
        }
    }
    if ( dealerDeck.length > 5 ) { //莊家狂出牌，但超出5張範圍
        showGameTable();
        showWinsGames();
        winner = 1;
        showWinsGames();
        
    }
    // else { //莊家狂出牌，已經比玩家大
    //     winner = 2;
    //     showGameTable();
    //showWinsGames();

    // }
    // if ( dealerPoint > yourPoint ) {
    //     winner = 2;
    //     showWinsGames();
    // }
    
}


function showWinsGames() {
    // 輸贏輸出
    console.log(">>>>)()()()()()(");
        console.log(gameTime);
    switch(winner) {
        case 1:
            if ( gameTime == 1 ) {
                $('.your-cards').addClass('win');
            }
            else {
                //$('.your-cards h1').addClass('showwin');
                $('.your-cards h1').html(`莊家的點數是:${yourPoint}點 => 又贏一場了！`);
                console.log("FUCK YOU GAME TIME NOT 1");
            }
            inGame = false;
            break;
        case 2:
            if ( gameTime == 1 ) {
                $('.dealer-cards').addClass('win');
            }
            else {
                //$('.dealer-cards h1').addClass('showwin');
                $('.dealer-cards h1').html(`莊家的點數是:${dealerPoint}點 => 又贏一場了！`);
                console.log("FUCK YOU GAME TIME NOT 1");
            }
            inGame = false;
            break;
        case 3: 
            inGame = false;
            break;
        default:
            break;
    }
}
    



class Card {
    constructor(suit, number) {
        this.suit = suit;
        this.number = number;
    }
    //牌面呈現
    cardNumber() {
        switch(this.number) {
            case 1:
                return 'A';
            case 11:
                return 'J';
            case 12:
                return 'Q';
            case 13:
                return 'K';
            default:
                return this.number;
        }
    }
    
    //點數
    cardPoint() {
        switch(this.number) {
            case 1:
                return 1;
            case 11:
                return 11;
            case 12:
                return 12;
            case 13:
                return 13;
            default:
                return this.number;
        }
    }
    cardSuit() {
        switch(this.suit) {
            case 1:
                return "♠";
            case 2:
                return "♥";
            case 3:
                return "♦";
            case 4:
                return "♣";

        }
    }
}

// shuffle 洗牌
// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
  }
