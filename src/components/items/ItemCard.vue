<template>
  <div class="item-card" :class="`status-${item.status}`">
    <div class="item-header">
      <div class="item-icon">{{ categoryIcon }}</div>
      <StatusBadge :status="item.status" />
    </div>

    <div class="item-body">
      <h3>{{ item.itemName }}</h3>
      <p class="description">{{ item.description }}</p>

      <div class="item-meta">
        <div class="meta-row">
          <span class="label">Požičané:</span>
          <span class="value">{{ item.friend.name }}</span>
        </div>
        <div class="meta-row">
          <span class="label">Vrátiť do:</span>
          <span class="value" :class="{ overdue: isOverdue }">
            {{ formatDate(item.expectedReturn) }}
          </span>
        </div>
        <div class="meta-row">
          <span class="label">Hodnota:</span>
          <span class="value">{{ item.value }} €</span>
        </div>
      </div>
    </div>

    <div class="item-footer">
      <button v-if="item.status !== 'returned'" @click="$emit('return', item.id)" class="btn btn-success">
        Vrátiť
      </button>
      <button @click="$emit('view', item.id)" class="btn btn-secondary">
        Detail
      </button>
      <button @click="handleDelete" class="btn btn-danger">
        ×
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import type { BorrowedItem } from '@/types/Item'
import StatusBadge from '@/components/common/StatusBadge.vue'
import { format } from 'date-fns'
import { sk } from 'date-fns/locale'

export default defineComponent({
  name: 'ItemCard',

  components: { StatusBadge },

  props: {
    item: {
      type: Object as PropType<BorrowedItem>,
      required: true
    }
  },

  emits: ['return', 'view', 'delete'],

  computed: {
    isOverdue(): boolean {
      if (this.item.status === 'returned') return false
      return new Date(this.item.expectedReturn) < new Date()
    },

    categoryIcon(): string {
      const icons: Record<string, string> = {
        elektronika: '💻',
        knihy: '📚',
        naradie: '🔨',
        sport: '⚽',
        ine: '📦'
      }
      return icons[this.item.category] || '📦'
    }
  },

  methods: {
    formatDate(dateStr: string): string {
      return format(new Date(dateStr), 'd.M.yyyy', { locale: sk })
    },

    handleDelete(): void {
      if (confirm(`Vymazať "${this.item.itemName}"?`)) {
        this.$emit('delete', this.item.id)
      }
    }
  }
})
</script>

<style scoped>
.item-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s;
}

.item-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.item-header {
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item-icon {
  font-size: 48px;
}

.item-body {
  padding: 20px;
}

.item-body h3 {
  font-size: 18px;
  margin: 0 0 8px 0;
}

.description {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 16px 0;
}

.item-meta {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.meta-row {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
}

.label {
  color: #6b7280;
}

.value {
  font-weight: 500;
}

.value.overdue {
  color: #ef4444;
  font-weight: 600;
}

.item-footer {
  padding: 16px 20px;
  background: #f9fafb;
  display: flex;
  gap: 8px;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  flex: 1;
}

.btn-success {
  background: #10b981;
  color: white;
}

.btn-success:hover {
  background: #059669;
}

.btn-secondary {
  background: #3b82f6;
  color: white;
}

.btn-secondary:hover {
  background: #2563eb;
}

.btn-danger {
  background: #ef4444;
  color: white;
  flex: 0 0 40px;
  font-size: 20px;
}

.btn-danger:hover {
  background: #dc2626;
}

.status-overdue .item-header {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
}

.status-returned .item-header {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}
</style>