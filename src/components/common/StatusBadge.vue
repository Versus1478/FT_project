<template>
  <span class="status-badge" :class="badgeClass">
    {{ statusText }}
  </span>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import type { ItemStatus } from '@/types/Item'

export default defineComponent({
  name: 'StatusBadge',

  props: {
    status: {
      type: String as PropType<ItemStatus>,
      required: true
    }
  },

  computed: {
    statusText(): string {
      const texts: Record<ItemStatus, string> = {
        borrowed: 'Požičané',
        returned: 'Vrátené',
        overdue: 'Po termíne'
      }
      return texts[this.status]
    },

    badgeClass(): string {
      return `badge-${this.status}`
    }
  }
})
</script>

<style scoped>
.status-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.badge-borrowed {
  background: #3b82f6;
  color: white;
}

.badge-returned {
  background: #10b981;
  color: white;
}

.badge-overdue {
  background: #ef4444;
  color: white;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}
</style>