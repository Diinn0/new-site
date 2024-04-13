<script setup>
import {useFirestore} from "vuefire";
import {collection, addDoc, Timestamp} from "firebase/firestore";
import {initFlowbite} from "flowbite";

onMounted( () => {
  initFlowbite();
})

definePageMeta({
  layout: 'admin',
  middleware: ['admin'],
})

const db = useFirestore()

const submit = () => {
  form.datePrev = Timestamp.fromDate(new Date(dateUnformatedPrev))
  form.dateReel = Timestamp.fromDate(new Date(dateUnformatedReal))
  let porteColl = collection(db, 'portee');
  let res = addDoc(porteColl, form)

  res.then((value) => {
    return navigateTo({
      path: '/admin/portee',
    })
  }).catch((error) => {
    console.log(error)
  })
}

let form =  {
      male: '',
      female: '',
      pawpedsLink:'',
      childs: []
}

let dateUnformatedPrev = ''
let dateUnformatedReal = ''
</script>

<template>
  <form action="#" @submit.prevent="submit">
    <div class="grid sm:grid-cols-2">
      <h2 class="mb-4 text-xl font-bold text-gray-900 dark:text-white">Ajouter une nouvelle portée</h2>
    </div>
    <div class="grid gap-4 mb-4 sm:grid-cols-2">
      <div>
        <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Parent male</label>
        <input v-model="form.male" type="text" name="name" id="name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Entrez le nom du chat" required="">
      </div>
      <div>
        <label for="surname" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Parent femelle</label>
        <input v-model="form.female" type="text" name="surname" id="surname" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Entrez le surnom" required="">
      </div>
      <div>
        <label for="dateofbirth" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Date de naissance prévu</label>
        <input v-model="dateUnformatedPrev" type="date" name="dateofbirth" id="dateofbirth" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" required="">
      </div>
      <div>
        <label for="dateofbirth" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Date de naissance réelle</label>
        <input v-model="dateUnformatedReal" type="date" name="dateofbirth" id="dateofbirth" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
      </div>
      <div>
        <label for="pawpeds" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Lien Pawpeds</label>
        <input v-model="form.pawpedsLink" type="text" name="pawpeds" id="pawpeds" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Entrez le lien pawpeds (facultatif)">
      </div>
    </div>
    <div class="grid gap-4 sm:col-span-2 md:gap-6 sm:grid-cols-2">

    </div>
    <div class="items-center space-y-4 sm:flex sm:space-y-0 sm:space-x-4">
      <button type="submit" class="w-full sm:w-auto justify-center text-white inline-flex bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Ajouter</button>
      <NuxtLink href="/admin/portee" data-modal-toggle="createProductModal" type="button" class="w-full justify-center sm:w-auto text-gray-500 inline-flex items-center bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-primary-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">
        <svg class="mr-1 -ml-1 w-5 h-5" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
        Annuler
      </NuxtLink>
    </div>
  </form>
</template>

<style scoped>

</style>
