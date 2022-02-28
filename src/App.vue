<template>
  <div :class="space && space.skin" id="app" class="overflow-hidden">
    <UiLoading v-if="app.loading || !app.init" class="overlay big" />
    <div v-else>
      <Topnav />
      <Container :slim="true">
      <div class="overflow-hidden mr-n4 notice">
        <strong>IMPORTANT</strong>: This service has moved to <a href="https://snapshot.org/#/?network=1666600000" target="_blank">Snapshot.org</a>. <a href="https://givp.medium.com/harmony-snapshot-official-migration-to-snapshot-org-565dade74c2" target="_blank">
          Details
        </a>
      </div>
      </Container>
      <div class="pb-6 overflow-hidden">
        <router-view :key="$route.path" class="flex-auto" />
      </div>
    </div>
    <div id="modal" />
    <Notifications />
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  watch: {
    'app.modalOpen': function(val) {
      const el = document.body;
      el.classList[val ? 'add' : 'remove']('overflow-hidden');
    }
  },
  computed: {
    space() {
      try {
        const key = this.domain || this.$route.params.key;
        return this.app.spaces[key];
      } catch (e) {
        return {};
      }
    }
  },
  mounted() {
    this.init();
    this.initSession();
  },
  methods: {
    ...mapActions(['initSession']),
    ...mapActions(['init'])
  }
};
</script>

<style>
.notice {
  padding: 20px 20px 15px 20px;
  border: 1px solid #773344;
  border-radius: 8px;
  margin-bottom: 20px;
  background-color: #e85f5c;
  color: #9cfffa;
}
</style>
