<script setup>
import {useFirestore} from 'vuefire'
import {addDoc, collection, doc, getDoc, Timestamp} from "firebase/firestore";
import {useDocument} from 'vuefire'
import {initFlowbite} from "flowbite";
import moment from "moment";
import {updateDoc} from "@firebase/firestore";
import {ref as storageRef, listAll, getDownloadURL, deleteObject } from 'firebase/storage'
import {useFirebaseStorage, useStorageFile} from 'vuefire'
import {uid} from "uid";
import Compressor from 'compressorjs';

onMounted(() => {
  initFlowbite();
})

definePageMeta({
  layout: 'admin',
  middleware: ['admin'],
})

const route = useRoute();
const db = useFirestore();
const storage = useFirebaseStorage()


let portees = useDocument(collection(db, 'portee'));
const kittenRef = doc(db, 'chaton', route.params.id.toString());
const kittenObject = (await getDoc(kittenRef));
const kitten = kittenObject.data();
// use to store pre selected files
let FILES = {};
let gallery = undefined;
let empty = undefined;

const toast = useToast();

const metadata = {
  contentType: 'image/jpeg'
};

let images = ref([]);

let refreshImage = async () => {
  images.value = [];
  listAll(storageRef(storage, `kitten/${route.params.id.toString()}`))
      .then((res) => {
        res.items.forEach((itemRef) => {
          getDownloadURL(itemRef)
              .then((url) => {
                let obj = {
                  url: url,
                  ref: itemRef
                }

                if (url !== kitten.favorite) {
                  images.value.push(obj);
                } else {
                  images.value.unshift(obj);
                }
              })
              .catch((error) => {
              });
        });
      }).catch((error) => {
  });

  images.value.sort((a, b) => {
          if (a.url < b.url) {
            return -1;
          }
          if (a.url > b.url) {
            return 1;
          }
          return 0;
  });

}

refreshImage();

if (kitten === undefined) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page Not Found',
    data: {
      myCustomField: true
    }
  })
}

const submit = () => {
  for (const [name, obj] of Object.entries(FILES)) {
    try {
      let storageFileRef = storageRef(storage, `kitten/${route.params.id.toString()}/${uid(16)}.jpg`)
      const {
        url,
        // gives you a percentage between 0 and 1 of the upload progress
        uploadProgress,
        uploadError,
        // firebase upload task
        uploadTask,
        upload,
      } = useStorageFile(storageFileRef)

      new Compressor(obj, {
        quality: 0.6,

        // The compression process is asynchronous,
        // which means you have to access the `result` in the `success` hook function.
        success(result) {
          upload(result, metadata);
        },

        error(err) {
          console.log(err.message);
        },
      });
    } catch (e) {
      console.log(e)
    }
  }

  let res = updateDoc(kittenRef, kitten);

  console.log(kitten)

  res.then((value) => {
    toast.add({
      title: 'Chaton sauvegardé',
      description: `Le chaton a bien été sauvegardé`,
      timeout: 6000,
      color: 'primary'
    })

    empty = document.getElementById("empty");
    while (gallery.children.length > 0) {
      gallery.lastChild.remove();
    }
    FILES = {};
    empty.classList.remove("hidden");
    gallery.append(empty);

    refreshImage();

  }).catch((error) => {
    toast.add({
      title: 'Chaton non sauvegardé',
      description: `Le chaton n'a pas pu être sauvegardé`,
      timeout: 6000,
      color: 'red'
    })
  })
}

// ---------------------------------------------------------------------------------------------------------
// File upload

let dropHandler = undefined;
let dragEnterHandler = undefined;
let dragLeaveHandler = undefined;
let dragOverHandler = undefined;

onMounted(() => {
  const fileTempl = document.getElementById("file-template"),
      imageTempl = document.getElementById("image-template"),
      empty = document.getElementById("empty");

  // check if file is of type image and prepend the initialied
  // template to the target element
  function addFile(target, file) {
    const isImage = file.type.match("image.*"),
        objectURL = URL.createObjectURL(file);

    const clone = isImage
        ? imageTempl.content.cloneNode(true)
        : fileTempl.content.cloneNode(true);

    clone.querySelector("h1").textContent = file.name;
    clone.querySelector("li").id = objectURL;
    clone.querySelector(".delete").dataset.target = objectURL;
    clone.querySelector(".size").textContent =
        file.size > 1024
            ? file.size > 1048576
                ? Math.round(file.size / 1048576) + "mb"
                : Math.round(file.size / 1024) + "kb"
            : file.size + "b";

    isImage &&
    Object.assign(clone.querySelector("img"), {
      src: objectURL,
      alt: file.name
    });

    empty.classList.add("hidden");
    target.prepend(clone);

    FILES[objectURL] = file;
  }

  gallery = document.getElementById("gallery");
  const overlay = document.getElementById("overlay");

  // click the hidden input of type file if the visible button is clicked
  // and capture the selected files
  const hidden = document.getElementById("hidden-input");
  document.getElementById("button").onclick = () => hidden.click();
  hidden.onchange = (e) => {
    for (const file of e.target.files) {
      addFile(gallery, file);
    }
  };

  // use to check if a file is being dragged
  const hasFiles = (ev) => {
    return ev.dataTransfer.files.length > 0
  };

  // use to drag dragenter and dragleave events.
  // this is to know if the outermost parent is dragged over
  // without issues due to drag events on its children
  let counter = 0;

  // reset counter and append file to gallery when file is dropped
  dropHandler = (ev) => {
    console.log(ev)
    ev.preventDefault();
    for (const file of ev.dataTransfer.files) {
      addFile(gallery, file);
      overlay.classList.remove("draggedover");
      counter = 0;
    }
  }

  // only react to actual files being dragged
  dragEnterHandler = (e) => {
    e.preventDefault();
    if (!hasFiles(e)) {
      return;
    }
    ++counter && overlay.classList.add("draggedover");
  }

  dragLeaveHandler = (e) => {
    1 > --counter && overlay.classList.remove("draggedover");
  }

  dragOverHandler = (e) => {
    if (hasFiles(e)) {
      e.preventDefault();
    }
  }

  // event delegation to caputre delete events
  // fron the waste buckets in the file preview cards
  gallery.onclick = ({target}) => {
    if (target.classList.contains("delete")) {
      const ou = target.dataset.target;
      document.getElementById(ou).remove(ou);
      gallery.children.length === 1 && empty.classList.remove("hidden");
      delete FILES[ou];
    }
  };

  // clear entire selection
  // document.getElementById("cancel").onclick = () => {
  //   while (gallery.children.length > 0) {
  //     gallery.lastChild.remove();
  //   }
  //   FILES = {};
  //   empty.classList.remove("hidden");
  //   gallery.append(empty);
  // };

})

let removeImageFromFirestore = (ref) => {

   deleteObject(ref).then(() => {
     toast.add({
       title: 'Image supprimé',
       description: `L'image a été supprimé`,
       timeout: 6000,
       color: 'primary'
     })
      refreshImage()
   }).catch((error) => {
   });
}

let changeFavorite = (name) => {
  kitten.favorite = name;
  submit();
}

</script>

<template>
  <form action="#" @submit.prevent="submit">
    <div class="grid sm:grid-cols-2">
      <h2 class="mb-4 text-xl font-bold text-gray-900 dark:text-white">Modifier un chaton</h2>
    </div>
    <div class="grid gap-4 mb-4 sm:grid-cols-2">
      <div>
        <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nom du chaton</label>
        <input v-model="kitten.name" type="text" name="name" id="name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Entrez le nom du chat" required="">
      </div>
      <div>
        <label for="surname" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Surnom</label>
        <input v-model="kitten.surname" type="text" name="surname" id="surname" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Entrez le surnom" required="">
      </div>
      <div>
        <label for="portee" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Choisir portée</label>
        <select v-model="kitten.portee" id="portee" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
          <option selected>Choisir la portée</option>
          <option v-for="portee in portees" :value="portee.id">{{ portee.female }} - {{ portee.male }} - {{ portee.dateReel.toDate().toLocaleDateString("fr")  }}</option>
        </select>
      </div>
      <div>
        <label for="dispo" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Choisir disponibilité</label>
        <select v-model="kitten.dispo"  id="dispo" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
          <option value="0" selected>Disponible</option>
          <option value="1">En option</option>
          <option value="2">Réservé(e)</option>
          <option value="3">Non disponible</option>
        </select>
      </div>
      <div class="grid gap-4 sm:col-span-2 md:gap-6 sm:grid-cols-2">
        <div class="grid gap-2 sm:col-span-2 md:gap-4 sm:grid-cols-4">
          <div class="flex items-center ps-4 border border-gray-200 rounded dark:border-gray-700">
            <input v-model="kitten.sexe" id="sexe-male" type="radio" value="1" name="sexe" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
            <label for="sexe-male" class="w-full py-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Male</label>
          </div>
          <div class="flex items-center ps-4 border border-gray-200 rounded dark:border-gray-700">
            <input v-model="kitten.sexe" checked id="sexe-femelle" type="radio" value="0" name="sexe" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
            <label for="sexe-femelle" class="w-full py-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Femelle</label>
          </div>

          <div class="flex items-center ps-4 border border-gray-200 rounded dark:border-gray-700">
            <input v-model="kitten.active" checked id="visible" type="checkbox" value="" name="bordered-checkbox" class="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
            <label for="visible" class="w-full py-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Visible</label>
          </div>
        </div>
      </div>
      <div class="sm:col-span-2">
        <label for="description" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
        <textarea v-model="kitten.description" id="description" rows="4" class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Write product description here"></textarea></div>
      </div>
      <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Photos:</label>
      <div class="grid gap-4 sm:col-span-2 md:gap-6 sm:grid-cols-2">
        <div>
          <article aria-label="File Upload Modal" class="relative h-full flex flex-col rounded-md">
            <!--                     @drop="dropHandler($event);"-->
            <!--                     @dragover="dragOverHandler($event);"-->
            <!--                     @dragleave="dragLeaveHandler($event);"-->
            <!--                     @dragenter="dragEnterHandler($event);"-->

            <!-- overlay -->
            <div id="overlay"
                 class="w-full h-full absolute top-0 left-0 pointer-events-none z-50 flex flex-col items-center justify-center rounded-md">
              <i>
                <svg class="fill-current w-12 h-12 mb-3 text-blue-700" xmlns="http://www.w3.org/2000/svg" width="24"
                     height="24" viewBox="0 0 24 24">
                  <path
                      d="M19.479 10.092c-.212-3.951-3.473-7.092-7.479-7.092-4.005 0-7.267 3.141-7.479 7.092-2.57.463-4.521 2.706-4.521 5.408 0 3.037 2.463 5.5 5.5 5.5h13c3.037 0 5.5-2.463 5.5-5.5 0-2.702-1.951-4.945-4.521-5.408zm-7.479-1.092l4 4h-3v4h-2v-4h-3l4-4z"/>
                </svg>
              </i>
              <p class="text-lg text-blue-700">Drop files to upload</p>
            </div>

            <!-- scroll area -->
            <section class="h-full overflow-auto p-8 w-full h-full flex flex-col">
              <header class="border-dashed border-2 border-gray-400 py-12 flex flex-col justify-center items-center">
                <!--                  <p class="mb-3 font-semibold text-gray-900 flex flex-wrap justify-center">-->
                <!--&lt;!&ndash;                    <span>Déplacer vos fichier ici ou</span>&ndash;&gt;-->
                <!--                  </p>-->
                <input id="hidden-input" type="file" multiple class="hidden"/>
                <a id="button"
                   class="mt-2 rounded-sm px-3 py-1 bg-blue-600 hover:bg-blue-700 focus:shadow-outline focus:outline-none text-white cursor-pointer">
                  Envoyer un fichier
                </a>
              </header>

              <h1 class="pt-8 pb-3 font-semibold sm:text-lg text-gray-900 dark:text-white">
                A envoyer
              </h1>

              <ul id="gallery" class="flex flex-1 flex-wrap -m-1">
                <li id="empty" class="h-full w-full text-center flex flex-col items-center justify-center items-center">
                  <img class="mx-auto w-32"
                       src="https://user-images.githubusercontent.com/507615/54591670-ac0a0180-4a65-11e9-846c-e55ffce0fe7b.png"
                       alt="no data"/>
                  <span class="text-small text-gray-500">Aucun fichier selectionné</span>
                </li>
              </ul>
            </section>
          </article>
        </div>
        <div>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div v-for="(img, test) in images" :key="test">
              <div class="relative">
                <div class="group hasImage w-full h-full rounded-md relative hover:grayscale transition-all duration-300">
                  <NuxtImg class="h-auto max-w-full rounded-lg sticky object-cover bg-fixed" :src=img.url alt=""/>
                  <div class=" flex flex-col rounded-md text-xs break-words w-full h-full z-20 absolute top-0 py-2 px-3">
                    <div v-if="img.url === kitten.favorite" class="text-yellow-400 ml-auto focus:outline-none p-1 rounded-md">
                      <svg class="pointer-events-none fill-current w-4 h-4 ml-auto" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 256 256">
                        <path fill="currentColor" d="m234.5 114.38l-45.1 39.36l13.51 58.6a16 16 0 0 1-23.84 17.34l-51.11-31l-51 31a16 16 0 0 1-23.84-17.34l13.49-58.54l-45.11-39.42a16 16 0 0 1 9.11-28.06l59.46-5.15l23.21-55.36a15.95 15.95 0 0 1 29.44 0L166 81.17l59.44 5.15a16 16 0 0 1 9.11 28.06Z"/>
                      </svg>
                    </div>
                    <a v-else @click='changeFavorite(img.url)' class="cursor-pointer text-transparent group-hover:text-white ml-auto focus:outline-none hover:bg-gray-300 p-1 rounded-md">
                      <svg class="pointer-events-none fill-current w-4 h-4 ml-auto" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 256 256">
                        <path fill="currentColor" d="M239.2 97.29a16 16 0 0 0-13.81-11L166 81.17l-23.28-55.36a15.95 15.95 0 0 0-29.44 0L90.07 81.17l-59.46 5.15a16 16 0 0 0-9.11 28.06l45.11 39.42l-13.52 58.54a16 16 0 0 0 23.84 17.34l51-31l51.11 31a16 16 0 0 0 23.84-17.34l-13.51-58.6l45.1-39.36a16 16 0 0 0 4.73-17.09Zm-15.22 5l-45.1 39.36a16 16 0 0 0-5.08 15.71L187.35 216l-51.07-31a15.9 15.9 0 0 0-16.54 0l-51 31l13.46-58.6a16 16 0 0 0-5.08-15.71L32 102.35a.37.37 0 0 1 0-.09l59.44-5.14a16 16 0 0 0 13.35-9.75L128 32.08l23.2 55.29a16 16 0 0 0 13.35 9.75l59.45 5.14v.07Z"/>
                      </svg>
                    </a>
                      <a @click='removeImageFromFirestore(img.ref)' class="cursor-pointer text-transparent group-hover:text-white ml-auto focus:outline-none hover:bg-gray-300 p-1 rounded-md">
                        <svg class="pointer-events-none fill-current w-4 h-4 ml-auto" xmlns="http://www.w3.org/2000/svg"
                             width="24" height="24" viewBox="0 0 24 24">
                          <path class="pointer-events-none"
                                d="M3 6l3 18h12l3-18h-18zm19-4v2h-20v-2h5.711c.9 0 1.631-1.099 1.631-2h5.316c0 .901.73 2 1.631 2h5.711z"/>
                        </svg>
                      </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
    <div class="items-center space-y-4 sm:flex sm:space-y-0 sm:space-x-4">
      <button type="submit"
              class="w-full sm:w-auto justify-center text-white inline-flex bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
        Sauvegarder
      </button>
      <NuxtLink href="/admin/kittens"
                class="w-full justify-center sm:w-auto text-gray-500 inline-flex items-center bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-primary-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">
        <svg class="mr-1 -ml-1 w-5 h-5" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"/>
        </svg>
        Retour
      </NuxtLink>
    </div>
  </form>

  <!-- using two similar templates for simplicity in js code -->
  <template id="file-template">
    <li class="block p-1 w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/6 xl:w-1/8 h-24">
      <article tabindex="0"
               class="group w-full h-full rounded-md focus:outline-none focus:shadow-outline elative bg-gray-100 cursor-pointer relative shadow-sm">
        <img alt="upload preview" class="img-preview hidden w-full h-full sticky object-cover rounded-md bg-fixed"/>

        <section class="flex flex-col rounded-md text-xs break-words w-full h-full z-20 absolute top-0 py-2 px-3">
          <h1 class="flex-1 group-hover:text-blue-800"></h1>
          <div class="flex">
              <span class="p-1 text-blue-800">
                <i>
                  <svg class="fill-current w-4 h-4 ml-auto pt-1" xmlns="http://www.w3.org/2000/svg" width="24"
                       height="24" viewBox="0 0 24 24">
                    <path d="M15 2v5h5v15h-16v-20h11zm1-2h-14v24h20v-18l-6-6z"/>
                  </svg>
                </i>
              </span>
            <p class="p-1 size text-xs text-gray-700"></p>
            <a class="cursor-pointer ml-auto focus:outline-none hover:bg-gray-300 p-1 rounded-md text-gray-800">
              <svg class="pointer-events-none fill-current w-4 h-4 ml-auto" xmlns="http://www.w3.org/2000/svg"
                   width="24" height="24" viewBox="0 0 24 24">
                <path class="pointer-events-none"
                      d="M3 6l3 18h12l3-18h-18zm19-4v2h-20v-2h5.711c.9 0 1.631-1.099 1.631-2h5.316c0 .901.73 2 1.631 2h5.711z"/>
              </svg>
            </a>
          </div>
        </section>
      </article>
    </li>
  </template>

  <template id="image-template">
    <li class="block p-1 w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/6 xl:w-1/8 h-24">
      <article tabindex="0"
               class="group hasImage w-full h-full rounded-md focus:outline-none focus:shadow-outline bg-gray-100 cursor-pointer relative text-transparent hover:text-white shadow-sm">
        <img alt="upload preview" class="img-preview w-full h-full sticky object-cover rounded-md bg-fixed"/>

        <section class="flex flex-col rounded-md text-xs break-words w-full h-full z-20 absolute top-0 py-2 px-3">
          <h1 class="flex-1"></h1>
          <div class="flex">
              <span class="p-1">
                <i>
                  <svg class="fill-current w-4 h-4 ml-auto pt-" xmlns="http://www.w3.org/2000/svg" width="24"
                       height="24" viewBox="0 0 24 24">
                    <path
                        d="M5 8.5c0-.828.672-1.5 1.5-1.5s1.5.672 1.5 1.5c0 .829-.672 1.5-1.5 1.5s-1.5-.671-1.5-1.5zm9 .5l-2.519 4-2.481-1.96-4 5.96h14l-5-8zm8-4v14h-20v-14h20zm2-2h-24v18h24v-18z"/>
                  </svg>
                </i>
              </span>

            <p class="p-1 size text-xs"></p>
            <a class="cursor-pointer delete ml-auto focus:outline-none hover:bg-gray-300 p-1 rounded-md">
              <svg class="pointer-events-none fill-current w-4 h-4 ml-auto" xmlns="http://www.w3.org/2000/svg"
                   width="24" height="24" viewBox="0 0 24 24">
                <path class="pointer-events-none"
                      d="M3 6l3 18h12l3-18h-18zm19-4v2h-20v-2h5.711c.9 0 1.631-1.099 1.631-2h5.316c0 .901.73 2 1.631 2h5.711z"/>
              </svg>
            </a>
          </div>
        </section>
      </article>
    </li>
  </template>

</template>

<style scoped>
.hasImage:hover section {
  background-color: rgba(5, 5, 5, 0.4);
}

.hasImage:hover button:hover {
  background: rgba(5, 5, 5, 0.45);
}

#overlay p,
i {
  opacity: 0;
}

#overlay.draggedover {
  background-color: rgba(255, 255, 255, 0.7);
}

#overlay.draggedover p,
#overlay.draggedover i {
  opacity: 1;
}

.group:hover .group-hover\:text-blue-800 {
  color: #2b6cb0;
}
</style>
