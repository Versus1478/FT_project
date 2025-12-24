<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <h1>Moje požičky</h1>
      <router-link to="/add-item" class="btn btn-primary">+ Pridať požičku</router-link>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">📦</div>
        <div class="stat-content">
          <div class="stat-value">{{ activeItemsCount }}</div>
          <div class="stat-label">Aktívne</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">⚠️</div>
        <div class="stat-content">
          <div class="stat-value">{{ overdueItemsCount }}</div>
          <div class="stat-label">Po termíne</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">💰</div>
        <div class="stat-content">
          <div class="stat-value">{{ totalValue }} €</div>
          <div class="stat-label">Hodnota</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">✅</div>
        <div class="stat-content">
          <div class="stat-value">{{ returnedItemsCount }}</div>
          <div class="stat-label">Vrátené</div>
        </div>
      </div>
    </div>

    <div class="filters">
      <input v-model="searchQuery" type="text" placeholder="Hľadať..." class="search-input" />
      <select v-model="filterStatus" class="filter-select">
        <option value="all">Všetky statusy</option>
        <option value="borrowed">Požičané</option>
        <option value="overdue">Po termíne</option>
        <option value="returned">Vrátené</option>
      </select>
      <select v-model="filterCategory" class="filter-select">
        <option value="all">Všetky kategórie</option>
        <option value="elektronika">Elektronika</option>
        <option value="knihy">Knihy</option>
        <option value="naradie">Náradie</option>
        <option value="sport">Šport</option>
        <option value="ine">Iné</option>
      </select>
    </div>

    <div v-if="filteredItems.length" class="items-grid">
      <ItemCard
          v-for="item in filteredItems"
          :key="item.id"
          :item="item"
          @return="handleReturn"
          @view="handleView"
          @delete="handleDelete"
      />
    </div>

    <div v-else class="empty-state">
      <div class="empty-icon">📭</div>
      <h2>Žiadne požičky</h2>
      <router-link to="/add-item" class="btn btn-primary">Pridať požičku</router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useItemsStore } from '@/stores/items'
import useFriendsStore from '@/stores/friends'
import ItemCard from '@/components/items/ItemCard.vue'
import type { BorrowedItem } from '@/types/Item'

export default defineComponent({
  name: 'DashboardView',
  components: { ItemCard },
  data() {
    return {
      searchQuery: '',
      filterStatus: 'all',
      filterCategory: 'all'
    }
  },
  computed: {
    itemsStore() {
      return useItemsStore()
    },
    friendsStore() {
      return useFriendsStore()
    },
    activeItemsCount() {
      return this.itemsStore.activeItems.length
    },
    overdueItemsCount() {
      return this.itemsStore.overdueItems.length
    },
    returnedItemsCount() {
      return this.itemsStore.returnedItems.length
    },
    totalValue() {
      return this.itemsStore.totalBorrowedValue
    },
    filteredItems(): BorrowedItem[] {
      let items = this.itemsStore.items
      if (this.searchQuery) {
        const q = this.searchQuery.toLowerCase()
        items = items.filter(i =>
            i.itemName.toLowerCase().includes(q) ||
            i.description.toLowerCase().includes(q) ||
            i.friend.name.toLowerCase().includes(q)
        )
      }
      if (this.filterStatus !== 'all') {
        items = items.filter(i => i.status === this.filterStatus)
      }
      if (this.filterCategory !== 'all') {
        items = items.filter(i => i.category === this.filterCategory)
      }
      return items
    }
  },
  methods: {
    handleReturn(id: string) {
      this.itemsStore.returnItem(id)
      this.friendsStore.updateAllStats()
    },
    handleView(id: string) {
      this.$router.push({ name: 'ItemDetail', params: { id } })
    },
    handleDelete(id: string) {
      this.itemsStore.deleteItem(id)
      this.friendsStore.updateAllStats()
    }
  }
})
</script>

<style scoped>
.dashboard {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

h1 {
  font-size: 32px;
  font-weight: 700;
  color: #1f2937;
}

.btn {
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
}

.btn-primary {
  background: #3b82f6;
  color: white;
  transition: background 0.2s;
}

.btn-primary:hover {
  background: #2563eb;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}

.stat-icon {
  font-size: 36px;
}

.stat-content {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #111827;
}

.stat-label {
  font-size: 14px;
  color: #6b7280;
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 24px;
}

.search-input,
.filter-select {
  padding: 10px 14px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  font-size: 14px;
}

.search-input {
  flex: 1;
}

.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
}

.empty-state {
  text-align: center;
  padding: 64px 24px;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
}
</style>
