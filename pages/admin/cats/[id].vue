<script setup>
import {useFirestore} from 'vuefire'
import {addDoc, collection, doc, getDoc, Timestamp} from "firebase/firestore";
import {useDocument} from 'vuefire'
import {initFlowbite} from "flowbite";
import moment from "moment";
import {updateDoc} from "@firebase/firestore";

onMounted(() => {
  initFlowbite();
})

definePageMeta({
  layout: 'admin',
  middleware: ['admin'],
})

const route = useRoute();
const db = useFirestore();

const catRef = doc(db, 'chat', route.params.id.toString());
const catObject = (await getDoc(catRef));
const cat = catObject.data();

if (cat === undefined) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page Not Found',
    data: {
      myCustomField: true
    }
  })
}
let date = moment(new Date(cat.dateOfBirth.seconds * 1000)).format('YYYY-MM-D');
let tests = ref(cat.tests);

if (tests === undefined) {
  tests = ref([]);
}

let addEmptyTest = () => {
  tests.value.push('')
}

let removeTest = (index) => {
  tests.value.splice(index, 1);
}

const submit = () => {
  cat.dateOfBirth = Timestamp.fromDate(new Date(date))
  console.log(cat.dateOfBirth)
  cat.tests = tests.value;
  let res = updateDoc(catRef, cat)

  res.then((value) => {
    return navigateTo({
      path: '/admin/cats',
    })
  }).catch((error) => {
    console.log("error")
  })
}

</script>

<template>
  <form action="#" @submit.prevent="submit">
    <div class="grid sm:grid-cols-2">
      <h2 class="mb-4 text-xl font-bold text-gray-900 dark:text-white">Ajouter un nouveau chat</h2>
    </div>
    <div class="grid gap-4 mb-4 sm:grid-cols-2">
      <div>
        <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nom du chat</label>
        <input v-model="cat.name" type="text" name="name" id="name"
               class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
               placeholder="Entrez le nom du chat" required="">
      </div>
      <div>
        <label for="surname" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Surnom</label>
        <input v-model="cat.surname" type="text" name="surname" id="surname"
               class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
               placeholder="Entrez le surnom" required="">
      </div>
      <div>
        <label for="dateofbirth" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Date de
          naissance</label>
        <input v-model="date" type="date" name="dateofbirth" id="dateofbirth"
               class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
               placeholder="Entrez la date de naissance" required="">
      </div>
      <div>
        <label for="pawpeds" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Lien Pawpeds</label>
        <input v-model="cat.pawpedsLink" type="text" name="pawpeds" id="pawpeds"
               class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
               placeholder="Entrez le lien pawpeds (facultatif)">
      </div>
      <div class="grid gap-4 sm:col-span-2 md:gap-6 sm:grid-cols-2">
        <div class="grid gap-2 sm:col-span-2 md:gap-4 sm:grid-cols-4">
          <div class="flex items-center ps-4 border border-gray-200 rounded dark:border-gray-700">
            <input v-model="cat.sexe" id="sexe-male" type="radio" value="1" name="sexe"
                   class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
            <label for="sexe-male"
                   class="w-full py-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Male</label>
          </div>
          <div class="flex items-center ps-4 border border-gray-200 rounded dark:border-gray-700">
            <input v-model="cat.sexe" checked id="sexe-femelle" type="radio" value="0" name="sexe"
                   class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
            <label for="sexe-femelle" class="w-full py-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Femelle</label>
          </div>

          <div class="flex items-center ps-4 border border-gray-200 rounded dark:border-gray-700">
            <input v-model="cat.neutre" id="neutre" type="checkbox" value="" name="bordered-checkbox"
                   class="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
            <label for="neutre"
                   class="w-full py-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Neutré</label>
          </div>

          <div class="flex items-center ps-4 border border-gray-200 rounded dark:border-gray-700">
            <input v-model="cat.active" checked id="visible" type="checkbox" value="" name="bordered-checkbox"
                   class="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
            <label for="visible"
                   class="w-full py-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Visible</label>
          </div>
        </div>
      </div>
      <div class="grid gap-4 sm:col-span-2 md:gap-6 sm:grid-cols-2">
        <div>
          <label for="description"
                 class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
          <textarea v-model="cat.description" id="description" rows="4"
                    class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Write product description here"></textarea>
        </div>
        <div>
          <div class="grid gap-4 sm:col-span-2 md:gap-6 sm:grid-cols-4 place-content-between">
            <label for="description" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Tests</label>
            <div class="col-end-6 col-span-1">
              <a @click="addEmptyTest()" class="cursor-pointer flex items-center justify-center w-9 h-9 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-lg toggle-full-view hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-500 dark:bg-gray-800 focus:outline-none dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                <Icon name="ic:baseline-plus" size="2em"/>
              </a>
            </div>
          </div>
            <div class="relative mt-2" v-for="(test, index) in tests" :key="index">
              <div>
                <input @input="event => tests[index] = event.target.value" type="text" :value="test" id="search" class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                <a @click="removeTest(index)" class="absolute end-1 bottom-1 cursor-pointer"><icon class="text-red-600 hover:text-red-800" name="charm:cross" size="2em"></icon></a>
              </div>
            </div>
        </div>
      </div>
    </div>
    <div class="items-center space-y-4 sm:flex sm:space-y-0 sm:space-x-4">
      <button type="submit"
              class="w-full sm:w-auto justify-center text-white inline-flex bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
        Ajouter
      </button>
      <button type="button"
              class="w-full justify-center sm:w-auto text-gray-500 inline-flex items-center bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-primary-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">
        <svg class="mr-1 -ml-1 w-5 h-5" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"/>
        </svg>
        Annuler
      </button>
    </div>
  </form>
</template>

<style scoped>

</style>
