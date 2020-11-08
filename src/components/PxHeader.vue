<template>
  <header class="shadow w-screen">
    <nav class="flex items-center justify-between flex-wrap bg-green-400 p-6">
      <router-link to="/">
        <div class="flex items-center flex-shrink-0 text-white mr-6">
          <px-icon class="mr-2" />
          <span class="font-semibold text-xl tracking-tight">
            PlatziExchange
          </span>
        </div>
      </router-link>

      <div class="hidden sm:block w-full block flex-grow lg:flex lg:items-center lg:w-auto">
        <div class="text-sm lg:flex-grow">
          <router-link
            v-for="(link, idx) in links"
            :key="`${link.title} ${idx}`"
            :to="link.to"
            class="
              block
              mt-4
              lg:inline-block
              lg:mt-0
              text-teal-200
              hover:text-white
              mr-4
            "
          >
            {{ link.title }}
          </router-link>
        </div>
      </div>
    </nav>
  </header>
</template>

<script>
import PxIcon from './PxIcon.vue';

export default {
  name: 'PxHeader',
  props: {
    links: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    PxIcon,
  },
};
</script>
