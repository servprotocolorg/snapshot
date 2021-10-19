<script setup>
import draggable from 'vuedraggable';
import { getNumberWithOrdinal } from '@/helpers/utils';
</script>

<template>
  <div class="mb-3">
    <div :class="{ 'mb-5': selectedChoices.length > 0 }">
      <draggable
        v-model="selectedChoices"
        :component-data="{ name: 'list' }"
        item-key="id"
        @change="updateChoices"
      >
        <template #item="{ element, index }">
          <div class="mb-2">
            <UiButton
              style="display:flex;justify-content:space-between"
              class="width-full button--active !px-3"
            >
              <div>({{ getNumberWithOrdinal(index + 1) }})</div>
              <div class="truncated width-full mx-2">
                {{ payload.choices[element - 1] }}
              </div>
              <div @click="removeChoice(index)">
                <Icon name="close" size="12" />
              </div>
            </UiButton>
          </div>
        </template>
      </draggable>
    </div>
    <div v-for="(choice, i) in payload.choices" :key="i">
      <UiButton
        v-if="!selectedChoices.includes(i + 1)"
        @click="selectChoice(i + 1)"
        class="block width-full mb-2"
        :class="selectedChoices.includes(i + 1) && 'button--active'"
      >
        <span class="truncated">{{ choice }}</span>
      </UiButton>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';

const selectedChoices = ref([]);

export default {
  props: ['proposal'],
  emits: ['selectChoice'],
  data() {
    return {
      selectedChoices: selectedChoices
    };
  },
  computed: {
    payload() {
      return this.proposal.msg.payload;
    }
  },
  methods: {
    selectChoice(i) {
      selectedChoices.value.push(i);
      this.$emit('selectChoice', selectedChoices);
    },
    removeChoice(i) {
      selectedChoices.value.splice(i, 1);
    },
    updateChoices() {
      this.$emit('selectChoice', selectedChoices);
    }
  }
};
</script>
