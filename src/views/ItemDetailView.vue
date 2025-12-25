<template>
  <div class="item-detail-container">
    <button @click="$router.push('/')" class="back-btn">← Späť</button>

    <div v-if="item" class="detail-card">
      <div class="detail-header">
        <h1>{{ item.itemName }}</h1>
        <span :class="statusClass(item.status)" class="status-badge">{{ item.status }}</span>
      </div>

      <div class="detail-body">
        <div class="info-row"><span class="label">Kategória:</span><span>{{ getCategoryName(item.category) }}</span></div>
        <div class="info-row"><span class="label">Popis:</span><span>{{ item.description || '-' }}</span></div>
        <div class="info-row"><span class="label">Hodnota:</span><span>{{ item.value }} €</span></div>
        <div class="info-row"><span class="label">Požičané:</span><span>{{ item.friend.name }}</span></div>
        <div class="info-row"><span class="label">Dátum požičania:</span><span>{{ formatDate(item.borrowedDate) }}</span></div>
        <div class="info-row"><span class="label">Vrátiť do:</span><span>{{ formatDate(item.expectedReturn) }}</span></div>
        <div v-if="item.actualReturn" class="info-row"><span class="label">Vrátené:</span><span>{{ formatDate(item.actualReturn) }}</span></div>
        <div v-if="item.notes" class="info-row"><span class="label">Poznámky:</span><span>{{ item.notes }}</span></div>
      </div>

      <div class="actions">
        <button v-if="item.status !== 'returned'" @click="handleReturn" class="btn btn-success">Označiť ako vrátené</button>
        <button @click="handleDelete" class="btn btn-danger">Vymazať</button>
      </div>
    </div>

    <div v-else class="not-found">
      <h2>Požička nenájdená</h2>
      <button @click="$router.push('/')" class="btn btn-primary">Späť</button>
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
  props: { id: { type: String, required: true } },

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
    formatDate(d: string) {
      return format(new Date(d), 'd.M.yyyy', { locale: sk })
    },

    getCategoryName(cat: string) {
      return {
        elektronika: '💻 Elektronika',
        knihy: '📚 Knihy',
        naradie: '🔨 Náradie',
        sport: '⚽ Šport',
        ine: '📦 Iné'
      }[cat] || cat
    },

    statusClass(status: string) {
      switch (status) {
        case 'borrowed': return 'status-borrowed'
        case 'overdue': return 'status-overdue'
        case 'returned': return 'status-returned'
        default: return 'status-default'
      }
    },

    handleReturn() {
      this.itemsStore.returnItem(this.id)
    },

    handleDelete() {
      if (confirm('Vymazať?')) {
        this.itemsStore.deleteItem(this.id)
        this.$router.push('/')
      }
    }
  }
})
</script>

<style scoped>
.item-detail-container {
  max-width: 800px;
  margin: 40px auto;
  padding: 0 20px;
  font-family: Arial, sans-serif;
}

.back-btn {
  margin-bottom: 20px;
  color: #3b82f6;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
}

.detail-card {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  padding: 30px;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.detail-header h1 {
  font-size: 24px;
  margin: 0;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 14px;
  color: #fff;
  text-transform: capitalize;
}

.status-borrowed { background-color: #3b82f6; }
.status-overdue { background-color: #ef4444; }
.status-returned { background-color: #10b981; }
.status-default { background-color: #6b7280; }

.detail-body {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
  border-bottom: 1px solid #e5e7eb;
}

.label {
  font-weight: 600;
}

.actions {
  margin-top: 20px;
  display: flex;
  gap: 10px;
}

.btn {
  padding: 10px 20px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-weight: 600;
}

.btn-success { background-color: #10b981; color: white; }
.btn-success:hover { background-color: #059669; }

.btn-danger { background-color: #ef4444; color: white; }
.btn-danger:hover { background-color: #dc2626; }

.btn-primary { background-color: #3b82f6; color: white; }
.btn-primary:hover { background-color: #2563eb; }

.not-found {
  text-align: center;
  padding: 60px 0;
}
</style>
