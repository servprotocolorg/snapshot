<template>
  <router-link
    class="px-4 py-3 d-block text-gray"
    :to="{ name: 'proposal', params: { key: space.key, id: i } }"
  >
    <div>
      <State :proposal="proposal" class="d-inline-block mr-2 mb-2" />
      <h3
        v-text="_shorten(proposal.msg.payload.name, 'name')"
        class="d-inline-block mb-1"
      />
    </div>
    <div>
      <span v-text="`#${i.slice(0, 7)}`" />
      By {{ _shorten(proposal.address) }}
      <Badges :address="proposal.address" :space="space" class="ml-n1" />
      <span v-if="isDao" class="ml-1" v-text="`${proposal.score} Votes`" />
      <span
        v-else
        class="ml-1"
        v-text="`${_numeral(proposal.score)} ${space.symbol}`"
      />
      <Icon v-if="isVerified" name="check" title="Verified" />
      start
      <span v-text="$d(proposal.msg.payload.start * 1e3)" />
      end
      <span v-text="$d(proposal.msg.payload.end * 1e3)" />
    </div>
  </router-link>
</template>

<script>
export default {
  props: {
    space: Object,
    proposal: Object,
    verified: Array,
    i: String
  },
  computed: {
    isVerified() {
      return (
        Array.isArray(this.verified) &&
        this.verified.length > 0 &&
        this.verified.includes(this.proposal.address)
      );
    },
    isDao() {
      return ['dao-mainnet', 'dao-testnet'].indexOf(this.space.key) > -1;
    }
  }
};
</script>
