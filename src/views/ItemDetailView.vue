<template>
  <div class="item-detail">
    <div v-if="item" class="detail-card">
      <button @click="$router.push('/')" class="back-btn">← Späť</button>

      <div class="detail-header">
        <h1>{{ item.itemName }}</h1>
        <StatusBadge :status="item.status" />
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
      <button @click="$router.push('/')" class="btn">Späť</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useItemsStore } from '@/stores/items'
import StatusBadge from '@/components/common/StatusBadge.vue'
import { format } from 'date-fns'
import { sk } from 'date-fns/locale'

export default defineComponent({
  name: 'ItemDetailView',
  components: { StatusBadge },
  props: { id: { type: String, required: true } },

  computed: {
    itemsStore() {
      return useItemsStore()
    },
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
