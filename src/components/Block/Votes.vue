<template>
  <Block
    v-if="Object.keys(votes).length > 0"
    title="Votes"
    :counter="Object.keys(votes).length"
    :slim="true"
  >
    <div
      v-for="(vote, address, i) in visibleVotes"
      :key="i"
      :style="i === 0 && 'border: 0 !important;'"
      class="px-4 py-3 border-top d-flex"
    >
      <User
        :profile="vote.profile"
        :address="address"
        :space="space"
        :vname="
          validatorNames[address.toLowerCase()]
            ? validatorNames[address.toLowerCase()]
            : ''
        "
        class="column"
      />
      <div
        v-text="
          canMultiOptions
            ? getMultiChoice(vote.msg.payload.choice)
            : _shorten(
                proposal.msg.payload.choices[vote.msg.payload.choice - 1],
                'choice-long'
              )
        "
        class="flex-auto text-center text-white"
      />
      <div class="power-column text-right text-white">
        <span
          class="tooltipped tooltipped-n"
          :aria-label="
            vote.scores
              .map((score, index) => `${_numeral(score)} ${titles[index]}`)
              .join(' + ')
          "
        >
          <template v-if="isCalcByCount">
            {{ vote.voteCount.length || vote.voteCount }} Vote
          </template>
          <template v-else>
            {{
              `${_numeral(vote.balance)} ${_shorten(space.symbol, 'symbol')}`
            }}
          </template>
        </span>
        <a
          @click="openReceiptModal(vote)"
          target="_blank"
          class="ml-2 text-gray"
          title="Receipt"
        >
          <Icon name="signature" />
        </a>
      </div>
    </div>
    <a
      v-if="!showAllVotes && Object.keys(votes).length > 10"
      @click="showAllVotes = true"
      class="px-4 py-3 border-top text-center d-block bg-gray-dark rounded-bottom-0 rounded-md-bottom-2"
    >
      See more
    </a>
    <teleport to="#modal">
      <ModalReceipt
        :open="modalReceiptOpen"
        @close="modalReceiptOpen = false"
        :authorIpfsHash="authorIpfsHash"
        :relayerIpfsHash="relayerIpfsHash"
      />
    </teleport>
  </Block>
</template>

<script>
export default {
  props: ['space', 'proposal', 'votes', 'validatorNames'],
  data() {
    return {
      showAllVotes: false,
      authorIpfsHash: '',
      relayerIpfsHash: '',
      modalReceiptOpen: false,
      proposalOptions: this.proposal.msg.payload.choices
    };
  },
  computed: {
    visibleVotes() {
      return this.showAllVotes
        ? this.sortVotesUserFirst()
        : Object.fromEntries(
            Object.entries(this.sortVotesUserFirst()).slice(0, 10)
          );
    },
    titles() {
      return this.space.strategies.map(strategy => strategy.params.symbol);
    },
    isDao() {
      return ['dao-mainnet', 'dao-testnet'].indexOf(this.space.key) > -1;
    },
    canMultiOptions() {
      if (this.proposal.msg.payload.metadata.voting) {
        return true;
      }
      return (
        this.isDao || this.app.harmonyDaoSpace.indexOf(this.space.key) > -1
      );
    },
    isCalcByCount() {
      return (
        this.isDao ||
        this.app.harmonyDaoSpace.indexOf(this.space.key) > -1 ||
        this.proposal.msg.payload.metadata.calcByCount
      );
    },
    voteResult() {
      if (this.canMultiOptions) {
        const result = [];
        // re-cal vote power by count of choice
        for (const address in this.votes) {
          const vote = this.votes[address];
          if (Array.isArray(vote.msg.payload.choice)) {
            vote.voteCount = vote.msg.payload.choice;
          } else if (typeof vote.msg.payload.choice === 'object') {
            vote.voteCount = Object.keys(vote.msg.payload.choice);
          } else {
            vote.voteCount = String(vote.msg.payload.choice).split('-').length;
          }
          result.push(vote);
        }
        return result;
      } else {
        return this.votes;
      }
    }
  },
  methods: {
    openReceiptModal(vote) {
      this.authorIpfsHash = vote.authorIpfsHash;
      this.relayerIpfsHash = vote.relayerIpfsHash;
      this.modalReceiptOpen = true;
    },
    sortVotesUserFirst() {
      if (Object.keys(this.voteResult).includes(this.web3.account)) {
        const {
          [[this.web3.account]]: firstKeyValue,
          ...rest
        } = this.voteResult;
        return {
          [[this.web3.account]]: firstKeyValue,
          ...rest
        };
      }
      return this.votes;
    },
    getMultiChoice(choice) {
      let choices = choice;
      if (typeof choice === 'string' || typeof choice === 'number') {
        choices = String(choice).split('-');
      } else if (!Array.isArray(choice) && typeof choice === 'object') {
        // we want the keys
        choices = Object.keys(choice);
      }
      const result = [];
      for (const choice in choices) {
        result.push(this.proposalOptions[choices[choice] - 1]);
      }
      return result.join(' / ');
    }
  }
};
</script>
