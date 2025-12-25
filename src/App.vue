<template>
  <v-app id="app">
    <v-app-bar app color="white" flat elevate-on-scroll>
      <v-container class="d-flex justify-space-between align-center" fluid>
        <router-link to="/" class="logo">📦 Borrow Tracker</router-link>

        <v-btn-toggle rounded class="nav-links">
          <router-link to="/" class="nav-link">Dashboard</router-link>
          <router-link to="/friends" class="nav-link">Priatelia</router-link>
          <router-link to="/history" class="nav-link">História</router-link>
          <router-link to="/stats" class="nav-link">Štatistiky</router-link>
          <router-link to="/add-item" class="nav-link btn-add">+ Pridať</router-link>
        </v-btn-toggle>
      </v-container>
    </v-app-bar>

    <v-main class="app-main">
      <v-container class="main-content" fluid>
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </v-container>
    </v-main>

    <v-footer color="white" padless>
      <v-container class="footer-container text-center" fluid>
        <p>&copy; 2026 Borrow Tracker - Svider Vladyslav</p>
      </v-container>
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useItemsStore } from '@/stores/items'
import useFriendsStore from '@/stores/friends'

export default defineComponent({
  name: 'App',

  data() {
    return {
      itemsStore: useItemsStore(),
      friendsStore: useFriendsStore()
    }
  },

  mounted() {
    this.friendsStore.loadFromLocalStorage()
    this.itemsStore.loadFromLocalStorage()
    this.itemsStore.updateAllStatuses()
    this.friendsStore.updateAllStats()
  }
})
</script>

<style scoped>
.app-main {
  background: #f9fafb;
  min-height: 100vh;
}

.logo {
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
  text-decoration: none;
}

.nav-links {
  display: flex;
  gap: 8px;
}

.nav-link {
  padding: 8px 16px;
  border-radius: 6px;
  text-decoration: none;
  color: #6b7280;
  font-weight: 500;
  transition: all 0.2s;
}

.nav-link:hover {
  color: #1f2937;
  background: #f3f4f6;
}

.nav-link.router-link-active {
  color: #3b82f6;
  background: #dbeafe;
}

.btn-add {
  background: #3b82f6;
  color: white !important;
  margin-left: 8px;
}

.btn-add:hover {
  background: #2563eb !important;
}

.main-content {
  padding: 32px 0;
}

.footer-container {
  color: #6b7280;
  font-size: 14px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.v-main {
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
}
</style>
