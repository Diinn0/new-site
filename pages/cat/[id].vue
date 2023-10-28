<script setup lang="ts">
import { useFirestore } from 'vuefire'
import {doc} from "@firebase/firestore";
import {collection} from "firebase/firestore";
const db = useFirestore()
const route = useRoute()


const cat = doc(db, 'chat', route.params.id.toString())
console.log(cat)

</script>

<template>

</template>

<style scoped>

</style>