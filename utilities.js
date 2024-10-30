
module.exports = {
	printNames: function(players) {
        players.forEach(player => {
            console.log(`${player.first_name} ${player.last_name}`);
        });
    },
    finalList: function(list, playerSet, position) {
        for (let i = 0; i < 15; i++) {
			list.push(playerSet[i]);
        }
        const sorted = list.sort((a, b) => a.cost - b.cost);
        return sorted
    },
    formatPrint: function(players, position){
        console.log('******************');
        console.log('******************');
        for (let i = 0; i < players.length; i++) {
            const p = players[i];

            // Skip if p.first_name is undefined
            if (!p?.first_name) {
                continue;
            }

            const formatted = {
                position,
                name: `${p.first_name} ${p.last_name}`,
                cost: p.cost,
                last_match_points: p.stats.last_match_points,
                last_3_avg: p.stats.last_3_avg,
                last_5_avg: p.stats.last_5_avg,
                avg: p.stats.avg_points,
                total_points: p.stats.total_points,
                games_played: p.stats.games_played,
                season_rank: p.stats.season_rank,
                owned_by: `${p.stats.owned_by}%`,
            };

            console.log('--------------');
            console.log(formatted);
            console.log('--------------');
        }

        console.log('******************');
        console.log('******************');
    },
    parse_lineups: function(s) {
        const names_array = [];
        // Split by the occurrence of 'Expected Lineup'
        const expected_lineups = s.split('Expected Lineup');

        // Iterate over each segment that potentially contains player info
        for (let i = 1; i < expected_lineups.length; i++) {
            // Limit to the portion before 'Injuries' to exclude injured players
            const starters = expected_lineups[i].split('Injuries')[0];

            // Use a regex to find all 'title' attributes containing player names
            const regex = /title="([^"]+)"/g;
            let match;

            // Iterate through all matches found in the current lineup section
            while ((match = regex.exec(starters)) !== null) {
                const player_name = match[1];
                names_array.push(player_name);
            }
        }

        return names_array;
    }
};
