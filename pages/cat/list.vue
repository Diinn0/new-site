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
  <h2 class="text-4xl font-extrabold mb-2 text-yellow-900">Nos chats</h2>
  <div class="grid gap-8 lg:grid-cols-4">
    <template v-for="cat in cats">
      <div v-if="cat.active" class="max-w-sm">
        <NuxtLink :href="'/cat/' + cat.id">
          <img v-if="cat.favorite" class="rounded-t-lg" :src="cat.favorite" alt=""/>
          <img v-else class="rounded-t-lg" src="https://placehold.co/600x400" alt=""/>
        </NuxtLink>
        <div class="p-5">
          <NuxtLink :href="'/cat/' + cat.id" class="mb-2 text-2xl font-bold tracking-tight text-yellow-900">{{ cat.name }}</NuxtLink>
        </div>
      </div>
    </template>
  </div>

</template>

<style scoped>

</style>
