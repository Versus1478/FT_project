<template>
  <div class="stats-view">
    <div class="header">
      <h1>Štatistiky a prehľady</h1>
      <p class="subtitle">Detailný pohľad na vaše požičané veci a aktivitu priateľov</p>
    </div>

    <div class="stats-grid">
      <div class="stat-card main-stat">
        <div class="stat-icon blue">📊</div>
        <div class="stat-info">
          <span class="stat-label">Celkový počet</span>
          <span class="stat-value">{{ totalItems }}</span>
        </div>
      </div>
      <div class="stat-card main-stat">
        <div class="stat-icon green">📦</div>
        <div class="stat-info">
          <span class="stat-label">Aktívne</span>
          <span class="stat-value">{{ activeItemsCount }}</span>
        </div>
      </div>
      <div class="stat-card main-stat">
        <div class="stat-icon red">⚠️</div>
        <div class="stat-info">
          <span class="stat-label">Po termíne</span>
          <span class="stat-value danger">{{ overdueItemsCount }}</span>
        </div>
      </div>
      <div class="stat-card main-stat">
        <div class="stat-icon gold">💰</div>
        <div class="stat-info">
          <span class="stat-label">Celková hodnota</span>
          <span class="stat-value">{{ totalValueSum }} €</span>
        </div>
      </div>
    </div>

    <div class="details-grid">
      <div class="content-card">
        <div class="card-header">
          <h2>📦 Podľa kategórie</h2>
        </div>
        <div class="category-list">
          <div v-if="Object.keys(itemsByCategory).length === 0" class="empty-mini">
            Žiadne kategórie na zobrazenie
          </div>
          <div v-for="(count, cat) in itemsByCategory" :key="cat" class="list-item">
            <div class="item-main">
              <span class="category-name">{{ getCategoryName(cat) }}</span>
              <div class="progress-bar-bg">
                <div
                    class="progress-bar-fill"
                    :style="{ width: (count / totalItems * 100) + '%' }"
                ></div>
              </div>
            </div>
            <span class="count-badge">{{ count }}</span>
          </div>
        </div>
      </div>

      <div class="content-card">
        <div class="card-header">
          <h2>🏆 Top priatelia</h2>
        </div>
        <div class="friends-list">
          <div v-if="displayTopFriends.length === 0" class="empty-mini">
            Zatiaľ tu nie sú žiadni priatelia
          </div>
          <div v-for="(friend, i) in displayTopFriends" :key="friend.id" class="list-item">
            <div class="friend-rank">
              <span class="rank-number">#{{ i + 1 }}</span>
              <div class="friend-avatar-mini">{{ friend.name[0] }}</div>
              <span class="friend-name">{{ friend.name }}</span>
            </div>
            <div class="friend-stats-brief">
              <span class="badge blue">{{ friend.borrowedCount }} ks</span>
              <span class="badge gray">{{ friend.totalValue }} €</span>
            </div>
          </div>
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
    itemsStore() { return useItemsStore() },
    friendsStore() { return useFriendsStore() },

    allItems() {
      return this.itemsStore.items || []
    },

    totalItems(): number {
      return this.allItems.length
    },

    activeItemsCount(): number {
      return this.allItems.filter(i => i.status !== 'returned').length
    },

    overdueItemsCount(): number {
      return this.allItems.filter(i => i.status === 'overdue').length
    },

    totalValueSum(): number {
      return this.allItems.reduce((sum, item) => sum + (Number(item.value) || 0), 0)
    },

    itemsByCategory(): Record<string, number> {
      const cats: Record<string, number> = {}
      this.allItems.forEach(i => {
        const category = i.category || 'ine'
        cats[category] = (cats[category] || 0) + 1
      })
      return cats
    },

    displayTopFriends() {
      const allFriends = this.friendsStore.friends || []
      return allFriends.map(friend => {
        const friendItems = this.allItems.filter((item: any) => {
          const matchId = item.friendId === friend.id
          const matchNestedId = item.friend && item.friend.id === friend.id
          const matchName = item.friend && item.friend.name === friend.name

          return matchId || matchNestedId || matchName
        })

        return {
          ...friend,
          borrowedCount: friendItems.length,
          totalValue: friendItems.reduce((sum, item) => sum + (Number(item.value) || 0), 0)
        }
      })
          .sort((a, b) => b.borrowedCount - a.borrowedCount)
          .slice(0, 5)
    }
  },

  mounted() {
    this.itemsStore.loadFromLocalStorage()
    this.friendsStore.loadFromLocalStorage()

    if (typeof this.friendsStore.updateAllStats === 'function') {
      this.friendsStore.updateAllStats()
    }
  },

  methods: {
    getCategoryName(cat: string): string {
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
  padding: 32px 24px;
}

.header {
  text-align: center;
  margin-bottom: 40px;
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

/* Hlavná mriežka štatistík */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.stat-card {
  background: white;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 16px;
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-4px);
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.stat-icon.blue { background: #eff6ff; }
.stat-icon.green { background: #ecfdf5; }
.stat-icon.red { background: #fef2f2; }
.stat-icon.gold { background: #fffbeb; }

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-label {
  font-size: 13px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.stat-value {
  font-size: 28px;
  font-weight: 800;
  color: #111827;
}

.stat-value.danger {
  color: #ef4444;
}

/* Detaily */
.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
  gap: 24px;
}

.content-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.card-header h2 {
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 24px;
}

.list-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: #f9fafb;
  border-radius: 12px;
  margin-bottom: 12px;
}

.item-main {
  flex: 1;
  margin-right: 20px;
}

.category-name {
  font-weight: 600;
  font-size: 14px;
  display: block;
  margin-bottom: 8px;
}

.progress-bar-bg {
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background: #3b82f6;
  border-radius: 4px;
}

.count-badge {
  background: #3b82f6;
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-weight: 700;
  font-size: 14px;
}

.friend-rank {
  display: flex;
  align-items: center;
  gap: 12px;
}

.rank-number {
  font-weight: 800;
  color: #3b82f6;
  width: 30px;
}

.friend-avatar-mini {
  width: 32px;
  height: 32px;
  background: #6366f1;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 12px;
}

.friend-name {
  font-weight: 600;
}

.friend-stats-brief {
  display: flex;
  gap: 8px;
}

.badge {
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
}

.badge.blue { background: #dbeafe; color: #1e40af; }
.badge.gray { background: #f3f4f6; color: #374151; }

.empty-mini {
  text-align: center;
  color: #9ca3af;
  padding: 20px;
}

@media (max-width: 640px) {
  .details-grid {
    grid-template-columns: 1fr;
  }
}
</style>