<script setup>
import VOTING_TYPES from '@/helpers/votingTypes';
</script>

<template>
  <Container :slim="true">
    <div class="px-4 px-md-0 mb-3">
      <router-link
        :to="{ name: domain ? 'home' : 'proposals' }"
        class="text-gray"
      >
        <Icon name="back" size="22" class="v-align-middle" />
        {{ space.name }}
      </router-link>
    </div>
    <div>
      <div class="col-12 col-lg-8 float-left pr-0 pr-lg-5">
        <div class="px-4 px-md-0">
          <template v-if="loaded">
            <h1 class="mb-2">
              {{ payload.name }}
              <span v-text="`#${id.slice(0, 7)}`" class="text-gray" />
            </h1>
            <div class="mb-4">
              <State :proposal="proposal" />
              <UiDropdown
                class="float-right"
                v-if="
                  space.key === 'dai' && proposal.address === this.web3.account
                "
                @delete="deleteProposal"
                :items="[{ text: 'Delete proposal', action: 'delete' }]"
              >
                <Icon name="threedots" size="25" class="v-align-text-bottom" />
              </UiDropdown>
            </div>
            <UiMarkdown :body="payload.body" class="mb-6" />
          </template>
          <PageLoading v-else />
        </div>
        <BlockCastVote
          v-if="
            loaded && ts >= payload.start && ts < payload.end && canVoteProposal
          "
          :proposal="proposal"
          :web3="web3"
          v-model="selectedChoices"
          @open="modalOpen = true"
          @clickVote="clickVote"
        />
        <BlockVotes
          v-if="loaded"
          :space="space"
          :proposal="proposal"
          :votes="votes"
          :validatorNames="validatorNames"
        />
      </div>
      <div v-if="loaded" class="col-12 col-lg-4 float-left">
        <Block title="Information">
          <div class="mb-1">
            <b>Strategie(s)</b>
            <span
              @click="modalStrategiesOpen = true"
              class="float-right text-white a"
            >
              <span v-for="(symbol, symbolIndex) of symbols" :key="symbol">
                <span :aria-label="symbol" class="tooltipped tooltipped-n">
                  <Token :space="space.key" :symbolIndex="symbolIndex" />
                </span>
                <span
                  v-show="symbolIndex !== symbols.length - 1"
                  class="ml-1"
                />
              </span>
            </span>
          </div>
          <div class="mb-1">
            <b>Author</b>
            <User
              :address="proposal.address"
              :profile="proposal.profile"
              :space="space"
              :vname="
                validatorNames[proposal.address.toLowerCase()]
                  ? validatorNames[proposal.address.toLowerCase()]
                  : ''
              "
              class="float-right"
            />
          </div>
          <div class="mb-1">
            <b>IPFS</b>
            <a
              :href="_ipfsUrl(proposal.ipfsHash)"
              target="_blank"
              class="float-right"
            >
              #{{ proposal.ipfsHash.slice(0, 7) }}
              <Icon name="external-link" class="ml-1" />
            </a>
          </div>
          <div class="mb-1">
            <b>Voting Type</b>

            <span
              class="float-right text-white tooltipped tooltipped-n"
              v-if="!payload.metadata.voting"
              >Single choice voting</span
            >
            <span
              class="float-right text-white tooltipped tooltipped-n"
              v-else
              v-text="`${VOTING_TYPES[payload.metadata.voting]}`"
            />
          </div>
          <div>
            <div class="mb-1">
              <b>Start date</b>
              <span
                :aria-label="_ms(payload.start)"
                v-text="$d(payload.start * 1e3, 'short')"
                class="float-right text-white tooltipped tooltipped-n"
              />
            </div>
            <div class="mb-1">
              <b>End date</b>
              <span
                :aria-label="_ms(payload.end)"
                v-text="$d(payload.end * 1e3, 'short')"
                class="float-right text-white tooltipped tooltipped-n"
              />
            </div>
            <div class="mb-1">
              <b>Snapshot</b>
              <a
                :href="_explorer(space.network, payload.snapshot, 'block')"
                target="_blank"
                class="float-right"
              >
                {{ payload.snapshot }}
                <Icon name="external-link" class="ml-1" />
              </a>
            </div>
            <div class="mb-1" v-if="payload.maxCanSelect > 1">
              <b>Max selections</b>
              <span class="float-right text-white">{{
                payload.maxCanSelect
              }}</span>
            </div>
            <div class="mb-1" v-if="minTokenAmount > 0">
              <b>Min token amount</b>
              <span class="float-right text-white">{{
                minTokenAmount + ' ' + space.symbol
              }}</span>
            </div>
            <template v-if="isHarmonySpace">
              <div class="mb-1" v-if="epoch.length">
                <b>Closed on epoch</b>
                <span
                  :aria-label="epoch"
                  :v-text="epoch"
                  class="float-right text-white tooltipped tooltipped-n"
                  >{{ epoch }}</span
                >
              </div>

              <div class="mb-1" v-if="false">
                <b>Total votes</b>
                <span
                  :aria-label="totalVotesOne + ' / ' + results.totalStaked"
                  :v-text="totalVotesOne + ' / ' + results.totalStaked"
                  class="float-right text-white tooltipped tooltipped-n"
                >
                  {{
                    Number(totalVotesPercent) > 0.01
                      ? totalVotesPercent.toFixed(2)
                      : totalVotesPercent.toFixed(4)
                  }}
                  %
                </span>
              </div>

              <div class="mb-1">
                <b>Total stake</b>
                <span
                  aria-label="Total stake on the network"
                  :v-text="'Total stake on the network'"
                  class="float-right text-white tooltipped tooltipped-n"
                >
                  {{ _numeral(results.totalStaked) }} ONE
                </span>
              </div>
            </template>
            <template v-if="isNativeSpace">
              <div class="mb-1">
                <b>Circulate supply</b>
                <span
                  aria-label="Circulate supply on the network"
                  :v-text="'Circulate supply on the network'"
                  class="float-right text-white tooltipped tooltipped-n"
                >
                  {{ _numeral(results.totalSupply, '(0,0)') }} ONE
                </span>
              </div>
            </template>
          </div>
        </Block>
        <BlockResults
          :id="id"
          :space="space"
          :payload="payload"
          :results="results"
          :votes="votes"
        />
        <BlockActions
          :id="id"
          :space="space"
          :payload="payload"
          :results="results"
        />
        <PluginGnosisCustomBlock
          v-if="payload.metadata.plugins?.gnosis?.baseTokenAddress"
          :proposalConfig="payload.metadata.plugins.gnosis"
          :choices="payload.choices"
          :network="space.network"
        />
      </div>
    </div>
    <teleport to="#modal">
      <ModalConfirm
        v-if="loaded"
        :open="modalOpen"
        @close="modalOpen = false"
        @reload="loadProposal"
        :space="space"
        :proposal="proposal"
        :id="id"
        :selectedChoice="selectedChoice"
        :selectedChoices="selectedChoices"
        :totalScore="totalScore"
        :scores="scores"
        :snapshot="payload.snapshot"
      />
      <ModalStrategies
        :open="modalStrategiesOpen"
        @close="modalStrategiesOpen = false"
        :space="space"
        :strategies="space.strategies"
      />
    </teleport>
  </Container>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { isAddressEqual } from '@/helpers/utils';
import { HarmonyAddress } from '@harmony-js/crypto';
export default {
  data() {
    return {
      key: this.$route.params.key,
      id: this.$route.params.id,
      loading: false,
      loaded: false,
      voteLoading: false,
      proposal: {},
      votes: {},
      results: [],
      modalOpen: false,
      modalStrategiesOpen: false,
      selectedChoice: '',
      selectedChoiceSet: [],
      totalScore: 0,
      scores: [],
      validatorNames: {}
    };
  },
  computed: {
    ...mapState(['app', 'web3']),
    epoch() {
      return String(this.app.epoch);
    },
    isHarmonySpace() {
      return ['staking-mainnet', 'staking-testnet'].indexOf(this.key) > -1;
    },
    isNativeSpace() {
      return ['harmony-mainnet', 'harmony-testnet'].indexOf(this.key) > -1;
    },
    isDao() {
      return ['dao-mainnet', 'dao-testnet'].indexOf(this.key) > -1;
    },
    totalVotesOne() {
      return this.results
        ? this.results.totalBalances.reduce((acc, it) => acc + it, 0)
        : 0;
    },
    totalVotesPercent() {
      return this.totalVotesOne
        ? (this.totalVotesOne / this.results.totalStaked) * 100
        : 0;
    },
    canVoteProposal() {
      if (!this.web3.account) {
        console.log('Cannot vote, no account');
        return false;
      }
      if (this.totalScore <= 0) {
        console.log('Cannot vote, score 0');
        return false;
      }
      const isUserVoted = Object.keys(this.votes || {}).some(address =>
        isAddressEqual(address, this.web3.account)
      );
      if (this.isHarmonySpace || this.isDao) {
        const iAmValidator = !!this.app.validators.find(v =>
          isAddressEqual(v.address, this.web3.account)
        );
        console.log(
          'is user voted and i am validator?',
          iAmValidator && !isUserVoted
        );
        return iAmValidator && !isUserVoted;
      } else {
        console.log('Can potentially vote', !isUserVoted);
        return !isUserVoted;
      }
    },
    space() {
      return this.app.spaces[this.key];
    },
    payload() {
      return this.proposal.msg.payload;
    },
    ts() {
      return (Date.now() / 1e3).toFixed();
    },
    symbols() {
      return this.space.strategies.map(strategy => strategy.params.symbol);
    },
    minTokenAmount() {
      let minScore = 0;
      if (this.space.filters && this.space.filters.minScore > 0) {
        minScore = this.space.filters.minScore;
      }
      return minScore;
    }
  },
  watch: {
    'web3.account': async function(val, prev) {
      if (val?.toLowerCase() !== prev) await this.loadPower();
    }
  },
  methods: {
    ...mapActions(['getProposal', 'getPower', 'send']),
    async loadProposal() {
      const proposalObj = await this.getProposal({
        space: this.space,
        id: this.id
      });
      this.proposal = proposalObj.proposal;
      this.votes = proposalObj.votes;
      this.results = proposalObj.results;
      console.log('proposalObj:', proposalObj);
    },
    clickVote() {
      this.modalOpen = true;
    },
    async loadPower() {
      if (!this.web3.account || !this.proposal.address) return;
      this.loaded = false;
      const { scores, totalScore } = await this.getPower({
        space: this.space,
        address: this.web3.account,
        snapshot: this.payload.snapshot
      });
      this.totalScore = totalScore;
      this.scores = scores;
      this.loaded = true;
      console.log('totalScore:', this.totalScore);
    },
    async deleteProposal() {
      await this.send({
        space: this.space.key,
        type: 'delete-proposal',
        payload: {
          proposal: this.id
        }
      });
    },
    initValidatorName() {
      if (this.isHarmonySpace) {
        this.app.validators.forEach(item => {
          this.validatorNames[new HarmonyAddress(item.address).bech32] =
            item.name;
          this.validatorNames[
            new HarmonyAddress(item.address).checksum.toLowerCase()
          ] = item.name;
        });
      }
    },
    selectOption(id) {
      const optionIndex = this.selectedChoiceSet.indexOf(id);
      if (optionIndex > -1) {
        this.selectedChoiceSet.splice(optionIndex, 1);
      } else {
        this.selectedChoiceSet.push(id);
      }
      this.selectedChoice = this.selectedChoiceSet.join('-');
    }
  },
  async created() {
    this.loading = true;
    await this.loadProposal();
    await this.loadPower();
    this.initValidatorName();
    this.loading = false;
    this.loaded = true;
  }
};
</script>
