<template>
  <div class="flex-col">
    <div class="flex justify-center">
      <bounce-loader
        :loading="loading"
        color="#68d391"
        :size="100"
      />
    </div>
    <template v-if="!loading && asset">
      <div class="flex flex-col sm:flex-row justify-around items-center">
        <div class="flex flex-col items-center">
          <img
            :src="
              `https://static.coincap.io/assets/icons/${asset.symbol.toLowerCase()}@2x.png`
            "
            :alt="asset.name"
            class="w-20 h-20 mr-5"
          >
          <h1 class="text-5xl">
            {{ asset.name }}
            <small class="sm:mr-2 text-gray-500">{{ asset.symbol }}</small>
          </h1>
        </div>

        <div class="my-10 flex flex-col">
          <ul>
            <li class="flex justify-between">
              <b class="text-gray-600 mr-10 uppercase">Ranking</b>
              <span>#{{ asset.rank }}</span>
            </li>
            <li class="flex justify-between">
              <b class="text-gray-600 mr-10 uppercase">Precio actual</b>
              <span>{{ asset.priceUsd | dollar }}</span>
            </li>
            <li class="flex justify-between">
              <b class="text-gray-600 mr-10 uppercase">Precio más bajo</b>
              <span>{{ min | dollar }}</span>
            </li>
            <li class="flex justify-between">
              <b class="text-gray-600 mr-10 uppercase">Precio más alto</b>
              <span>{{ max | dollar }}</span>
            </li>
            <li class="flex justify-between">
              <b class="text-gray-600 mr-10 uppercase">Precio Promedio</b>
              <span>{{ avg | dollar }}</span>
            </li>
            <li class="flex justify-between">
              <b class="text-gray-600 mr-10 uppercase">Variación 24hs</b>
              <span>{{ asset.changePercent24Hr | percent }}</span>
            </li>
          </ul>
        </div>

        <div class="my-10 sm:mt-0 flex flex-col justify-center text-center">
          <button
            @click="fromUsd = !fromUsd"
            class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            {{ fromUsd ? `USD a ${asset.symbol}` : `${asset.symbol} a USD` }}
          </button>

          <div class="flex flex-row my-5">
            <label class="w-full" for="convertValue">
              <input
                id="convertValue"
                type="number"
                placeholder="Cantidad"
                class="
                  text-center
                  bg-white
                  focus:outline-none
                  focus:shadow-outline
                  border
                  border-gray-300
                  rounded-lg
                  py-2
                  px-4
                  block
                  w-full
                  appearance-none
                  leading-normal
                "
                v-model="convertValue"
             >
            </label>
          </div>

          <span class="text-xl" >
            {{ convertedValue }}
            {{ fromUsd ? asset.symbol : 'USD' }}
          </span>
        </div>
      </div>
      <line-chart
        class="my-10"
        :colors="['orange']"
        :min="min"
        :max="max"
        :data="chartData"
      />

      <h3 class="text-xl my-10">
        Mejores Ofertas de Cambio
      </h3>

      <table>
        <tr
          v-for="market in markets"
          :key="`${market.exchangeId}-${market.priceUsd}`"
          class="border-b"
        >
          <td>
            <b>
              {{ market.exchangeId }}
            </b>
          </td>
          <td>
            {{ market.priceUsd | dollar }}
          </td>
          <td>
            {{ market.baseSymbol }} / {{ market.quoteSymbol }}
          </td>
          <td>
            <px-button
              v-if="!market.url"
              :loading="market.loading"
              @click="getWebSite(market)"
            >
              <slot>
                Obtener Link
              </slot>
            </px-button>
            <a
              v-else
              :href="market.url"
              class="hover:underline text-green-600"
              target="_blank"
            >
              {{ market.url }}
            </a>
          </td>
        </tr>
      </table>
    </template>
  </div>
</template>

<script>
import PxButton from '../components/PxButton.vue';
import api from '../api';

export default {
  name: 'CoinDetail',
  data() {
    return {
      loading: false,
      asset: null,
      history: [],
      markets: [],
      fromUsd: false,
      convertValue: null,
    };
  },
  components: {
    PxButton,
  },
  computed: {
    min() {
      return parseFloat(Math.min.apply(null, this.history.map((h) => h.priceUsd))).toFixed(2);
    },
    max() {
      return parseFloat(Math.max.apply(null, this.history.map((h) => h.priceUsd))).toFixed(2);
    },
    avg() {
      return (this.history.reduce((acum, h) => acum + parseFloat(h.priceUsd), 0)
        / this.history.length).toFixed(2);
    },
    chartData() {
      return this.history.map((h) => [h.date, parseFloat(h.priceUsd).toFixed(2)]);
    },
    id() {
      return this.$route.params.id;
    },
    convertedValue() {
      if (!this.convertValue) {
        return 0;
      }
      const result = this.fromUsd ? this.convertValue / this.asset.priceUsd
        : this.convertValue * this.asset.priceUsd;
      return result.toFixed(2);
    },
  },
  methods: {
    async getCoin() {
      try {
        this.loading = true;
        const requests = [
          api.getAsset(this.id),
          api.getAssetHistory(this.id),
          api.getMarkets(this.id),
        ];
        const response = await Promise.all(requests);

        const [asset, history, markets] = response;
        if (asset) {
          this.asset = asset;
          this.history = history || [];
          this.markets = markets || [];
        } else {
          this.$router.replace('/not-found');
        }
      } catch {
        this.$router.replace('/not-found');
      } finally {
        this.loading = false;
      }
    },
    async getWebSite(market) {
      this.$set(market, 'loading', true);
      const response = await api.getExchange(market.exchangeId);
      if (response) {
        this.$set(market, 'url', response.exchangeUrl);
      }
      this.$set(market, 'loading', false);
    },
  },
  created() {
    this.getCoin();
  },
  watch: {
    id(val) {
      if (val) {
        this.asset = null;
        this.getCoin();
      }
    },
  },
};
</script>

<style scoped>
td {
  padding: 10px;
  text-align: center;
}
</style>
