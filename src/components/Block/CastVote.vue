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
    <UiMarkdown
      v-else-if="payload?.maxCanSelect && +payload?.maxCanSelect > 1"
      :body="
        `Select up to ${payload?.maxCanSelect} options from the list of choices`
      "
      class="mb-6"
    />
    <UiMarkdown
      v-else
      :body="`Select an option from the list of choices`"
      class="mb-6"
    />
    <div class="mb-3">
      <VotingQuadratic
        v-if="
          payload?.metadata?.voting === 'quadratic' ||
            payload?.metadata?.voting === 'weighted'
        "
        :proposal="proposal"
        @selectChoice="emitChoice"
      />
      <VotingApproval
        v-if="
          payload?.metadata?.voting === 'approval' ||
            (!payload?.metadata?.voting && +payload?.maxCanSelect > 1)
        "
        :proposal="proposal"
        :maxCanSelect="+payload?.maxCanSelect > 1 ? +payload?.maxCanSelect : 0"
        @selectChoice="emitChoice"
      />
      <VotingSingleChoice
        v-if="
          payload?.metadata?.voting === 'single-choice' ||
            (!payload?.metadata?.voting && +payload?.maxCanSelect <= 1)
        "
        :proposal="proposal"
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
