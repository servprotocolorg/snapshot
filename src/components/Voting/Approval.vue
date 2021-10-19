<template>
  <div class="mb-3">
    <UiButton
      v-for="(choice, i) in payload.choices"
      :key="i"
      @click="selectChoice(i + 1)"
      class="block width-full mb-2"
      :class="selectedChoices.includes(i + 1) && 'button--active'"
    >
      {{ _shorten(choice, 32) }}
    </UiButton>
  </div>
</template>
<script>
import { ref } from 'vue';
const selectedChoices = ref([]);
export default {
  props: ['proposal', 'maxCanSelect'],
  emits: ['selectChoice'],
  data() {
    return {
      selectedChoices: selectedChoices
    };
  },
  beforeMount() {
    selectedChoices.value.splice(0, selectedChoices.value.length);
  },
  computed: {
    payload() {
      return this.proposal?.msg?.payload || [];
    }
  },
  methods: {
    selectChoice(i) {
      if (selectedChoices.value.includes(i)) {
        selectedChoices.value.splice(selectedChoices.value.indexOf(i), 1);
      } else {
        if (
          this.maxCanSelect &&
          this.maxCanSelect > 1 &&
          this.maxCanSelect <= selectedChoices.value.length
        ) {
          return; // cannot select more than the marked max selection
        }
        selectedChoices.value.push(i);
      }
      this.$emit('selectChoice', selectedChoices.value);
    }
  }
};
</script>
