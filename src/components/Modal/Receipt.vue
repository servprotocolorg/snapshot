<template>
  <UiModal :open="open" @close="$emit('close')">
    <template v-slot:header>
      <h3>Receipt</h3>
    </template>
    <div class="m-4 mb-0 p-4 border rounded-2 text-white">
      <div class="d-flex">
        <span v-text="'Author'" class="flex-auto text-gray mr-1" />
        <a :href="_ipfsUrl(authorIpfsHash)" target="_blank" class="text-white">
          #{{ authorIpfsHash.slice(0, 7) }}
          <Icon name="external-link" class="ml-1" />
        </a>
      </div>
      <div v-if="relayerIpfsHash" class="d-flex">
        <span v-text="'Relayer'" class="flex-auto text-gray mr-1" />
        <a :href="_ipfsUrl(relayerIpfsHash)" target="_blank" class="text-white">
          #{{ relayerIpfsHash.slice(0, 7) }}
          <Icon name="external-link" class="ml-1" />
        </a>
      </div>
    </div>
    <div class="m-4" v-if="false">
      <a
        href="https://mycrypto.com/sign-and-verify-message/verify"
        target="_blank"
        class="mb-2 d-block"
      >
        <UiButton class="button-outline width-full">
          Verify receipt on MyCrypto
          <Icon name="external-link" class="ml-1" />
        </UiButton>
      </a>
    </div>
  </UiModal>
</template>

<script>
export default {
  props: ['open', 'authorIpfsHash', 'relayerIpfsHash'],
  emits: ['close']
};
</script>
