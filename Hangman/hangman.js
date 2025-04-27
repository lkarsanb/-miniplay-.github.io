import { supabase } from '../helper.js';

//Update user score in database and in right corner.
async function updateScore() {
    const { data: { user } } = await supabase.auth.getUser();
    const statusText = document.getElementById("userStatus");

    //Get user's current score.
    if (user) {
        const { data, error } = await supabase
        .from('Leaderboard')
        .select('score')
        .eq('UID', user.id); //Getting score based on user's ID.

        //There was an error getting current score.
        if (error) {
            console.error('Error fetching user data:', error);
        }

        //Otherwise, update the user's score.
        else {
            let newScore = data[0].score; 
            newScore++; //Increment current score.

            //If the user exists, then update their score in the database.
            if (user) {
                const { data, error } = await supabase
                .from('Leaderboard')
                .update({ score: newScore })
                .eq('UID', user.id);

                //There was an error updating the score.
                if (error) {
                    console.error('Error updating score:', error);
                }
            }
        }
    }
}

//Get initial user score from the database.
async function getScore() {
    const { data: { user } } = await supabase.auth.getUser();
    const statusText = document.getElementById("userStatus");

    //If the user exists, then get their score from the database (using their user id).
    if (user) {
        const { data, error } = await supabase
        .from('Leaderboard')
        .select('score')
        .eq('UID', user.id);

        //If there was an error, display to console.
        if (error) {
            console.error('Error fetching user data:', error);

        //Otherwise, display new score on page.
        } else {
            userScore.innerHTML = String(data[0].score);
        }
    } else {
        console.log("No user signed in.");
        userScore.innerHTML = "0";
    }
}


const hangmanImage = document.querySelector(".stand img");
const wordDisplay = document.querySelector(".word-display");
const guessedText = document.querySelector(".guesses-text b");
const keyboardDiv = document.querySelector(".keyboard");
const gameModel = document.querySelector(".game-model");
const playAgainBtn = document.querySelector(".play-again");
const userScore = document.getElementById('user-score');

let currentWord, correctLetters, wrongGuessCount = 0;
const maxGuesses = 6;
getScore()


// Reset game to allow user to play again.
const resetGame = () => {
    correctLetters = [];
    wrongGuessCount = 0;
    hangmanImage.src = `Images/stand.png`
    guessedText.innerText = `${wrongGuessCount} / ${maxGuesses}`;
    keyboardDiv.querySelectorAll("button").forEach(btn => btn.disabled = false);
    wordDisplay.innerHTML = currentWord.split("").map(() => `<li class="letter"></li>`).join("");
    getScore();
    gameModel.classList.remove("show");
}

// Select a random word from wordList.js.
const getRandomWord = () => {
    const {word,hint} = wordList[Math.floor(Math.random() * wordList.length)];
    currentWord = word;
    document.querySelector(".hint-text b").innerText = hint;
    resetGame();
}

// Display something based on if user wins or loses.
const gameOver = (isVictory) => {
    setTimeout(() => {
        const modalText = isVictory ? `You found the word: ` : `The correct word was: `;
        gameModel.querySelector("img").src = `Images/${isVictory ? 'win.jpg' : 'lost.png'}`;
        gameModel.querySelector("h4").innerText = `${isVictory ? 'Congrats!' : 'Nice Try!'}`;
        gameModel.querySelector("p").innerHTML = `${modalText} <b>${currentWord}</b>`;
        gameModel.classList.add("show");
    }, 300);
}

// See if the selected letter is in the word.
const initGame = (button, clickedLetter) => {
    // If the letter is in the word, show it in the answer and add letter to list.
    if(currentWord.includes(clickedLetter)) {
        [...currentWord].forEach((letter, index) => {
            if(letter === clickedLetter) {
                correctLetters.push(letter);
                wordDisplay.querySelectorAll("li")[index].innerText = letter;
                wordDisplay.querySelectorAll("li")[index].classList.add("guessed");
            }
        });
    } 

    // Otherwise, if incorrect letter is guessed, increment incorrect answer count and update hangman image.
    else {
        wrongGuessCount++;
        hangmanImage.src = `Images/${wrongGuessCount}.png`
    }

    button.disabled = true;
    guessedText.innerText = `${wrongGuessCount} / ${maxGuesses}`;

    // Call gameOver with true or false based on if user guessed the word or not.
    if (wrongGuessCount === maxGuesses) return gameOver(false);
    if (correctLetters.length === currentWord.length) {
        // Increment total score count.
        updateScore();
        return gameOver(true);
    }


}


// Create the letters buttons.
for (let i = 97; i <= 122; i++) {
    const button = document.createElement("button");
    button.innerText = String.fromCharCode(i);
    keyboardDiv.appendChild(button);

    // Add an event when the button is clicked.
    button.addEventListener("click", e => initGame(e.target, String.fromCharCode(i)));
}

// Generate the random word.
getRandomWord();
playAgainBtn.addEventListener("click", getRandomWord);
