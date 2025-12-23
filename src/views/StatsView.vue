<template>
  <div class="stats-view">
    <h1>Štatistiky</h1>

    <div class="stats-grid">
      <div class="stat-card">
        <h3>Celkový počet</h3>
        <p class="big-number">{{ totalItems }}</p>
      </div>
      <div class="stat-card">
        <h3>Aktívne</h3>
        <p class="big-number">{{ activeItems }}</p>
      </div>
      <div class="stat-card">
        <h3>Po termíne</h3>
        <p class="big-number danger">{{ overdueItems }}</p>
      </div>
      <div class="stat-card">
        <h3>Hodnota</h3>
        <p class="big-number">{{ totalValue }} €</p>
      </div>
    </div>

    <div class="section">
      <h2>Podľa kategórie</h2>
      <div class="category-list">
        <div v-for="(count, cat) in itemsByCategory" :key="cat" class="category-item">
          <span>{{ getCategoryName(cat) }}</span>
          <span class="count">{{ count }}</span>
        </div>
      </div>
    </div>

    <div class="section">
      <h2>Top požičiavači</h2>
      <div class="friends-list">
        <div v-for="(friend, i) in topFriends" :key="friend.id" class="friend-item">
          <span class="rank">{{ i + 1 }}.</span>
          <span>{{ friend.name }}</span>
          <span>{{ friend.borrowedCount }} vecí ({{ friend.totalValue }} €)</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useItemsStore } from '@/stores/items'
import useFriendsStore from '@/stores/friends'

export default defineComponent({
  name: 'StatsView',
  computed: {
    itemsStore() {
      return useItemsStore()
    },
    friendsStore() {
      return useFriendsStore()
    },
    totalItems() {
      return this.itemsStore.items.length
    },
    activeItems() {
      return this.itemsStore.activeItems.length
    },
    overdueItems() {
      return this.itemsStore.overdueItems.length
    },
    totalValue() {
      return this.itemsStore.totalBorrowedValue
    },
    itemsByCategory() {
      const cats: Record<string, number> = {}
      this.itemsStore.items.forEach(i => {
        cats[i.category] = (cats[i.category] || 0) + 1
      })
      return cats
    },
    topFriends() {
      return this.friendsStore.sortedByBorrowCount.slice(0, 5)
    }
  },
  mounted() {
    this.itemsStore.loadFromLocalStorage()
    this.friendsStore.loadFromLocalStorage()
    this.friendsStore.updateAllStats()
  },
  methods: {
    getCategoryName(cat: string) {
      const names: Record<string, string> = {
        elektronika: '💻 Elektronika',
        knihy: '📚 Knihy',
        naradie: '🔨 Náradie',
        sport: '⚽ Šport',
        ine: '📦 Iné'
      }
      return names[cat] || cat
    }
  }
})
</script>

<style scoped>
.stats-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}
.stat-card {
  background: white;
  padding: 24px;
  border-radius: 12px;
}
.big-number {
  font-size: 36px;
  font-weight: 700;
  margin: 8px 0 0 0;
}
.big-number.danger {
  color: #ef4444;
}
.section {
  background: white;
  padding: 32px;
  border-radius: 12px;
  margin-bottom: 24px;
}
.category-list,
.friends-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.category-item,
.friend-item {
  display: flex;
  justify-content: space-between;
  padding: 12px;
  background: #f9fafb;
  border-radius: 8px;
}
.rank {
  font-weight: 700;
  color: #3b82f6;
  margin-right: 12px;
}
</style>