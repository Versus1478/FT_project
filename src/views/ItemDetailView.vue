<template>
  <div class="item-detail-view">
    <div v-if="item" class="detail-card">
      <div class="card-top-bar">
        <button @click="$router.push('/')" class="btn-back-highlight">
          <span class="icon">←</span> Späť na prehľad
        </button>
      </div>

      <div class="card-header">
        <div class="title-group">
          <h1>{{ item.itemName }}</h1>
          <span :class="['status-badge', getStatusClass(item.status)]">
            {{ formatStatusLabel(item.status) }}
          </span>
        </div>
        <div class="category-tag">
          {{ getCategoryLabel(item.category) }}
        </div>
      </div>

      <div class="card-body">
        <div class="info-section">
          <h3>Všeobecné informácie</h3>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">Popis:</span>
              <span class="value">{{ item.description || 'Bez popisu' }}</span>
            </div>
            <div class="info-item">
              <span class="label">Hodnota:</span>
              <span class="value highlight-price">{{ item.value }} €</span>
            </div>
            <div class="info-item">
              <span class="label">Požičal si:</span>
              <span class="value friend-name">👤 {{ item.friend.name }}</span>
            </div>
          </div>
        </div>

        <div class="info-section">
          <h3>Časová os</h3>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">Dátum vypožičania:</span>
              <span class="value">{{ formatDateDisplay(item.borrowedDate) }}</span>
            </div>
            <div class="info-item">
              <span class="label">Predpokladané vrátenie:</span>
              <span class="value">{{ formatDateDisplay(item.expectedReturn) }}</span>
            </div>
            <div v-if="item.actualReturn" class="info-item">
              <span class="label">Vrátené dňa:</span>
              <span class="value success-text">{{ formatDateDisplay(item.actualReturn) }}</span>
            </div>
          </div>
        </div>

        <div v-if="item.notes" class="info-section">
          <h3>Poznámky</h3>
          <div class="notes-display">
            {{ item.notes }}
          </div>
        </div>
      </div>

      <div class="card-footer">
        <div class="action-buttons">
          <button
              v-if="item.status !== 'returned'"
              @click="processReturn"
              class="btn btn-success"
          >
            Označiť ako vrátené
          </button>
          <button @click="processDelete" class="btn btn-danger-outline">
            Vymazať záznam
          </button>
        </div>
      </div>
    </div>

    <div v-else class="not-found-state">
      <div class="empty-icon">🔍</div>
      <h2>Záznam sa nenašiel</h2>
      <p>Položka, ktorú hľadáte, neexistuje alebo bola odstránená.</p>
      <button @click="$router.push('/')" class="btn btn-primary">Späť na zoznam</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useItemsStore } from '@/stores/items'
import { format } from 'date-fns'
import { sk } from 'date-fns/locale'

export default defineComponent({
  name: 'ItemDetailView',
  props: {
    id: { type: String, required: true }
  },
  data() {
    return {
      itemsStore: useItemsStore()
    }
  },
  computed: {
    item() {
      return this.itemsStore.getItemById(this.id)
    }
  },
  methods: {
    formatDateDisplay(dateString: string) {
      if (!dateString) return '-'
      return format(new Date(dateString), 'd. MMMM yyyy', { locale: sk })
    },
    getCategoryLabel(category: string) {
      const categories: Record<string, string> = {
        elektronika: '💻 Elektronika',
        knihy: '📚 Knihy',
        naradie: '🔨 Náradie',
        sport: '⚽ Šport',
        ine: '📦 Iné'
      }
      return categories[category] || category
    },
    formatStatusLabel(status: string) {
      const labels: Record<string, string> = {
        borrowed: 'Požičané',
        overdue: 'Po termíne',
        returned: 'Vrátené'
      }
      return labels[status] || status
    },
    getStatusClass(status: string) {
      return {
        'status-borrowed': status === 'borrowed',
        'status-overdue': status === 'overdue',
        'status-returned': status === 'returned'
      }
    },
    processReturn() {
      this.itemsStore.returnItem(this.id)
    },
    processDelete() {
      if (confirm('Naozaj chcete tento záznam natrvalo vymazať?')) {
        this.itemsStore.deleteItem(this.id)
        this.$router.push('/')
      }
    }
  }
})
</script>

<style scoped>
.item-detail-view {
  max-width: 850px;
  margin: 0 auto;
  padding: 40px 20px;
}

.detail-card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.card-top-bar {
  padding: 24px 32px 0 32px;
}

.btn-back-highlight {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  color: #4b5563;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-back-highlight:hover {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.card-header {
  padding: 24px 32px 32px 32px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  border-bottom: 1px solid #f3f4f6;
}

.title-group h1 {
  font-size: 32px;
  font-weight: 800;
  color: #111827;
  margin: 0 0 12px 0;
}

.status-badge {
  padding: 6px 14px;
  border-radius: 30px;
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
}

.status-borrowed { background: #eff6ff; color: #1d4ed8; }
.status-overdue { background: #fff1f2; color: #e11d48; }
.status-returned { background: #f0fdf4; color: #15803d; }

.category-tag {
  background: #f9fafb;
  padding: 10px 18px;
  border-radius: 12px;
  font-weight: 700;
  border: 1px solid #f3f4f6;
}

.card-body {
  padding: 32px;
}

.info-section {
  margin-bottom: 32px;
}

.info-section h3 {
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  color: #9ca3af;
  margin-bottom: 16px;
  letter-spacing: 0.05em;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 24px;
}

.info-item {
  display: flex;
  flex-direction: column;
}

.label {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 4px;
}

.value {
  font-size: 17px;
  font-weight: 600;
  color: #1f2937;
}

.highlight-price {
  color: #3b82f6;
  font-size: 20px;
  font-weight: 800;
}

.notes-display {
  background: #f9fafb;
  padding: 20px;
  border-radius: 12px;
  color: #4b5563;
  line-height: 1.6;
  border: 1px solid #f3f4f6;
}

.card-footer {
  padding: 32px;
  background: #fafafa;
  border-top: 1px solid #f3f4f6;
}

.action-buttons {
  display: flex;
  gap: 16px;
}

.btn {
  padding: 14px 28px;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-success {
  background: #10b981;
  color: white;
  border: none;
  flex: 2;
}

.btn-success:hover {
  background: #059669;
  transform: translateY(-2px);
}

.btn-danger-outline {
  background: transparent;
  color: #ef4444;
  border: 2px solid #fee2e2;
  flex: 1;
}

.btn-danger-outline:hover {
  background: #fef2f2;
}

.btn-primary {
  background: #3b82f6;
  color: white;
  border: none;
}

.not-found-state {
  text-align: center;
  padding: 80px 40px;
  background: white;
  border-radius: 20px;
}

.empty-icon { font-size: 60px; margin-bottom: 20px; }
</style>