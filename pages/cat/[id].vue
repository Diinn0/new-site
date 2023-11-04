<script setup lang="ts">
import { useFirestore } from 'vuefire'
import {doc, getDoc} from "firebase/firestore";
import { useDocument } from 'vuefire'

const route = useRoute();
const db = useFirestore();

const cat = (await getDoc(doc(db, 'chat', route.params.id.toString()))).data();

if (cat == undefined)
{
  throw createError({
    statusCode: 404,
    statusMessage: 'Page Not Found',
    data: {
      myCustomField: true
    }
  })
}

const tests = cat.tests;

</script>

<template>
  <section class="bg-white dark:bg-gray-900">
    <div class="gap-8 items-center py-8 px-4 mx-auto max-w-screen-xl xl:gap-16 md:grid md:grid-cols-2 sm:py-16 lg:px-6">
      <img class="w-full dark:hidden" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/cta/cta-dashboard-mockup.svg" alt="dashboard image">
      <img class="w-full hidden dark:block" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/cta/cta-dashboard-mockup-dark.svg" alt="dashboard image">
      <div class="mt-4 md:mt-0">
        <h2 class="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">{{ cat.name }}</h2>

        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 mb-5">
          <div>
            <p class="font-light text-gray-500 md:text-lg dark:text-gray-400">{{ cat.sexe == 0 ? 'Femelle' : 'Male' }}</p>
            <p class="font-light text-gray-500 md:text-lg dark:text-gray-400"><strong class="font-bold">{{ cat.sexe == 0 ? 'Née' : 'Né' }} le: </strong>{{ cat.dateOfBirth.toDate().toLocaleDateString("fr") }}</p>
          </div>
          <div>
            <strong class="font-bold">Tests santé:</strong>
            <ul class="mt-2 space-y-1 list-none list-inside">
              <li v-for="test in tests">{{ test }}</li>
            </ul>
          </div>
        </div>

        <strong class="fond-bold">Description:</strong>
        <p>{{ cat.description }}</p>


      </div>
    </div>
  </section>
</template>

<style scoped>

</style>
