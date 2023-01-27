/* eslint-disable vars-on-top */
/* eslint-disable no-restricted-properties */
/* eslint-disable prefer-exponentiation-operator */
/* eslint-disable no-var */
export function getBracket(participants: number[]) {
    var participantsCount = participants.length;
    var rounds = Math.ceil(Math.log(participantsCount) / Math.log(2));
    var bracketSize = Math.pow(2, rounds);
    var requiredByes = bracketSize - participantsCount;

    console.log(`Number of participants: ${participantsCount}`);
    console.log(`Number of rounds: ${rounds}`);
    console.log(`Bracket size: ${bracketSize}`);
    console.log(`Required number of byes: ${requiredByes}`);

    if (participantsCount < 2) {
        return [];
    }

    var matches: any = [[1, 2]];
    for (var round = 1; round < rounds; round++) {
        var roundMatches = [];
        var sum = Math.pow(2, round + 1) + 1;
        // console.log("sum", sum);
        // console.log("round", round);

        for (var i = 0; i < matches.length; i++) {
            // console.log("i", i);

            var home = changeIntoBye(matches[i][0], participantsCount);
            // console.log("home", home);

            var away = changeIntoBye(sum - matches[i][0], participantsCount);
            // console.log("away", away);

            roundMatches.push([home, away]);

            // console.log("roundMatches", roundMatches);

            home = changeIntoBye(sum - matches[i][1], participantsCount);
            away = changeIntoBye(matches[i][1], participantsCount);

            // console.log("homesecond", home);
            // console.log("awaysecond", away);
            roundMatches.push([home, away]);

            // console.log("roundMatchessecond", roundMatches);
        }
        matches = roundMatches;

        // console.log("matches", matches);
    }

    return matches;
}

function changeIntoBye(seed: number, participantsCount: number) {
    // return seed <= participantsCount ?  seed : '{0} (= bye)'.format(seed);
    return seed <= participantsCount ? seed : null;
}

// console.log(getBracket([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]));
