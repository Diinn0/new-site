<script setup lang="ts">
import {initFlowbite} from "flowbite";
import {collection} from "firebase/firestore";
import {useFirestore} from "vuefire";

onMounted( () => {
  initFlowbite();
})

const db = useFirestore()
const cats = useDocument(collection(db, 'chat'))

const links = [
  { name: 'Nos chats' }
]

</script>

<template>
  <InPageNav :links="links" class="mb-2"/>
  <h2 class="text-4xl font-extrabold dark:text-white mb-2">Nos chats</h2>
  <div class="grid gap-8 lg:grid-cols-4">
    <div v-for="cat in cats" class="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      <a href="#">
        <img class="rounded-t-lg" src="/docs/images/blog/image-1.jpg" alt="" />
      </a>
      <div class="p-5">
        <a href="#">
          <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{{ cat.name }}</h5>
        </a>
        <NuxtLink :href="'/cat/' + cat.id" class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
          En savoir plus
          <svg class="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
          </svg>
        </NuxtLink>
      </div>
    </div>
  </div>

</template>

<style scoped>

</style>