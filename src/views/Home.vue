<template>
  <div>
    <bounce-loader
      :loading="loading"
      color="#68d391"
      :size="100"
    />
    <px-assets-table
      v-if="!loading"
      :assets="assets"
    />
  </div>
</template>

<script>
import api from '../api';
import PxAssetsTable from '../components/PxAssetsTable.vue';

export default {
  name: 'Home',
  data() {
    return {
      assets: [],
      loading: false,

    };
  },
  components: {
    PxAssetsTable,
  },
  async created() {
    this.loading = true;
    const assets = await api.getAssets();
    if (Array.isArray(assets)) {
      this.assets = assets;
    }
    this.loading = false;
  },
};
</script>
