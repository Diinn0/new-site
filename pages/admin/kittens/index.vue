<template>
  <section class="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5">
    <div class="mx-auto max-w-screen-xl px-4 lg:px-12">
      <!-- Start coding here -->
      <div class="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
        <div class="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
          <div class="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
            <NuxtLink href="kittens/add" type="button" class="cursor-pointer flex items-center justify-center text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800">
              <svg class="h-3.5 w-3.5 mr-2" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path clip-rule="evenodd" fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
              </svg>
              Ajouter un chaton
            </NuxtLink>
          </div>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" class="px-4 py-3">Nom</th>
              <th scope="col" class="px-4 py-3">Sexe</th>
              <th scope="col" class="px-4 py-3">Date naissance</th>
              <th scope="col" class="px-4 py-3">Parents</th>
              <th scope="col" class="px-4 py-3">Disponibilité</th>
              <th scope="col" class="px-4 py-3">Active</th>
              <th scope="col" class="px-4 py-3">
                <span class="sr-only">Actions</span>
              </th>
            </tr>
            </thead>
            <tbody>
            <template v-for="(kitten, id) in kittens" :key="kitten.id">
              <tr class="border-b dark:border-gray-700" v-if="id >= 10 * (page - 1) && id < 10 * (page)">
                <th scope="row" class="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">{{ kitten.name }}</th>
                <td :class="'px-4 py-3 ' + (kitten.sexe == 0 ? 'text-rose-400' : 'text-blue-600')">{{ kitten.sexe == 0 ? "Femelle" : "Male" }}</td>
                <td class="px-4 py-3 text-gray-900">{{ getDate(portees, kitten) }}</td>
                <td class="px-4 py-3 text-gray-900">{{ getParents(portees, kitten) }}</td>
                <td class="px-4 py-3 text-gray-900">{{ getDisponibilite(kitten.dispo) }}</td>
                <td :class="'px-4 py-3 ' + (!kitten.active ? 'text-red-600' : 'text-green-600')">{{ kitten.active ? "Oui" : "Non" }}</td>
                <td class="px-4 py-3 flex items-center justify-end">

                  <NuxtLink :href="'/admin/kittens/' + kitten.id" class="text-white bg-orange-400 hover:bg-orange-600 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center me-2 dark:bg-orange-400 dark:hover:bg-orange-600 dark:focus:ring-orange-600">
                    <Icon name="mdi:pencil"></Icon>
                    <span class="sr-only">Editer</span>
                  </NuxtLink>
                  <a @click="preProcessDel(kitten.id, kitten.name)" href="#" class="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center me-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">
                    <Icon name="mdi:delete"></Icon>
                    <span class="sr-only">Supprimer</span>
                  </a>
                </td>
              </tr>
            </template>
            </tbody>
          </table>
        </div>
        <nav v-if="kittens != null" class="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 p-4" aria-label="Table navigation">
                <span class="text-sm font-normal text-gray-500 dark:text-gray-400">
                    Affiche
                    <span class="font-semibold text-gray-900 dark:text-white">{{
                        10 * (page - 1) + 1
                      }}-{{ Math.min(10 * (page), kittens.length) }}</span>
                    sur
                    <span class="font-semibold text-gray-900 dark:text-white">{{ kittens.length }}</span>
                </span>
          <UPagination v-if="kittens.length > 10" v-model="page" :page-count="10" :total="kittens.length" />
        </nav>
      </div>
    </div>


    <UModal v-model="isConfirmDelOpen">
          <!-- Modal content -->
          <div class="relative p-4 text-center bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
            <button @click="isConfirmDelOpen = false" class="text-gray-400 absolute top-2.5 right-2.5 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="deleteModal">
              <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
              <span class="sr-only">Fermer</span>
            </button>
            <svg class="text-gray-400 dark:text-gray-500 w-11 h-11 mb-3.5 mx-auto" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>
            <p class="mb-4 text-gray-500 dark:text-gray-300">Etes-vous sur de vouloir supprimer le chaton {{ delCatName }} ?</p>
            <div class="flex justify-center items-center space-x-4">
              <button @click="cancelDel()" type="button" class="py-2 px-3 text-sm font-medium text-gray-500 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-primary-300 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">
                Non, annuler
              </button>
              <button type="submit" @click="processDel()" class="py-2 px-3 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-900">
                Oui je suis sûr
              </button>
            </div>
          </div>
    </UModal>

  </section>

</template>

<script setup>
import {useFirebaseStorage, useFirestore} from "vuefire";
import {collection, doc} from "firebase/firestore";
import {initFlowbite} from "flowbite";
import {deleteDoc} from "@firebase/firestore";
import {deleteObject, getDownloadURL, listAll, ref as storageRef} from "firebase/storage";

onMounted( () => {
  initFlowbite();
})

definePageMeta({
  layout: 'admin',
  middleware: ['admin'],
})

const toast = useToast()
const db = useFirestore()
const kittens = useDocument(collection(db, 'chaton'))
console.log(kittens)

const portees = useDocument(collection(db, 'portee'))
let portee = null;

let isConfirmDelOpen = ref(false)
let delCatName = '';
let delCatId = '';
const page = ref(1);
let preProcessDel = (id, name) => {
   delCatName = name;
   delCatId = id;
   isConfirmDelOpen = ref(true);
}

let cancelDel = () => {
  delCatName = '';
  delCatId = '';
  isConfirmDelOpen = ref(false);
}

let processDel = () => {
  isConfirmDelOpen = ref(false);
  let chatColl = collection(db, 'chat');
  const storage = useFirebaseStorage()

  listAll( storageRef(storage, `cat/${delCatId}/`))
      .then((res) => {
        res.items.forEach((itemRef) => {
          deleteObject(itemRef).then(() => {
          }).catch((error) => {});
        });
      }).catch((error) => {});

  deleteDoc(doc(db, 'kitten', delCatId))
      .then((result) => {
        toast.add( {
          title: 'Chaton supprimé',
          description: `${delCatName} à bien été supprimé`,
          timeout: 6000,
          color:'primary'
        })
      }).catch((error) => {
        console.log(error)
    });
}

let getDisponibilite = (dispo) => {

  switch (dispo) {
    case '0':
      return 'Disponible';
    case '1':
      return 'En Option';
    case '2':
      return 'Réservé(e)';
    case '3':
      return 'Non disponible';
  }
}

let getDate = (portees, kitten) => {

  if (portees) {
    let portee = portees.find((element) => element.id == kitten.portee);

    if (portee) {
      return portee.dateReel.toDate().toLocaleDateString("fr")
    }
  }
}

let getParents = (portees, kitten) => {

  if (portees) {
    let portee = portees.find((element) => element.id == kitten.portee);
    if (portee) {
      return portee.female + ' - ' + portee.male;
    }
  }
}
</script>

<style scoped>

</style>
