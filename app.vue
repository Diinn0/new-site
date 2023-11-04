<script setup>
import 'flowbite';

import { onMounted } from 'vue'
import { initFlowbite } from 'flowbite'
const router = useRouter()
const route = useRoute()
const user = useCurrentUser()

// initialize components based on data attribute selectors
onMounted(() => {
  initFlowbite();
})

</script>

<template>
  <NuxtLayout>
    <NuxtPage/>
    <h1>Hello World!</h1>

  </NuxtLayout>
</template>
