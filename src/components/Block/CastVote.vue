<script setup>
import VOTING_TYPES from '@/helpers/votingTypes';
</script>
<template>
  <Block
    class="mb-4"
    :title="
      `Cast Vote ${
        payload?.metadata?.voting
          ? '(' + VOTING_TYPES[payload?.metadata?.voting] + ')'
          : ''
      }`
    "
  >
    <UiMarkdown
      v-if="payload?.metadata?.voting"
      :body="`${VOTING_TYPES.description[payload?.metadata?.voting]}`"
      class="mb-6"
    />
    <div class="mb-3">
      <!-- 
      <VotingApproval
        v-if="proposal.type === 'approval'"
        :proposal="proposal"
        @selectChoice="emitChoice"
      />
      <VotingQuadratic
        v-if="proposal.type === 'quadratic' || proposal.type === 'weighted'"
        :proposal="proposal"
        @selectChoice="emitChoice"
      /> -->
      <VotingSingleChoice
        v-if="
          payload?.metadata?.voting === 'single-choice' ||
            !payload?.metadata?.voting
        "
        :proposal="proposal"
        :maxCanSelect="+payload?.maxCanSelect"
        @selectChoice="emitChoice"
      />
      <VotingRankedChoice
        v-if="payload?.metadata?.voting === 'ranked-choice'"
        :proposal="proposal"
        @selectChoice="emitChoice"
      />
    </div>
    <UiButton
      :disabled="web3.authLoading || selectedChoices < 1"
      @click="clickVote"
      class="block width-full button--submit"
    >
      Vote
    </UiButton>
  </Block>
</template>

<script>
export default {
  props: ['proposal', 'modelValue'],
  emits: ['update:modelValue', 'clickVote'],

  computed: {
    payload() {
      return this.proposal?.msg?.payload;
    },
    selectedChoices() {
      if (Array.isArray(this.modelValue)) return this.modelValue.length;
      if (typeof this.modelValue === 'object' && this.modelValue !== null)
        return Object.keys(this.modelValue).length;
      return this.modelValue;
    }
  },
  methods: {
    emitChoice(c) {
      console.log('Made choice', c);
      this.$emit('update:modelValue', c);
    },
    clickVote() {
      console.log('Vote clicked!');
      this.$emit('clickVote');
    }
  }
};
</script>
