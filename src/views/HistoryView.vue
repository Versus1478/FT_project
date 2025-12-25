<template>
  <v-container fluid class="history-view">
    <h1 class="page-title">História vrátených vecí</h1>

    <v-row v-if="returnedItems.length" dense>
      <v-col
          v-for="item in returnedItems"
          :key="item.id"
          cols="12"
          sm="6"
          md="4"
          lg="3"
      >
        <ItemCard
            :item="item"
            @view="handleView"
            @delete="handleDelete"
        />
      </v-col>
    </v-row>

    <div v-else class="empty-state">
      <div class="empty-icon">📜</div>
      <h2>Žiadna história</h2>
    </div>
  </v-container>
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

<style scoped>
.history-view {
  padding: 16px;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 24px;
}

.empty-state {
  text-align: center;
  margin-top: 64px;
  color: #6b7280;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}
</style>
