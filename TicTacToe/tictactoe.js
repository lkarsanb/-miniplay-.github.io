import { supabase } from '/helper.js';

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


//Selecting all required elements
const selectBox = document.querySelector(".select-box"),
selectXBtn = selectBox.querySelector(".playerX"),
selectOBtn = selectBox.querySelector(".playerO"),
gameboard = document.querySelector(".board"),
allBox = document.querySelectorAll("section span"),
players = document.querySelector(".players"),
resultBox = document.querySelector(".result-box"),
wonText = resultBox.querySelector(".won-text"),
replayBtn = resultBox.querySelector("button");
const userScore = document.getElementById('user-score');

let userSign = "X";
getScore();


window.onload = ()=>{
    for (let i = 0; i < allBox.length; i++) {
        allBox[i].setAttribute("onclick", "clickedBox(this)");
    }

    selectXBtn.onclick = ()=> {
        selectBox.classList.add("hide"); //Hide selection box when X is selected.
        gameboard.classList.add("show"); //Show gameboard when X is selected.
    }

    selectOBtn.onclick = ()=> {
        selectBox.classList.add("hide"); //Hide selection box when O is selected.
        gameboard.classList.add("show"); //Show gameboard when O is selected.
        players.setAttribute("class", "players active player");
        userSign = "O";
    }
}

let playerXIcon = "fa fa-times";  //Fontawesome cross icon.
let playerOIcon = "far fa-circle"; //Fontawesome circle icon.
let playerSign = "X";
let runBot = true;


// User play
window.clickedBox = function clickedBox(element) {
    //Create the Xs and Os on the table.
    if(players.classList.contains("player")) {
        element.innerHTML = `<i class="${playerOIcon}"></i>`;
        players.classList.add("active");
        playerSign = "O";
        element.setAttribute("id", playerSign);
    }else {
        element.innerHTML = `<i class="${playerXIcon}"></i>`;
        players.classList.add("active");
        element.setAttribute("id", playerSign);
    }
    selectWinner();
    gameboard.style.pointerEvents = "none";  //User can only make play on their turn.
    element.style.pointerEvents = "none"; //Each box can only be selected once.
    let randomDelayTime = ((Math.random() * 1000) + 200).toFixed(); //Random time delay for when computer will make its play.
    setTimeout(()=>{
        bot(runBot);
    }, randomDelayTime);
}


// Computer play
function bot(runBot) {
    if (runBot){
        playerSign = "O";
        let array = []; //Create an empty array to store unselected boxes in.
        for (let i = 0; i < allBox.length; i++) {
            if(allBox[i].childElementCount == 0) {
                array.push(i);
                console.log(i + " " + "has no chidren");
            }
        }

        let randomBox = array[Math.floor(Math.random() * array.length)]; //Computer will select a random play.
        if(array.length > 0) {
            if(players.classList.contains("player")) {
                allBox[randomBox].innerHTML = `<i class="${playerXIcon}"></i>`;
                players.classList.remove("active");
                playerSign = "X";
                allBox[randomBox].setAttribute("id", playerSign);
            }else {
                allBox[randomBox].innerHTML = `<i class="${playerOIcon}"></i>`;
                players.classList.remove("active");
                allBox[randomBox].setAttribute("id", playerSign);
            }
            selectWinner();
        }
        allBox[randomBox].style.pointerEvents = "none"; //Box cannot be selected again once it is already selected.
        gameboard.style.pointerEvents = "auto"; //User can only make play on their turn.
        playerSign = "X";
    }
}

function getClass(idname) {
    return document.querySelector(".box" + idname).id;
}

function checkClass(val1, val2, val3, sign) {
    if(getClass(val1) == sign && getClass(val2) == sign && getClass(val3) == sign) {
        return true;
    }
}

function selectWinner() {
    //Possible winning combinations.
    if(checkClass(1,2,3,playerSign) || checkClass(4,5,6,playerSign) || checkClass(7,8,9,playerSign) || checkClass(1,4,7,playerSign) || checkClass(2,5,8,playerSign) || checkClass(3,6,9,playerSign) || checkClass(1,5,9,playerSign) || checkClass(3,5,7,playerSign)) {
        //Stop current game.
        runBot = false;
        bot(runBot);
        //Display result box.
        setTimeout(()=>{
            gameboard.classList.remove("show");
            resultBox.classList.add("show");
        }, 700);

        if (userSign == playerSign) {
            updateScore();
            
        }
        wonText.innerHTML = `Player <p>${playerSign}</p> won!`;

    // Otherwise there was a tie.
    } else {
        if (getClass(1) != "" && getClass(2) != "" && getClass(3) != "" && getClass(4) != "" && getClass(5) != "" && getClass(6) != "" && getClass(7) != "" && getClass(8) != "" && getClass(9) != "") {
            //Stop current game.
            runBot = false;
            bot(runBot);
            //Display result box.
            setTimeout(()=>{
                gameboard.classList.remove("show");
                resultBox.classList.add("show");
        }, 700);

        wonText.textContent = `Tie!`; 
        }
            
    }
}

replayBtn.onclick = ()=> {
    window.location.reload(); //Replay game by reloading page.   
}