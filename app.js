const fs = require('fs');
const fetch = require('node-fetch');
const helpers = require('./utilities')

async function parse_lineups() {
	const lineups_data = await fetch(
		'https://www.rotowire.com/soccer/lineups.php?league=MLS'
	);
	const page = await lineups_data.text()
	const names_array = helpers.parse_lineups(page);
	return names_array;
}

async function run() {
	const player_data_fetched = await fetch(
		'https://fgp-data-us.s3.us-east-1.amazonaws.com/json/mls_mls/players.json?_=1645852334374'
	)
	const player_data = await player_data_fetched.json();	
	const players_starting = await parse_lineups();
	const playersPlaying = player_data.filter((player) => {
		return player.status === 'playing';
	});

	const eligible_players = []
	for(let i = 0; i < playersPlaying.length; i++){
		const fullName = `${playersPlaying[i].first_name} ${playersPlaying[i].last_name}`;
		const isStarting = players_starting.includes(fullName);
		if(isStarting){
			eligible_players.push(playersPlaying[i]);
		}
	}

	//sorts all players by last 3 fantasy points average
	const sortedPlayersByForm = eligible_players.sort(
		(a, b) => b.stats.last_3_avg - a.stats.last_3_avg
	);

	//now break up players into positions
	const goalkeepers = sortedPlayersByForm.filter((player) => {
		return player.positions.includes(1);
	});

	const defenders = sortedPlayersByForm.filter((player) => {
		return player.positions.includes(2);
	});

	const midfielders = sortedPlayersByForm.filter((player) => {
		return player.positions.includes(3);
	});

	const forwards = sortedPlayersByForm.filter((player) => {
		return player.positions.includes(4);
	});

	//stores top 10 players of each position sorted lowest to highest price
	const topForwardsSortedByPrice = helpers.finalList([], forwards);
	const topMidfieldersSortedByPrice = helpers.finalList([], midfielders);
	const topDefendersSortedByPrice = helpers.finalList([], defenders);
	const topKeepersSortedByPrice = helpers.finalList([], goalkeepers);

	helpers.formatPrint(topForwardsSortedByPrice, 'FWD');
	helpers.formatPrint(topMidfieldersSortedByPrice, 'MID');
	helpers.formatPrint(topDefendersSortedByPrice, 'DEF');
	helpers.formatPrint(topKeepersSortedByPrice, 'GK');
}

run();
