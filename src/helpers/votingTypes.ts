const VOTING_TYPES = {
  selectVoting: 'Select voting system',
  'single-choice': 'Single choice voting',
  approval: 'Approval voting',
  quadratic: 'Quadratic voting',
  'ranked-choice': 'Ranked choice voting',
  weighted: 'Weighted voting',
  description: {
    'single-choice': 'Each voter may select only one choice.',
    approval: 'Each voter may select any number of choices.',
    quadratic: `Each voter may spread voting power across any number of choices. Results are calculated quadratically.`,
    'ranked-choice':
      'Each voter may select and rank any number of choices. Results are calculated by instant-runoff counting method.',
    weighted: 'Each voter may spread voting power across any number of choices.'
  }
};
export default VOTING_TYPES;
