import { supabase } from '/helper.js';



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


const userScore = document.getElementById('user-score');
getScore();

async function displayLeaderboard() {
    const leaderboardData = await supabase
        .from('Leaderboard')
        .select('*')
        .order('score', { ascending: false })
        .limit(5);

    console.log('Leaderboard Data:', leaderboardData); // Debugging line
    if (!leaderboardData || !leaderboardData.data) {
        console.error('Leaderboard data is null or undefined.');
        return; // Exit the function early to avoid further errors
    }

    // Define leaderboardTable
    const leaderboardTable = document.getElementById('Leaderboard');
    console.log('Leaderboard Data:', leaderboardData);
    console.log('Data:', leaderboardData.data);
    if (!leaderboardTable) {
        console.error('Element with id "Leaderboard" does not exist in the DOM.');
        return; // Safeguard if element is not in the DOM
    }

    leaderboardTable.innerHTML = ''; // Clear existing table content

    // Create table header
    const headerRow = document.createElement('tr');
    headerRow.innerHTML = '<th>Rank</th><th>Username</th><th>Score</th>';
    leaderboardTable.appendChild(headerRow);

    // Populate table rows
    leaderboardData.data.forEach((entry, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${index + 1}</td><td>${entry.username}</td><td>${entry.score}</td>`;
        leaderboardTable.appendChild(row);
    });
}

console.log(typeof displayLeaderboard); // Should log "function"
window.displayLeaderboard = displayLeaderboard;
export { displayLeaderboard };
