<template>
  <div class="history-view">
    <div class="header">
      <h1>História vrátených vecí</h1>
      <p class="subtitle">Prehľad všetkých predmetov, ktoré boli úspešne vrátené</p>
    </div>

    <div v-if="returnedItems.length > 0" class="items-grid">
      <ItemCard
          v-for="item in returnedItems"
          :key="item.id"
          :item="item"
          @view="handleView"
          @delete="handleDelete"
      />
    </div>

    <div v-else class="empty-state">
      <div class="empty-icon">📜</div>
      <h2>Žiadna história</h2>
      <p>Zatiaľ ste neoznačili žiadnu požičanú vec za vrátenú.</p>
      <router-link to="/" class="btn btn-primary">Späť na prehľad</router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useItemsStore } from '@/stores/items'
import ItemCard from '@/components/items/ItemCard.vue'

export default defineComponent({
  name: 'HistoryView',
  components: { ItemCard },

  computed: {
    itemsStore() {
      return useItemsStore()
    },
    returnedItems() {
      return this.itemsStore.returnedItems
    }
  },

  methods: {
    handleView(id: string) {
      this.$router.push({ name: 'ItemDetail', params: { id } })
    },
    handleDelete(id: string) {
      if (confirm('Naozaj chcete natrvalo odstrániť tento záznam z histórie?')) {
        this.itemsStore.deleteItem(id)
      }
    }
  }
})
</script>

<style scoped>
.history-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 24px;
}

.header {
  margin-bottom: 32px;
}

h1 {
  font-size: 32px;
  font-weight: 800;
  color: #1f2937;
  margin-bottom: 8px;
}

.subtitle {
  color: #6b7280;
  font-size: 16px;
}

.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

.empty-state {
  text-align: center;
  padding: 80px 24px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 24px;
  opacity: 0.8;
}

.empty-state h2 {
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 12px;
}

.empty-state p {
  color: #6b7280;
  margin-bottom: 32px;
  font-size: 16px;
}

.btn {
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  display: inline-block;
  transition: all 0.2s;
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background: #2563eb;
  transform: translateY(-1px);
}

@media (max-width: 640px) {
  .items-grid {
    grid-template-columns: 1fr;
  }

  h1 {
    font-size: 28px;
  }
}
</style>