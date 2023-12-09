<script setup>
import {useFirebaseStorage, useFirestore} from 'vuefire'
import {doc, getDoc} from "firebase/firestore";
import {getDownloadURL, listAll, ref as storageRef} from "firebase/storage";
import FsLightbox from "fslightbox-vue/v3";

const route = useRoute();
const db = useFirestore();
const storage = useFirebaseStorage()

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

const links = [
  { name: 'Nos chats', url: '/cat/list' },
  { name: cat.name }
]

const tests = cat.tests;

let currentId = undefined;

let images = ref([]);

images.value = [];
listAll(storageRef(storage, `cat/${route.params.id.toString()}`))
    .then((res) => {
      res.items.forEach((itemRef) => {
        getDownloadURL(itemRef)
            .then((url) => {
              images.value.push(url);
            })
            .catch((error) => {
              console.log(error)
            });
      });
    }).catch((error) => {
});
images.value.sort();

let slide = ref(0)
let toggler = ref(false)

let openOnSlide = (i) => {
  slide.value = i + 1;
  toggler.value = !toggler.value
}

</script>

<template>

  <section>
    <InPageNav :links="links" />
    <div class="gap-8 items-center py-8 px-4 mx-auto max-w-screen-xl xl:gap-16 md:grid md:grid-cols-2 sm:py-16 lg:px-6 align-top">
      <div class="h-screen">
        <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
          <div v-for="(image, i) in images">
            <NuxtImg class="cursor-pointer hover:brightness-125 transition-all duration-300 rounded-lg object-cover h-32 w-96" :src="image" @click="openOnSlide(i)"></NuxtImg>
          </div>
        </div>
        <FsLightbox
            :toggler="toggler"
            :sources="images"
            :slide="slide"
        />
      </div>
      <div class="mt-4 md:mt-0 h-screen">
        <div class="max-w-[500px]">
          <h2 class="mb-4 text-4xl tracking-tight font-extrabold">{{ cat.name }}</h2>
          <NuxtImg class="h-14 w-14 mx-auto" src="/img/5a01f50518e87004f1ca4340.png"/>
        </div>
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 mb-5">
          <div>
            <p class="font-light md:text-lg">{{ cat.sexe == 0 ? 'Femelle' : 'Male' }}</p>
            <p class="font-light md:text-lg"><strong class="font-bold">{{ cat.sexe == 0 ? 'Née' : 'Né' }} le: </strong>{{ cat.dateOfBirth.toDate().toLocaleDateString("fr") }}</p>
          </div>
          <div>
            <strong class="font-bold" v-if="tests">Tests santé:</strong>
            <ul class="mt-2 space-y-1 list-none list-inside">
              <li v-for="test in tests">{{ test }}</li>
            </ul>
          </div>
        </div>

        <strong v-if="cat.description" class="fond-bold">Description:</strong>
        <p>{{ cat.description }}</p>


      </div>
    </div>
  </section>
</template>

<style scoped>

</style>
