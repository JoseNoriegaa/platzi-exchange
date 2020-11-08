<template>
  <table>
    <thead>
      <tr class="bg-gray-100 border-b-2 border-gray-400">
        <th />
        <th :class="{ up: !sortAsc, down: sortAsc }">
          <span
            class="underline cursor-pointer"
            @click="sortAsc = !sortAsc"
          >
            Ranking
          </span>
        </th>
        <th>Nombre</th>
        <th>Precio</th>
        <th>Cap. de Mercado</th>
        <th>Variación 24hs</th>
        <td class="hidden sm:block">
          <input
            class="
              bg-gray-100
              focus:outline-none
              border-b
              border-gray-400
              py-2
              px-4
              block
              w-full
              appearance-none
              leading-normal
            "
            id="filter"
            placeholder="Buscar..."
            type="text"
            v-model="filter"
          >
        </td>
      </tr>
    </thead>
    <tbody>
      <tr
        class="
          border-b
          border-gray-200
          hover:bg-gray-100
          hover:bg-orange-100
        "
        v-for="(asset, idx) in filteredAssets"
        :key="`asset-${idx}`"
      >
        <td style="max-height:65px;min-width:65px">
          <img
            :src="`https://static.coincap.io/assets/icons/${asset.symbol.toLowerCase()}@2x.png`"
            :alt="asset.name"
            class="h-6 w-6"
          >
        </td>
        <td>
          <b>
            #{{ asset.rank }}
          </b>
        </td>
        <td>
          <router-link
            class="hover:underline text-green-600"
            :to="{ name: 'coin-detail', params: { id: asset.id } }"
          >
            {{ asset.name }}
          </router-link>
          <small class="ml-1 text-gray-500">
            {{ asset.symbol }}
          </small>
          </td>
        <td>{{ asset.priceUsd | dollar }}</td>
        <td>{{ asset.marketCapUsd | dollar }}</td>
        <td
          :class="asset.changePercent24Hr
              && asset.changePercent24Hr.includes('-') ? 'text-red-600' : 'text-green-600'"
        >
          {{ asset.changePercent24Hr | percent }}
        </td>
        <td class="hidden sm:block">
          <px-button @click="goToCoin(asset.id)">
            <span>Detail</span>
          </px-button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import PxButton from './PxButton.vue';

export default {
  name: 'PxAssetsTable',
  props: {
    assets: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      filter: '',
      sortAsc: false,
    };
  },
  components: {
    PxButton,
  },
  computed: {
    filteredAssets() {
      const normalizedFilter = this.filter.trim();
      const isGreater = this.sortAsc ? -1 : 1;
      const isLess = this.sortAsc ? 1 : -1;

      const data = this.assets.sort((a, b) => {
        const rankA = parseInt(a.rank, 10);
        const rankB = parseInt(b.rank, 10);
        let result = 0;
        if (rankA > rankB) {
          result = isGreater;
        } else if (rankA < rankB) {
          result = isLess;
        }
        return result;
      });
      if (!normalizedFilter) {
        return data;
      }
      const regexp = new RegExp(normalizedFilter, 'ig');

      return data.filter((x) => regexp.test(x.name) || regexp.test(x.symbol));
    },
  },
  methods: {
    goToCoin(id) {
      this.$router.push({
        name: 'coin-detail',
        params: {
          id,
        },
      });
    },
  },
};
</script>

<style scoped>
.up::before {
  content: "👆";
}

.down::before {
  content: "👇";
}

td {
  padding: 20px 0px;
  font-size: 0.6rem;
  text-align: center;
}

th {
  padding: 5px;
  font-size: 0.6rem;
}

@media (min-width: 640px) {
  td,
  th {
    padding: 20px;
    font-size: 1rem;
  }

  th {
    padding: 12px;
  }
}
</style>
