<script setup>
import { useFirestore } from 'vuefire'
import { collection } from 'firebase/firestore'
const db = useFirestore()

const todos = useDocument(collection(db, 'chat'))
let isOpen = ref(false)

onMounted( () => {
  isOpen = ref(true)
})

definePageMeta({
  layout: 'default'
})

</script>

<template>

  <ul class="max-w-md space-y-1 text-gray-500 list-inside dark:text-gray-400">
    <li class="flex items-center" v-for="todo in todos" :key="todo.id">
      <svg class="w-3.5 h-3.5 mr-2 text-green-500 dark:text-green-400 flex-shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
      </svg>
      {{ todo.id }}
    </li>
  </ul>


<!--  Modals to show for news -->
  <div>
    <UModal v-model="isOpen" class="relative p-4 w-full max-w-lg h-full md:h-auto" >
        <div class="relative p-4 bg-white rounded-lg shadow dark:bg-gray-800 md:p-8">
          <div class="mb-4 text-sm font-light text-gray-500 dark:text-gray-400">
            <h3 class="mb-3 text-2xl font-bold text-gray-900 dark:text-white">Privacy info</h3>
            <p>
              The backup created with this export functionnality may contain some sensitive data. We suggest you to save this archive in a securised location.
            </p>
          </div>
          <div class="justify-between items-center pt-0 space-y-4 sm:flex sm:space-y-0">
            <a href="#" class="font-medium text-primary-600 dark:text-primary-500 hover:underline">Learn more about privacy</a>
            <div class="items-center space-y-4 sm:space-x-4 sm:flex sm:space-y-0">
              <button id="close-modal" type="button"  class="py-2 px-4 w-full text-sm font-medium text-gray-500 bg-white rounded-lg border border-gray-200 sm:w-auto hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-primary-300 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">Cancel</button>
              <button id="confirm-button" type="button" class="py-2 px-4 w-full text-sm font-medium text-center text-white rounded-lg bg-primary-700 sm:w-auto hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Confirm</button>
            </div>
          </div>
        </div>
    </UModal>
  </div>

</template>
