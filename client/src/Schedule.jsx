import React from "react";

const Schedule = () => {
  class Game {
    constructor(team1, team2) {
      this.id = uuidv4();
      this.team1 = team1;
      this.team2 = team2;
    }

    get description() {
      return `${this.team1.join(" / ")} vs. ${this.team2.join(" / ")}`;
    }
  }

  class Round {
    constructor(roundNumber, games) {
      this.id = uuidv4();
      this.roundNumber = roundNumber;
      this.games = games;
    }

    gameDescriptions() {
      return this.games.map((game, index) => `Court ${index + 1}: ${game.description}`);
    }
  }

  function generateSchedule(numPlayers, numCourts, playerNames) {
    if (playerNames.length < numPlayers || numPlayers < 4) {
      console.error("Error: Not enough players or player names provided.");
      return [];
    }

    let gamesPerPlayer = numPlayers - 1;
    let schedule = [];
    let gamesCounter = new Array(numPlayers).fill(0);
    let teamHistory = new Set(); // Track teams by player indices
    let playerIndices = Array.from({ length: numPlayers }, (_, index) => index); // Work with player indices
    const maxGamesPlayed = Math.min(gamesPerPlayer, numPlayers - 1);

    while (Math.min(...gamesCounter) < maxGamesPlayed) {
      let roundGames = [];
      let usedPlayers = new Set();

      playerIndices.sort(() => Math.random() - 0.5); // Shuffle indices, not names

      // Sort player indices by the number of games played
      let priorityPlayers = playerIndices.slice().sort((a, b) => gamesCounter[a] - gamesCounter[b]);
      // number of games per round can't exceed the minimum of either the number of courts available or the number of players divided by 4
      let maxGamesPerRound = Math.min(numCourts, Math.floor(numPlayers / 4));

      for (let combo of combinations(priorityPlayers, 4)) {
        for (let teamIndexes of combinations(combo, 2)) {
          let remainingIndexes = combo.filter((index) => !teamIndexes.includes(index));

          // Ensure unique teams and that players aren't already used this round
          if (!teamHistory.has(teamIndexes) && !teamHistory.has(remainingIndexes.join())) {
            // Create a new Game with player names, not indices
            let newGame = new Game(
              teamIndexes.map((index) => playerNames[index]),
              remainingIndexes.map((index) => playerNames[index])
            );
            roundGames.push(newGame);

            // Update histories and counters
            teamHistory.add(teamIndexes.join());
            teamHistory.add(remainingIndexes.join());
            usedPlayers.add(...teamIndexes);
            usedPlayers.add(...remainingIndexes);
            teamIndexes.forEach((index) => gamesCounter[index]++);
            remainingIndexes.forEach((index) => gamesCounter[index]++);

            if (roundGames.length >= maxGamesPerRound) break;
          }
        }
        if (roundGames.length >= maxGamesPerRound) break;
      }

      if (roundGames.length >= maxGamesPerRound) {
        schedule.push(roundGames);
      } else {
        // If the round does not satisfy the conditions, reset team history so it can repeat a team to finish the round
        teamHistory.clear();
      }
    }

    return schedule;
  }

  function combinations(array, size) {
    let res = [];
    let temp = [];

    function backtracking(start) {
      if (temp.length === size) {
        res.push([...temp]);
        return;
      }

      for (let i = start; i < array.length; i++) {
        temp.push(array[i]);
        backtracking(i + 1);
        temp.pop();
      }
    }

    backtracking(0);
    return res;
  }

  // UUIDv4 generator function
  function uuidv4() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
      let r = (Math.random() * 16) | 0,
        v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
  return <div>Schedule</div>;
};

export default Schedule;
