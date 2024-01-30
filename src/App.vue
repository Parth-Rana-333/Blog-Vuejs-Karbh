<script setup lang="ts">
import NavBar from './components/NavBar.vue';
</script>

<template>
  <div class="bg-gray-200 h-screen">
    <NavBar />
  
    <main>
      <router-view />
    </main>
  </div>
</template>

<style scoped>
</style>