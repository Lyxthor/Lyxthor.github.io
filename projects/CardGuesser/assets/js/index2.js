// ALGORITHMS
class ProgramAlgorithms  {
    constructor() {
        this.cards = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];
        this.decks = 
        [
            [
                this.cards[0], 
                this.cards[1], 
                this.cards[2], 
                this.cards[3], 
                this.cards[4], 
                this.cards[5], 
                this.cards[6], 
            ],
            [
                this.cards[7], 
                this.cards[8], 
                this.cards[9], 
                this.cards[10], 
                this.cards[11], 
                this.cards[12], 
                this.cards[13], 
            ],
            [
                this.cards[14], 
                this.cards[15], 
                this.cards[16], 
                this.cards[17], 
                this.cards[18], 
                this.cards[19], 
                this.cards[20], 
            ]
        ];
        this.randedCards = [];
        this.randedDecks = [];
        this.randCardLength = 0;

        this.randedDecks.push([])
        this.randedDecks.push([])
        this.randedDecks.push([])
    }
    setCards(randedCards) {
        this.cards = randedCards
    }
    setMiddleCards(middleIndex) {
        const deck = this.decks[middleIndex]
        deck.forEach((card, index)=> {
            let i = index+7
            this.randedCards[i] = card
        })
        for(let index = 0;index < this.decks.length;index++) {
            console.log(index)
            if(index !== middleIndex) {
                this.setEdgeCards(index)
            }
        }
    }
    setEdgeCards(edgeIndex) {
        const deck = this.decks[edgeIndex]
        const firstLeftEdgeCard = this.randedCards[0]

        if(firstLeftEdgeCard === undefined) {
            deck.forEach((card, index)=> {
                let i = index
                this.randedCards[i] = card
            })
        } else {
            deck.forEach((card, index)=> {
                let i = index+14
                this.randedCards[i] = card
            })
        }
    }
    randDecks() {
        let cardIndex = 0;
        for(let deckCardIndex = 0;deckCardIndex < this.decks[0].length;deckCardIndex++) {
            for(let deckIndex = 0;deckIndex < this.decks.length;deckIndex++) {
                this.randedDecks[deckIndex][deckCardIndex] = this.randedCards[cardIndex]
                cardIndex++
            }
        }
        this.decks = this.randedDecks
        this.resetRandVariables()
    }
    randCards() {
        while(this.randCardLength < 21) {
            let randedIndex = Math.floor(Math.random() * 21);
            if(this.randedCards.includes(this.cards[randedIndex]) === false) {
                this.randedCards.push(this.cards[randedIndex])
                this.randCardLength++
            }
        }
        this.setCards(this.randedCards)
        this.randDecks()
    }
    resetRandVariables() {
        this.randedCards = [];
        this.randedDecks = [[], [], []];
    }
}

// INTERFACE
/* elements */
const startBtn = document.getElementById('startBtn')
const confirmBtnsContainer = document.getElementById('confirmBtnsContainer')
const yesBtn = document.getElementById('yesBtn')
const noBtn = document.getElementById('noBtn')
const decksContainer = document.getElementById('decksContainer')
const decks = document.getElementsByClassName('deck')
/* animations functions */
class ProgramAnimations {
    constructor(startBtn, confirmBtnsContainer, yesBtn, noBtn, decksContainer, decks) {
        this.startBtn = startBtn
        this.confirmBtnsContainer = confirmBtnsContainer
        this.yesBtn = yesBtn
        this.noBtn = noBtn
        this.decksContainer = decksContainer
        this.decks = decks
    }
    collapse() {
        this.decksContainer.setAttribute('class', 'collapseAble')
        this.decks.forEach(deck=>{
            deck.classList.toggle('collapse')
        })
    }
    down() {
        this.decksContainer.setAttribute('class', 'collapseAble downAble')
        this.decks.forEach(deck=>{
            deck.classList.toggle('down')
        })
    }
    shuffle(index) {
        const deck = this.decks[index]
        deck.classList.add('shuffle')
    }
    spread() {
        this.decksContainer.setAttribute('class', 'collapseAble spreadAble')
        this.decks.forEach(deck => {
            deck.classList.toggle('spread')
        })
    }
    toggleForwardBackward(index) {
        const deck = this.decks[index]
        deck.classList.toggle('forward')
    }
    toggleOpenClose(index) {
        const deck = this.decks[index]
        deck.classList.toggle('collapse')
    }
}
// ALGORITHMS & INTERFACE CONNECTION
const algorithms = new ProgramAlgorithms();
let sessionEnd = false;
let programEnd = false;
let sessionIndex = 1;
let noAnswer = 0;
let yesAnswer = 0;

function greeting() {
    alert("this is card guesser program. i will guess what card that you thought in less than 4 questions")
}
function session(deckIndex) {
    let decks = algorithms.decks[deckIndex];
    console.log(decks)
    let choices = '';
    decks.forEach((card, index) => {
        choices+=`${card}, `
    })
    let answer = confirm(`do your card exists between these cards \n ${choices}`)
    answerHandler(answer, deckIndex)
}
function answerHandler(answer, deckIndex) {
    if(!answer && noAnswer+1 === 3) {
        sessionRestart();
    } else {
        if(answer)  {
            yesAnswer++
            algorithms.setMiddleCards(deckIndex);
            sessionEnd = true;
        } else {
            noAnswer++
            algorithms.setEdgeCards(deckIndex);
        }
    }
}
function resetSessionVariable() {
    noAnswer = 0;
}
function sessionRestart() {
    let confirmation = confirm("hmmm... this can't be possible maybe you should pay more attention to the choices. Restart session?")
    if(confirmation) {
        resetSessionVariable()
        sessionStart()
    }
}
function sessionStart() {
    let deckIndex = 0;
    while(sessionEnd === false) {
        console.log(sessionEnd)
        session(deckIndex)
        deckIndex++
    }
    continueOrEnd()
}
function continueOrEnd() {
    sessionIndex++
    resetSessionVariable()
    algorithms.randDecks()
    if(sessionIndex === 4) {
        programEnd = true;
        getResult();
    }
    else {
        sessionEnd = false;
        sessionStart();
    }
}
function getResult() {
    alert(`your card is...${algorithms.decks[1][3]}`)
    sessionEnd = true;
}
const sleep = ms =>{
    return new Promise(resolve => {
        setTimeout(resolve, ms)
    })
}
async function programStart() {
    await (async ()=>{
        return sleep(500).then(
            algorithms.randCards()
        )
    })();
    greeting();
    sessionStart();
}
programStart()
