
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
        players.forEach(p => {
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
				owned_by: p.stats.owned_by,
            };
            console.log('--------------');
            console.log(formatted)
            console.log('--------------');
        })
        console.log('******************');
        console.log('******************');
    },
    parse_lineups: function(s){
        const names_array = [];
		const expected_lineups = s.split('Expected Lineup');
		const n = expected_lineups.length;
		for (let i = 1; i < n; i++) {
			//n-1
			const starters = expected_lineups[i].split('Injuries')[0];
			const name_groups = starters.split('href="/soccer/player.php?id=');
			total_names = name_groups.length;
			for (let j = 0; j < total_names; j++) {
				//total_names
				const names = name_groups[j].split('title="');
				const names_with_closing_quote = names[1];
				if (names_with_closing_quote) {
					const final_name = names_with_closing_quote.split('"')[0];
					names_array.push(final_name);
				}
			}
        }
        return names_array;
    }
};
