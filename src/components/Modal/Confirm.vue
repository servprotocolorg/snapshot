<script setup>
import VOTING_TYPES from '@/helpers/votingTypes';
import { getChoiceString } from '@/helpers/utils';
const format = getChoiceString;
</script>
<template>
  <UiModal :open="open" v-if="open" @close="$emit('close')" class="d-flex">
    <template v-slot:header>
      <h3>Confirm vote</h3>
    </template>
    <div class="d-flex flex-column flex-auto">
      <h4
        class="m-4 mb-0 text-center"
        v-if="proposal.msg.payload.metadata.voting"
      >
        Voting using
        {{ `${VOTING_TYPES[proposal.msg.payload.metadata.voting]}` }}
      </h4>
      <h4 class="m-4 mb-0 text-center">
        Are you sure you want to vote
        {{
          selectedChoiceSet.length === 1
            ? '"' + format(proposal.msg.payload, selectedChoices) + '"'
            : 'them'
        }}? <br />This action <b>cannot</b> be undone.
      </h4>
      <div class="m-4 p-4 border rounded-2 text-white">
        <div class="d-flex">
          <span v-text="'Option'" class="flex-auto text-gray mr-1" />
          {{ format(proposal.msg.payload, selectedChoices) }}
        </div>
        <div class="d-flex">
          <span v-text="'Snapshot'" class="flex-auto text-gray mr-1" />
          <a
            :href="
              _explorer(space.network, proposal.msg.payload.snapshot, 'block')
            "
            target="_blank"
            class="float-right"
          >
            {{ proposal.msg.payload.snapshot }}
            <Icon name="external-link" class="ml-1" />
          </a>
        </div>
        <div class="d-flex" v-if="isCalcByCount">
          <span v-text="'Your voting count'" class="flex-auto text-gray mr-1" />
          <span class="tooltipped tooltipped-nw">
            {{ selectedChoiceSet.length }} Vote
          </span>
        </div>
        <div class="d-flex" v-else>
          <span v-text="'Your voting power'" class="flex-auto text-gray mr-1" />
          <span
            class="tooltipped tooltipped-nw"
            :aria-label="
              scores
                .map((score, index) => `${_numeral(score)} ${symbols[index]}`)
                .join(' + ')
            "
          >
            {{ _numeral(scores.reduce((a, b) => a + b, 0)) }}
            {{ _shorten(space.symbol, 'symbol') }}
          </span>
        </div>
      </div>
    </div>
    <template v-slot:footer>
      <div class="col-6 float-left pr-2">
        <UiButton @click="$emit('close')" type="button" class="width-full">
          Cancel
        </UiButton>
      </div>
      <div class="col-6 float-left pl-2">
        <UiButton
          :disabled="loading"
          :loading="loading"
          @click="handleSubmit"
          type="submit"
          class="width-full button--submit"
        >
          Vote
        </UiButton>
      </div>
    </template>
  </UiModal>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  props: [
    'open',
    'space',
    'proposal',
    'id',
    'selectedChoice',
    'selectedChoices',
    'snapshot',
    'totalScore',
    'scores'
  ],
  emits: ['reload', 'close'],
  data() {
    return {
      loading: false
    };
  },
  computed: {
    choices() {
      return this.proposal.msg.payload.choices;
    },
    symbols() {
      return this.space.strategies.map(strategy => strategy.params.symbol);
    },
    isDao() {
      return ['dao-mainnet', 'dao-testnet'].indexOf(this.space.key) > -1;
    },
    isCalcByCount() {
      return (
        this.isDao ||
        this.app.harmonyDaoSpace.indexOf(this.space.key) > -1 ||
        this.proposal.msg.payload.metadata.calcByCount
      );
    },
    selectedChoiceSet() {
      if (
        Array.isArray(this.selectedChoices) &&
        this.selectedChoices?.length > 0
      ) {
        return this.selectedChoices;
      } else if (typeof this.selectedChoices === 'object') {
        return this.selectedChoices;
      }
      return this.selectedChoice.split('-');
    }
  },
  methods: {
    ...mapActions(['send']),
    async handleSubmit() {
      let choice = this.selectedChoice;
      if (!choice || choice.length === 0) {
        if (Array.isArray(this.selectedChoices)) {
          if (this.proposal.msg.payload.metadata.voting) {
            choice = this.selectedChoices;
          } else {
            choice = this.selectedChoices.join('-');
          }
        } else if (typeof this.selectedChoices === 'object') {
          choice = this.selectedChoices;
        } else {
          choice = this.selectedChoices;
        }
      }
      this.loading = true;
      await this.send({
        space: this.space.key,
        type: 'vote',
        payload: {
          proposal: this.id,
          choice: choice,
          metadata: {}
        }
      });
      this.$emit('reload');
      this.$emit('close');
      this.loading = false;
    }
  }
};
</script>
