<script setup lang="ts">
import {
  getRedirectResult,
  signInWithRedirect,
  signOut,
  GoogleAuthProvider
} from 'firebase/auth'
import { useCurrentUser, useFirebaseAuth } from 'vuefire'

const googleAuthProvider = new GoogleAuthProvider()

  definePageMeta({
    layout: false
  })

  const auth = useFirebaseAuth();

  // display errors if any
  const error = ref(null)
  function signinRedirect() {
    signInWithRedirect(auth, googleAuthProvider).then(() => {
          //  navigateTo({
          //   path: '/',
          // })
      }).catch((reason) => {
      console.error('Failed signinRedirect', reason)
      error.value = reason
    })
  }

  // only on client side
  onMounted(() => {
    getRedirectResult(auth).then(() => {
      // navigateTo({
      //   path: '/',
      // })
    }).catch((reason) => {
      console.error('Failed redirect result', reason)
      error.value = reason
    })
  })

</script>

<template>
<!--  <ErrorBox v-if="error" :error="error" />-->
  <button @click="signinRedirect()">SignIn with Google</button>
</template>

<style scoped>

</style>
