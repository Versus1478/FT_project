<template>
  <div class="friends-view">
    <div class="header">
      <h1>Moji priatelia</h1>
      <button @click="showModal = true" class="btn btn-primary">+ Pridať priateľa</button>
    </div>

    <div v-if="friends.length > 0" class="friends-grid">
      <div v-for="friend in friends" :key="friend.id" class="friend-card">
        <div class="avatar">{{ getInitials(friend.name) }}</div>
        <div class="friend-info">
          <h3>{{ friend.name }}</h3>
          <div class="contact-info">
            <p>📧 {{ friend.email }}</p>
            <p>📱 {{ friend.phone }}</p>
          </div>
        </div>
        <div class="stats">
          <div class="stat-item">
            <span class="stat-value">{{ friend.borrowedCount }}</span>
            <span class="stat-label">Požičaných vecí</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ friend.totalValue }} €</span>
            <span class="stat-label">Celková hodnota</span>
          </div>
        </div>
        <div class="friend-actions">
          <button @click="viewFriendItems(friend.id)" class="btn btn-secondary btn-sm">
            Zobraziť veci
          </button>
          <button @click="handleDeleteFriend(friend.id)" class="btn btn-danger btn-sm">
            Vymazať
          </button>
        </div>
      </div>
    </div>

    <div v-else class="empty-state">
      <div class="empty-icon">👥</div>
      <h2>Žiadni priatelia</h2>
      <p>Pridajte svojich priateľov, aby ste mohli sledovať požičky</p>
      <button @click="showModal = true" class="btn btn-primary">+ Pridať prvého priateľa</button>
    </div>

    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>Pridať nového priateľa</h2>
          <button @click="closeModal" class="close-btn">&times;</button>
        </div>

        <form @submit.prevent="handleAddFriend" class="friend-form">
          <div class="form-group">
            <label for="name">Meno *</label>
            <input
                id="name"
                v-model="form.name"
                type="text"
                placeholder="napr. Ján Novák"
                required
                class="form-input"
            />
          </div>

          <div class="form-group">
            <label for="email">Email *</label>
            <input
                id="email"
                v-model="form.email"
                type="email"
                placeholder="jan@email.com"
                required
                class="form-input"
            />
          </div>

          <div class="form-group">
            <label for="phone">Telefón *</label>
            <input
                id="phone"
                v-model="form.phone"
                type="tel"
                placeholder="+421 900 123 456"
                required
                class="form-input"
            />
          </div>

          <div class="modal-actions">
            <button type="submit" class="btn btn-primary">Pridať priateľa</button>
            <button type="button" @click="closeModal" class="btn btn-secondary">Zrušiť</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import useFriendsStore from '@/stores/friends'
import type { Friend } from '@/types/Item'

export default defineComponent({
  name: 'FriendsView',

  data() {
    return {
      showModal: false,
      form: {
        name: '',
        email: '',
        phone: ''
      }
    }
  },

  computed: {
    friendsStore() {
      return useFriendsStore()
    },

    friends(): Friend[] {
      return this.friendsStore.friends
    }
  },

  mounted() {
    console.log('🔵 FriendsView mounted')
    this.friendsStore.loadFromLocalStorage()
    this.friendsStore.updateAllStats()

    if (this.friends.length === 0) {
      this.friendsStore.initMockData()
      this.friendsStore.updateAllStats()
    }
    console.log('👥 Friends loaded:', this.friends.length)
  },

  methods: {
    getInitials(name: string): string {
      return name
          .split(' ')
          .map(word => word[0])
          .join('')
          .toUpperCase()
          .substring(0, 2)
    },

    handleAddFriend() {
      if (!this.form.name.trim() || !this.form.email.trim() || !this.form.phone.trim()) {
        alert('Všetky polia sú povinné')
        return
      }

      console.log('➕ Adding friend:', this.form)

      this.friendsStore.addFriend({
        name: this.form.name.trim(),
        email: this.form.email.trim(),
        phone: this.form.phone.trim()
      })

      this.form = {
        name: '',
        email: '',
        phone: ''
      }

      this.showModal = false
      console.log('✅ Friend added, total friends:', this.friends.length)
    },

    handleDeleteFriend(id: string) {
      const friend = this.friendsStore.getFriendById(id)
      if (!friend) return

      if (!confirm(`Naozaj chcete vymazať ${friend.name}?`)) return

      try {
        this.friendsStore.deleteFriend(id)
        console.log('🗑️ Friend deleted:', friend.name)
      } catch (error: any) {
        alert(error.message)
        console.error('❌ Delete error:', error)
      }
    },

    viewFriendItems(friendId: string) {
      this.$router.push({
        name: 'Dashboard',
        query: { friendId }
      })
    },

    closeModal() {
      this.showModal = false
      this.form = {
        name: '',
        email: '',
        phone: ''
      }
    }
  }
})
</script>

<style scoped>
.friends-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

h1 {
  font-size: 32px;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.friends-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
}

.friend-card {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 16px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.friend-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  font-weight: 600;
  margin: 0 auto;
}

.friend-info {
  text-align: center;
}

.friend-info h3 {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 8px 0;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.contact-info p {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

.stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  padding: 16px 0;
  border-top: 1px solid #e5e7eb;
  border-bottom: 1px solid #e5e7eb;
}

.stat-item {
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
}

.stat-label {
  font-size: 12px;
  color: #6b7280;
}

.friend-actions {
  display: flex;
  gap: 8px;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-sm {
  padding: 8px 12px;
  font-size: 13px;
  flex: 1;
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background: #2563eb;
  transform: translateY(-1px);
}

.btn-secondary {
  background: #6b7280;
  color: white;
}

.btn-secondary:hover {
  background: #4b5563;
}

.btn-danger {
  background: #ef4444;
  color: white;
}

.btn-danger:hover {
  background: #dc2626;
}

.empty-state {
  text-align: center;
  padding: 64px 24px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.empty-state h2 {
  font-size: 24px;
  color: #1f2937;
  margin: 0 0 8px 0;
}

.empty-state p {
  font-size: 16px;
  color: #6b7280;
  margin: 0 0 24px 0;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-content {
  background: white;
  padding: 32px;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.modal-header h2 {
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 32px;
  color: #6b7280;
  cursor: pointer;
  line-height: 1;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: background 0.2s;
}

.close-btn:hover {
  background: #f3f4f6;
  color: #1f2937;
}

.friend-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.form-input {
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.2s;
  font-family: inherit;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.modal-actions {
  display: flex;
  gap: 12px;
  margin-top: 8px;
}

.modal-actions .btn {
  flex: 1;
}

@media (max-width: 768px) {
  .friends-grid {
    grid-template-columns: 1fr;
  }

  .modal-content {
    padding: 24px;
  }
}
</style>