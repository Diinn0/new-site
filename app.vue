<script setup>
import { onMounted } from 'vue'
import { initFlowbite } from 'flowbite'

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
