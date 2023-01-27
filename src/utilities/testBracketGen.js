/* eslint-disable */
var bracket = getBracket(16);
console.log("old", bracket);

// cleanBracket(bracket);

function getBracket(participants) {
    var participantsCount = participants;
    var rounds = Math.ceil(Math.log(participantsCount) / Math.log(2));
    var bracketSize = Math.pow(2, rounds);
    var requiredByes = participantsCount % 4;

    console.log(`Number of participants: ${participantsCount}`);
    console.log(`Number of rounds: ${rounds}`);
    console.log(`Bracket size: ${bracketSize}`);
    console.log(`Required number of byes: ${requiredByes}`);

    if (participantsCount < 2) {
        return [];
    }

    var matches = [[1, 2]];

    for (var round = 1; round < rounds; round++) {
        var roundMatches = [];
        var sum = Math.pow(2, round + 1) + 1;

        for (var i = 0; i < matches.length; i++) {
            var home = changeIntoBye(matches[i][0], participantsCount);
            var away = changeIntoBye(sum - matches[i][0], participantsCount);
            roundMatches.push([home, away]);
            home = changeIntoBye(sum - matches[i][1], participantsCount);
            away = changeIntoBye(matches[i][1], participantsCount);
            roundMatches.push([home, away]);
        }
        matches = roundMatches;
    }

    return matches;
}

function changeIntoBye(seed, participantsCount) {
    //return seed <= participantsCount ?  seed : '{0} (= bye)'.format(seed);
    return seed <= participantsCount ? seed : null;
}

// my attempt at cleaning the bracket of the weird seeding issues
function cleanBracket(bracket) {
    const numberOfTeams = 5;
    // const numberOfGames = numberOfTeams - 1;

    let newBracket = [];

    let iterator = 0;
    let numberOfByes = numberOfTeams % 4;
    while (iterator < 5) {
        if (bracket[iterator][0] === null || (bracket[iterator][1] === null && numberOfByes > 0)) {
            // create new Game
            newBracket.push([bracket[iterator][0], bracket[iterator][1]]);
            numberOfByes--;
        } else if (bracket[iterator][1] === null) {
            for (let x = iterator; x < bracket.length; x++) {
                if (bracket[x][0] === null && bracket[x][1] !== null) {
                    newBracket.push([bracket[iterator][0], bracket[x][1]]);
                    bracket.splice(x, 1);
                    // bracket[iterator][1]
                    // bracket[x][0]
                    // create new game
                    // console.log("bracket", bracket);
                    break;
                }
            }
        } else {
            newBracket.push([bracket[iterator][0], bracket[iterator][1]]);
            // bracket[iterator][0]
            // bracket[iterator][1]
            // create new game
        }

        bracket[0];
        iterator++;
    }

    console.log(newBracket);
}
