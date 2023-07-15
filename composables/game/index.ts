export function identTotalScore(results: Result[]) {
  const roundsSet = new Set<number>(results.map(r => r.round).reverse());
  const resultPerRound: Record<string, Result[]> = {};

  roundsSet.forEach((r, i) => {
    resultPerRound[i] = results.filter(rd => rd.round === r);
  });

  return resultPerRound;
}

export function getTotalScorePlayers(results: Record<string, Result[]>, handCardsPerPlayer: HandCardsPerPlayer[]){
  const totalScorePlayer = [] as TotalScorePlayer[];
  const playersData = [] as Result[];
  let allResults = [] as Result[];

  Object.values(results)
    .forEach(r => {
      allResults = [...allResults, ...r] as Result[];
    });

  const idPlayersSet = new Set(
    allResults.map(ar => ar.idPlayer)
  );

  for (let result of allResults) {
    idPlayersSet.forEach(idPlayer => {
      if(result.idPlayer === idPlayer){
        if(!playersData.some(pd => pd.idPlayer === idPlayer)){
          playersData.push(result);
        }
      }
    });
  }

  playersData.forEach(player => {
    const totalScore =
      allResults.filter(ar => player.idPlayer === ar.idPlayer)
        .map(ar => ar.score)
        .reduce((t, ar) => ar + t, 0);

    totalScorePlayer.push({
      totalScore,
      idPlayer: player.idPlayer,
      playerName: player.playerName,
      scoreHand: 0
    });
  });

  totalScorePlayer.forEach(tsp => {
    const player = handCardsPerPlayer.find(p => p.idPlayer === tsp.idPlayer);

    if(player){
      tsp.scoreHand = player.handCards.reduce((t, c) => c.points + t, 0);
      tsp.totalScore += tsp.scoreHand;
    }
  });

  return totalScorePlayer.sort((a, b) => {
    if(a.totalScore < b.totalScore) return 1;
    else if(a.totalScore > b.totalScore) return -1;

    return 0;
  });
}