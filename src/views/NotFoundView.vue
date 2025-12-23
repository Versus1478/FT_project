<template>
  <div class="not-found">
    <h1>404</h1>
    <h2>Stránka nenájdená</h2>
    <router-link to="/" class="btn">Domov</router-link>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'NotFoundView'
})
</script>

<style scoped>
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
}
h1 {
  font-size: 96px;
  color: #3b82f6;
  margin: 0;
}
h2 {
  font-size: 32px;
  margin: 16px 0 32px 0;
}
.btn {
  padding: 12px 24px;
  background: #3b82f6;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
}
</style>