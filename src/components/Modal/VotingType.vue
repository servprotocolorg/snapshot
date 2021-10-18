<script setup>
import VOTING_TYPES from '@/helpers/votingTypes';
const types = [
  'single-choice',
  'approval',
  'quadratic',
  'ranked-choice',
  'weighted'
];
</script>

<template>
  <UiModal :open="open" @close="$emit('close')">
    <template v-slot:header>
      <h3>Select Voting System</h3>
    </template>
    <div class="mt-4 mx-4">
      <a v-if="selected" @click="select(undefined)">
        <Block>
          <h3>Any</h3>
        </Block>
      </a>
      <a v-for="type in types" :key="type" @click="select(type)">
        <Block class="button--submit">
          <h3 v-text="`${VOTING_TYPES[type]}`" />
          <div
            v-text="`${VOTING_TYPES.description[type]}`"
            class="text-color"
          />
        </Block>
      </a>
    </div>
  </UiModal>
</template>

<script>
export default {
  props: ['open', 'selected'],
  emits: ['update:modelValue', 'close'],
  methods: {
    select(id) {
      console.log(id);
      this.$emit('update:modelValue', id);
      this.$emit('close');
    }
  }
};
</script>
