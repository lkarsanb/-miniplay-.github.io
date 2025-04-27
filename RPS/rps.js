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
    } else {
        userScore.innerHTML = String(score);
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

const computerChoiceDisplay = document.getElementById('computer-choice');
const userChoiceDisplay = document.getElementById('user-choice');
const resultDisplay = document.getElementById('result');
const possibleChoices = document.querySelectorAll('button');
const userPointDisplay = document.getElementById('user-point');
const computerPointDisplay = document.getElementById('computer-point');
const userScore = document.getElementById('user-score');


let userChoice;
let computerChoice;
let result;
let userPoint = 0;
let computerPoint = 0;
let score = 0;

//Display user's initial score.
getScore();
//Click event listener for each button
possibleChoices.forEach(possibleChoice => possibleChoice.addEventListener('click', (e) => {
  
  //Display before animation
  computerChoiceDisplay.innerHTML = '...';

  //lock button after click
  disableButtons();
  
  //button click event
  if (e.target.tagName === 'IMG') {
    userChoice = e.target.parentElement.id; 
  } else {
    userChoice = e.target.id;
  }


  userChoiceDisplay.innerHTML = userChoice;
  generateComputerChoice();
  triggerAnimation(userChoice,computerChoice);
  getResult();

}))

// Function to generate computer choice
window.generateComputerChoice = function generateComputerChoice() {
  window.randomNumber = Math.floor(Math.random() * 3) + 1;

  if (randomNumber === 1) {
    computerChoice = 'rock';
  }
  else if (randomNumber === 2) {
    computerChoice = 'scissors';
  }
  else if (randomNumber === 3) {
    computerChoice = 'paper';
  }
  //Display computer choice

  setTimeout(() => {
  computerChoiceDisplay.innerHTML = computerChoice;
  }, 2800); // Show after 2.8 seconds
}


// Function to get the result of the game
function getResult() {
  if (computerChoice === userChoice) {
    result = 'its a draw!'

  }
  if (computerChoice === 'rock' && userChoice === "paper") {
    result = 'you win!'
    userPoint++;
  }
  if (computerChoice === 'rock' && userChoice === "scissors") {
    result = 'you lost!'
    computerPoint++;
  }
  if (computerChoice === 'paper' && userChoice === "scissors") {
    result = 'you win!'
    userPoint++;
  }
  if (computerChoice === 'paper' && userChoice === "rock") {
    result = 'you lose!'
    computerPoint++;
  }
  if (computerChoice === 'scissors' && userChoice === "rock") {
    result = 'you win!'
    userPoint++;
  }
  if (computerChoice === 'scissors' && userChoice === "paper") {
    result = 'you lose!'
    computerPoint++;
  }

  setTimeout(() => {
  userPointDisplay.innerHTML = String(userPoint);
  computerPointDisplay.innerHTML = String(computerPoint);
  }, 2800); // Show after 2.8 seconds

  if (userPoint === 3){
    setTimeout(() => {
    alert("You win the game!")
    userPoint = 0;
    computerPoint = 0;
    score++;
  
    userPointDisplay.innerHTML = String(userPoint);
    computerPointDisplay.innerHTML = String(computerPoint);

    //Since the user won, update their score in database.
    updateScore(); 
    }, 3000); // Show after 3 seconds
  }
  
  else if (computerPoint === 3){
    setTimeout(() => {
    alert("You lose the game!")
    userPoint = 0;
    computerPoint = 0;
    userPointDisplay.innerHTML = String(userPoint);
    computerPointDisplay.innerHTML = String(computerPoint);
    userScore.innerHTML = String(score);
    }, 3000); // Show after 3 seconds
  }
}

window.triggerAnimation = function triggerAnimation(userChoice,computerChoice){
  if (userChoice === 'rock' || userChoice === 'paper' || userChoice === 'scissors'){
    let images = document.querySelectorAll(".initial_computer img");

    // Loop through each image to trigger the animation
    images.forEach(img => {
      //start the animation
      img.style.visibility = "visible";

      // Remove the animation class to reset it
      img.style.animation = 'none';
      void img.offsetWidth;
      img.style.animation = ''; 
    });

    let image = document.querySelectorAll(".initial_player img");

    // Loop through each image to trigger the animation
    image.forEach(img => {
      // Make the image visible to start the animation
      img.style.visibility = "visible";

      // Remove the animation class to reset it
      img.style.animation = 'none'; 
      void img.offsetWidth; 
      img.style.animation = ''; 
    });
    
    
    let scissor_hand_c = document.querySelectorAll(".scissor_computer img");
    let paper_hand_c = document.querySelectorAll(".paper_computer img");
    let scissor_hand_p = document.querySelectorAll(".scissor_player img");
    let paper_hand_p = document.querySelectorAll(".paper_player img");

    // Hide all images initially
    scissor_hand_c.forEach(img => {
      img.style.visibility = "hidden"; 
    });
    paper_hand_c.forEach(img => {
      img.style.visibility = "hidden"; 
    });

    scissor_hand_p.forEach(img => {
      img.style.visibility = "hidden"; 
    } );
    paper_hand_p.forEach(img => {
      img.style.visibility = "hidden"; 
    });


    if (computerChoice === 'scissors'){
      setTimeout(() => {
        scissor_hand_c.forEach(img => {
          img.style.visibility = "visible";
          img.style.animation = 'none'; // Remove animation
          void img.offsetWidth; // Trigger a reflow to restart animation
          img.style.animation = ''; // Re-add animation
        });
      }, 2800); // Show after 2.8 seconds
      hideTriggerHand(); // Hide scissors after 2.8 seconds
    }
    else if (computerChoice === 'paper'){
      setTimeout(() => {
        paper_hand_c.forEach(img => {
          img.style.visibility = "visible";
          img.style.animation = 'none'; // Remove animation
          void img.offsetWidth; // Trigger a reflow to restart animation
          img.style.animation = ''; // Re-add animation
        });
      }, 2800); // Show after 2.8 seconds
      hideTriggerHand(); // Hide scissors after 2.8 seconds
    }

    // Show after 2.8 seconds
    if (userChoice === 'scissors'){
      setTimeout(() => {
        scissor_hand_p.forEach(img => {
          img.style.visibility = "visible";
          img.style.animation = 'none'; // Remove animation
          void img.offsetWidth; // Trigger a reflow to restart animation
          img.style.animation = ''; // Re-add animation
        });
      }, 2800);
      hideTriggerHand2(); // Hide scissors after 2.8 seconds
    }
    else if (userChoice === 'paper'){

      // Show paper after 2.8 seconds
      setTimeout(() => {
        paper_hand_p.forEach(img => {
          img.style.visibility = "visible";

          img.style.animation = 'none'; // Remove animation
          void img.offsetWidth; // Trigger a reflow to restart animation
          img.style.animation = ''; // Re-add animation
        });
      }, 2800);
      hideTriggerHand2(); // Hide scissors after 2.8 seconds
    }
  }
}

function hideTriggerHand(){
  let hand = document.querySelectorAll(".initial_computer img");

  setTimeout(() => {
    hand.forEach(img => {
      // Make the image visible to start the animation
      img.style.visibility = "hidden";

      img.style.animation = 'none'; // Remove animation
      void img.offsetWidth; // Trigger a reflow to restart animation
      img.style.animation = ''; // Re-add animation
    });
  }, 2800); // Hide after 2.8 seconds
}

function hideTriggerHand2(){
  let hand2 = document.querySelectorAll(".initial_player img");

  setTimeout(() => {
    hand2.forEach(img => {
      // Make the image visible to start the animation
      img.style.visibility = "hidden";

      img.style.animation = 'none'; // Remove animation
      void img.offsetWidth; // Trigger a reflow to restart animation
      img.style.animation = ''; // Re-add animation
    });
  }, 2800); // Hide after 2.8 seconds
}

//Disable button after click
function disableButtons() {
  possibleChoices.forEach(button => {
    button.disabled = true;
  });

  //Enable buttons after 3 seconds
  setTimeout(() => {
    enableButtons(); 
  }, 3000); 
}

//enable button function
function enableButtons() {
  possibleChoices.forEach(button => {
    button.disabled = false;
  });
}
