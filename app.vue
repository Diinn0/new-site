<script setup>
import 'flowbite';

import { onMounted } from 'vue'
import { initFlowbite } from 'flowbite'
const router = useRouter()
const route = useRoute()
const user = useCurrentUser()

// initialize components based on data attribute selectors
onMounted(() => {
  initFlowbite();

  watch(user, (user, prevUser) => {
    if (prevUser && !user) {
      // user logged out
      router.push('/login')
    } else if (user && typeof route.query.redirect === 'string') {
      // user logged in
      router.push(route.query.redirect)
    }
  })
})

</script>

<template>
  <NuxtLayout>
    <NuxtPage/>
    <h1>Hello World!</h1>

  </NuxtLayout>
</template>
