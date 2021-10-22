export default class ApprovalVoting {
  public proposal;
  public votes;
  public strategies;
  public selected;

  constructor(proposal, votes, strategies, selected) {
    this.proposal = proposal;
    this.votes = votes;
    this.strategies = strategies;
    this.selected = selected;
    if (!proposal.metadata.voting || proposal.metadata.calcByCount) {
      // legacy stuff, lets reshape the data
      this.votes &&
        Array.isArray(this.votes) &&
        this.votes.forEach(vote => {
          if (!Array.isArray(vote.msg.payload.choice)) {
            const choice = vote.msg.payload.choice + '';
            vote.msg.payload.choice = choice.split('-').map(i => +i);
          }
        });
    }
  }

  resultsByVoteBalance() {
    return this.proposal.choices.map((choice, i) =>
      this.votes
        .filter((vote: any) => vote.msg.payload.choice.indexOf(i + 1) > -1)
        .reduce((a, b: any) => a + b.balance, 0)
    );
  }

  resultsByStrategyScore() {
    return this.proposal.choices.map((choice, i) =>
      this.strategies.map((strategy, sI) =>
        this.votes
          .filter((vote: any) => vote.msg.payload.choice.indexOf(i + 1) > -1)
          .reduce((a, b: any) => a + b.scores[sI], 0)
      )
    );
  }

  sumOfResultsBalance() {
    return this.votes.reduce((a, b: any) => a + b.balance, 0);
  }

  getChoiceString() {
    return this.proposal.choices
      .filter((choice, i) => this.selected.indexOf(i + 1) > -1)
      .join(', ');
  }
}
