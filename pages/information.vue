<script setup>
const links = [
  { name: 'Informations importante' }
]
</script>

<template>
  <InPageNav :links="links" />

  <div class="items-center mx-auto max-w-screen-xl md:grid md:grid-cols-2 lg:px-6 align-top pt-4">
    <div>
      <h2 class="mb-4 text-2xl font-extrabold leading-none tracking-tight md:text-4xl dark:text-white">Vente chatons</h2>
      <h2 class="mb-2 mt-4 text-lg font-semibold dark:text-white">Nos chatons quittent l’élevage :</h2>
      <ul class="max-w-md space-y-1 list-disc list-inside dark:text-white">
        <li>A partir de 3 mois au minimum</li>
        <li>Avec un carnet de santé</li>
        <li>Vaccinés</li>
        <li>Vermifugés</li>
        <li>Identifiés par puce électronique</li>
        <li>Avec un certificat de bonne santé établi par le vétérinaire</li>
        <li>Avec la copie des tests ADN et échographique des parents</li>
        <li>Le pédigrée LOOF ou le numéro provisoire</li>
        <li>Un contrat de vente</li>
        <li>Un kit chaton</li>
      </ul>
    </div>
    <div >
      <h2 class="mb-4 text-2xl font-extrabold leading-none tracking-tight md:text-4xl dark:text-white">Quelques précautions</h2>
      <p class="my-4 dark:text-white">Vous êtes décidés, vous allez acquérir le chaton de vos rêves.<br>
        Il est utile de bien vous renseigner et de prendre quelques précautions.<br>
        Internet est un outil efficace, mais attention car on y trouve le meilleur comme le pire:</p>

      <ul class="space-y-1 list-disc list-inside dark:text-white">
        <li>Attention aux prix bas, l’élevage de chats de race est une activité qui coûte cher quand elle est pratiquée correctement.</li>
        <li>Assurez-vous que le chaton a bien un pedigree LOOF.</li>
        <li>N’hésitez pas à poser des questions par mail ou par téléphone.</li>
        <li>N’hésitez pas à vous rendre chez l’éleveur afin de vous rendre compte de la qualité de vie des chats.</li>
        <li>Demandez les tests ADN et les échographies pour la HCM des parents.</li>
        <li>Ne récupérez pas votre chaton avant qu’il ait 3 mois, vacciné et muni d’un certificat de santé établi dans les 5 jours précédent l’arrivé du chaton.</li>
      </ul>
    </div>
  </div>

</template>

<style scoped>

</style>
