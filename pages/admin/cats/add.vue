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
  form.dateOfBirth = Timestamp.fromDate(new Date(dateUnformated))
  let chatColl = collection(db, 'chat');
  let res = addDoc(chatColl, form)

  res.then((value) => {
    return navigateTo({
      path: '/admin/cats',
    })
  }).catch((error) => {
    console.log("error")
  })
}

let form =  {
      name: '',
      surname: '',
      sexe: '0',
      active: true,
      neutre: false,
      description: '',
      pawpedsLink:'',
      dateOfBirth: '',
      tests: []
}

let dateUnformated = ''
</script>

<template>
  <form action="#" @submit.prevent="submit">
    <div class="grid sm:grid-cols-2">
      <h2 class="mb-4 text-xl font-bold text-gray-900 dark:text-white">Ajouter un nouveau chat</h2>
    </div>
    <div class="grid gap-4 mb-4 sm:grid-cols-2">
      <div>
        <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nom du chat</label>
        <input v-model="form.name" type="text" name="name" id="name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Entrez le nom du chat" required="">
      </div>
      <div>
        <label for="surname" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Surnom</label>
        <input v-model="form.surname" type="text" name="surname" id="surname" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Entrez le surnom" required="">
      </div>
      <div>
        <label for="dateofbirth" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Date de naissance</label>
        <input v-model="dateUnformated" type="date" name="dateofbirth" id="dateofbirth" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Entrez la date de naissance" required="">
      </div>
      <div>
        <label for="pawpeds" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Lien Pawpeds</label>
        <input v-model="form.pawpedsLink" type="text" name="pawpeds" id="pawpeds" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Entrez le lien pawpeds (facultatif)">
      </div>
      <div class="grid gap-4 sm:col-span-2 md:gap-6 sm:grid-cols-2">
        <div class="grid gap-2 sm:col-span-2 md:gap-4 sm:grid-cols-4">
          <div class="flex items-center ps-4 border border-gray-200 rounded dark:border-gray-700">
            <input v-model="form.sexe" id="sexe-male" type="radio" value="1" name="sexe" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
            <label for="sexe-male" class="w-full py-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Male</label>
          </div>
          <div class="flex items-center ps-4 border border-gray-200 rounded dark:border-gray-700">
            <input v-model="form.sexe" checked id="sexe-femelle" type="radio" value="0" name="sexe" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
            <label for="sexe-femelle" class="w-full py-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Femelle</label>
          </div>

          <div class="flex items-center ps-4 border border-gray-200 rounded dark:border-gray-700">
            <input v-model="form.neutre" id="neutre" type="checkbox" value="" name="bordered-checkbox" class="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
            <label for="neutre" class="w-full py-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Neutré</label>
          </div>

          <div class="flex items-center ps-4 border border-gray-200 rounded dark:border-gray-700">
            <input v-model="form.active" checked id="visible" type="checkbox" value="" name="bordered-checkbox" class="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
            <label for="visible" class="w-full py-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Visible</label>
          </div>
        </div>
      </div>
      <div class="sm:col-span-2">
        <label for="description" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
        <textarea v-model="form.description" id="description" rows="4" class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Write product description here"></textarea></div>
    </div>
    <div class="grid gap-4 sm:col-span-2 md:gap-6 sm:grid-cols-2">

    </div>
    <div class="items-center space-y-4 sm:flex sm:space-y-0 sm:space-x-4">
      <button type="submit" class="w-full sm:w-auto justify-center text-white inline-flex bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Ajouter</button>
      <NuxtLink href="/admin/cats" data-modal-toggle="createProductModal" type="button" class="w-full justify-center sm:w-auto text-gray-500 inline-flex items-center bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-primary-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">
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
