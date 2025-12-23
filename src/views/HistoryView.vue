<template>
  <div class="history-view">
    <h1>História vrátených vecí</h1>

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
  mounted() {
    this.itemsStore.loadFromLocalStorage()
  },
  methods: {
    handleView(id: string) {
      this.$router.push({ name: 'ItemDetail', params: { id } })
    },
    handleDelete(id: string) {
      this.itemsStore.deleteItem(id)
    }
  }
})
</script>

<style scoped>
.history-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}
h1 {
  margin-bottom: 32px;
}
.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
}
.empty-state {
  text-align: center;
  padding: 64px;
}
.empty-icon {
  font-size: 64px;
}
</style>