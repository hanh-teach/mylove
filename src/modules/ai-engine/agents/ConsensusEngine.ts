export class ConsensusEngine {
  public static reachConsensus(options: any[], votes: Record<string, string>): any {
    console.log(`[ConsensusEngine] CONSENSUS_STARTED with ${options.length} options`);
    // Basic majority vote logic
    const voteCounts: Record<string, number> = {};
    for (const voter in votes) {
      const optionId = votes[voter];
      voteCounts[optionId] = (voteCounts[optionId] || 0) + 1;
    }

    let winner = options[0]; // default to first option
    let maxVotes = -1;
    for (const option of options) {
      if (voteCounts[option.id] > maxVotes) {
        maxVotes = voteCounts[option.id];
        winner = option;
      }
    }

    console.log(`[ConsensusEngine] CONSENSUS_FINISHED. Winner: ${winner.id}`);
    return winner;
  }
}
