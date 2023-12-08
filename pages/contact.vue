<script setup>
const config = useRuntimeConfig();

useHead({
  script: [
    {
      src: `https://maps.googleapis.com/maps/api/js?key=${config.public.apiKey}&callback=initMap`,
      // valid options are: 'head' | 'bodyClose' | 'bodyOpen'
      tagPosition: 'bodyClose'
    }
  ]
})

const links = [
  { name: 'Contact' }
]

let map;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 49.30040182419514, lng: 3.426499076057423 },
    zoom: 11,
  });

  const contentString =
      `
       <h3 class="font-semibold text-xl text-gray-900">Chatterie de la maison fleurie</h3>
       <hr class="m-2 bg-gray-800 h-0.5">
       <h4 class="font-semibold text-gray-900">Karine ROY</h4>
       <p class="text-gray-900 mb-1">1 rue saint jacques, 02200 Nampteuil sous muret</p>
       <p class="text-gray-900"><span class="font-bold">Tél. fixe: </span>03.23.55.29.85</p>
       <p class="text-gray-900"><span class="font-bold">Tél. mobile: </span>06.77.50.82.97</p>
      `;

  const infowindow = new google.maps.InfoWindow({
    content: contentString,
    ariaLabel: "Uluru",
  });

  const marker = new google.maps.Marker({
    position: { lat: 49.30040182419514, lng: 3.426499076057423 },
    map,
    title: "",
  });

  infowindow.open({
    anchor: marker,
    map,
  });

  marker.addListener("click", () => {
    infowindow.open({
      anchor: marker,
      map,
    });
  });
}

onMounted(() => {
  window.initMap = initMap;
})

</script>

<template>
  <InPageNav :links="links" />
  <div class="gap-8 items-center py-8 px-4 mx-auto max-w-screen-xl xl:gap-16 md:grid md:grid-cols-2 sm:py-16 lg:px-6 align-top">
    <div id="map" class="grow h-[calc(55vh)] m-2"></div>
    <div>
      <h2 class="text-4xl font-extrabold dark:text-white">Nous contacter</h2>
      <p class="mb-4 text-lg font-bold text-red-700 dark:text-gray-400mb-10">Visites uniquement sur Rendez-vous</p>

      <p>E-mail: <a class="font-medium text-blue-600 underline dark:text-blue-500 dark:hover:text-blue-600 hover:text-blue-700 hover:no-underline mb-4" href="mailto:contact@maison-fleurie.fr">contact@maison-fleurie.fr</a></p>

      <p class="font-bold"></p>
      <hr class="w-[calc(90%)] h-1 mx-auto my-4 bg-gray-100 border-0 rounded md:my-5 dark:bg-gray-700">
      <p>N° siret : 538 940 057 00010</p>
      <p>Enregistré dans le livre officiel des affixes sous le n°18314</p>
      <p>Certificat d’Etudes Techniques de l’Animal de Compagnie n° C-1671</p>
      <p>Certificat de capacité n° 02 150 délivré le 11 septembre 2012</p>
      <p>N° de TVA intracommunautaire FR 30 538940057</p>
    </div>
  </div>
</template>

<style scoped>

</style>
