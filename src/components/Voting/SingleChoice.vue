<template>
  <div class="mb-3">
    <UiButton
      v-for="(choice, i) in payload?.choices"
      :key="i"
      @click="selectChoice(i + 1)"
      class="block width-full mb-2"
      :class="selectedChoice === i + 1 && 'button--active'"
    >
      {{ _shorten(choice, 32) }}
    </UiButton>
  </div>
</template>
<script>
import { ref } from 'vue';
const selectedChoice = ref(null);
export default {
  props: ['proposal'],
  emits: ['selectChoice'],
  data() {
    return {
      selectedChoice: selectedChoice
    };
  },
  computed: {
    payload() {
      return this.proposal?.msg?.payload || [];
    }
  },
  methods: {
    selectChoice(i) {
      selectedChoice.value = i;
      this.$emit('selectChoice', i);
    }
  }
};
</script>
