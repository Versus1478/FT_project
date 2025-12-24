<template>
  <div class="history-view">
    <h1>História vrátených vecí</h1>

    <div v-if="returnedItems.length" class="items-grid">
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
