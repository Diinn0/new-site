<script setup lang="ts">
  import {useFirebaseStorage, useFirestore} from "vuefire";
  import {collection, doc} from "firebase/firestore";
  import {initFlowbite} from "flowbite";
  import {deleteDoc} from "@firebase/firestore";

  onMounted( () => {
    initFlowbite();
  })

  definePageMeta({
    layout: 'admin',
    middleware: ['admin'],
  })

  const toast = useToast()
  const db = useFirestore()
  const portees = useDocument(collection(db, 'portee'))


</script>

<template>
  <section class="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5">
    <div class="mx-auto max-w-screen-xl px-4 lg:px-12">
      <!-- Start coding here -->
      <div class="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
        <div class="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
          <div class="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
            <NuxtLink href="portee/add" type="button" class="cursor-pointer flex items-center justify-center text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800">
              <svg class="h-3.5 w-3.5 mr-2" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path clip-rule="evenodd" fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
              </svg>
              Ajouter une portée
            </NuxtLink>
          </div>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" class="px-4 py-3">Male</th>
                <th scope="col" class="px-4 py-3">Femelle</th>
                <th scope="col" class="px-4 py-3">Date prévu</th>
                <th scope="col" class="px-4 py-3">Date naissance</th>
                <th scope="col" class="px-4 py-3">Chatons (Disponible/Total)</th>
                <th scope="col" class="px-4 py-3">
                  <span class="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
            <template v-for="(portee, id) in portees" :key="portee.id">
              <tr class="border-b dark:border-gray-700">
                <td class="px-4 py-3 font-medium whitespace-nowrap text-rose-400">{{ portee.male }}</td>
                <td class="px-4 py-3 font-medium whitespace-nowrap text-blue-600">{{ portee.female }}</td>
                <td class="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">{{ portee.datePrev.toDate().toLocaleDateString("fr") }}</td>
                <td class="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">{{ portee.dateReel.toDate().toLocaleDateString("fr") }}</td>
                <td class="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">{{ portee.childs.length }}</td>
                <td class="px-4 py-3 flex items-center justify-end">

                  <NuxtLink :href="'/admin/portee/' + portee.id" class="text-white bg-orange-400 hover:bg-orange-600 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center me-2 dark:bg-orange-400 dark:hover:bg-orange-600 dark:focus:ring-orange-600">
                    <Icon name="mdi:pencil"></Icon>
                    <span class="sr-only">Editer</span>
                  </NuxtLink>
<!--                  <a @click="preProcessDel(portee.id, portee.name)" href="#" class="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center me-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">-->
<!--                    <Icon name="mdi:delete"></Icon>-->
<!--                    <span class="sr-only">Supprimer</span>-->
<!--                  </a>-->
                </td>
              </tr>
            </template>
            </tbody>
          </table>
        </div>
<!--        <nav class="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 p-4" aria-label="Table navigation">-->
<!--                <span class="text-sm font-normal text-gray-500 dark:text-gray-400">-->
<!--                    Affiche-->
<!--                    <span class="font-semibold text-gray-900 dark:text-white">{{ 10 * (page - 1) + 1 }}-{{ Math.min(10 * (page), cats.length) }}</span>-->
<!--                    sur-->
<!--                    <span class="font-semibold text-gray-900 dark:text-white">{{ cats.length }}</span>-->
<!--                </span>-->
<!--          <UPagination v-if="cats.length > 10" v-model="page" :page-count="10" :total="cats.length" />-->
<!--        </nav>-->
      </div>
    </div>
  </section>
</template>

<style scoped>

</style>
