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
import { defineComponent, computed, onMounted } from 'vue'
import { useItemsStore } from '@/stores/items'
import useFriendsStore from '@/stores/friends'

export default defineComponent({
  name: 'StatsView',
  setup() {
    const itemsStore = useItemsStore()
    const friendsStore = useFriendsStore()

    onMounted(() => {
      itemsStore.loadFromLocalStorage()
      friendsStore.loadFromLocalStorage()
      friendsStore.updateAllStats()
    })

    const totalItems = computed(() => itemsStore.items.length)
    const activeItems = computed(() => itemsStore.activeItems.length)
    const overdueItems = computed(() => itemsStore.overdueItems.length)
    const totalValue = computed(() => itemsStore.totalBorrowedValue)

    const itemsByCategory = computed(() => {
      const cats: Record<string, number> = {}
      itemsStore.items.forEach(i => {
        cats[i.category] = (cats[i.category] || 0) + 1
      })
      return cats
    })

    const topFriends = computed(() => friendsStore.sortedByBorrowCount.slice(0, 5))

    function getCategoryName(cat: string) {
      const names: Record<string, string> = {
        elektronika: '💻 Elektronika',
        knihy: '📚 Knihy',
        naradie: '🔨 Náradie',
        sport: '⚽ Šport',
        ine: '📦 Iné'
      }
      return names[cat] || cat
    }

    return { totalItems, activeItems, overdueItems, totalValue, itemsByCategory, topFriends, getCategoryName }
  }
})
</script>

<style scoped>
.stats-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

h1 {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 32px;
  text-align: center;
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
  text-align: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.big-number {
  font-size: 36px;
  font-weight: 700;
  margin-top: 8px;
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
  margin-top: 16px;
}

.category-item,
.friend-item {
  display: flex;
  justify-content: space-between;
  padding: 12px;
  border-radius: 8px;
  background: #f9fafb;
  font-weight: 500;
}

.rank {
  font-weight: 700;
  color: #3b82f6;
  margin-right: 12px;
}
</style>
