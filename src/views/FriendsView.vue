<template>
  <div class="friends-view">
    <div class="header">
      <h1>Moji priatelia</h1>
      <button @click="showModal = true" class="btn btn-primary">+ Pridať</button>
    </div>

    <div v-if="friends.length > 0" class="friends-grid">
      <div v-for="friend in friends" :key="friend.id" class="friend-card">
        <div class="avatar">{{ getInitials(friend.name) }}</div>
        <h3>{{ friend.name }}</h3>
        <p>{{ friend.email }}</p>
        <p>{{ friend.phone }}</p>
        <div class="stats">
          <span>{{ friend.borrowedCount }} vecí</span>
          <span>{{ friend.totalValue }} €</span>
        </div>
        <button @click="deleteFriend(friend.id)" class="btn btn-delete">Vymazať</button>
      </div>
    </div>

    <div v-else class="empty-state">
      <div class="empty-icon">👥</div>
      <h2>Žiadni priatelia</h2>
      <p>Pridajte svojich priateľov, aby ste mohli sledovať požičky</p>
      <button @click="showModal = true" class="btn btn-primary">+ Pridať priateľa</button>
    </div>

    <div v-if="showModal" class="modal" @click="showModal = false">
      <div class="modal-content" @click.stop>
        <h2>Pridať priateľa</h2>
        <form @submit.prevent="addFriend">
          <input v-model="form.name" placeholder="Meno" required />
          <input v-model="form.email" type="email" placeholder="Email" required />
          <input v-model="form.phone" placeholder="Telefón" required />
          <button type="submit" class="btn btn-primary">Pridať</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue'
import useFriendsStore from '@/stores/friends'

export default defineComponent({
  name: 'FriendsView',
  setup() {
    const friendsStore = useFriendsStore()
    const showModal = ref(false)
    const form = ref({ name: '', email: '', phone: '' })

    onMounted(() => {
      friendsStore.loadFromLocalStorage()
      friendsStore.updateAllStats()
      if (friendsStore.friends.length === 0) {
        friendsStore.initMockData()
        friendsStore.updateAllStats()
      }
    })

    const friends = computed(() => friendsStore.friends)

    const getInitials = (name: string) =>
        name.split(' ').map(w => w[0]).join('').toUpperCase()

    const addFriend = () => {
      friendsStore.addFriend(form.value)
      form.value = { name: '', email: '', phone: '' }
      showModal.value = false
    }

    const deleteFriend = (id: string) => {
      if (confirm('Vymazať priateľa?')) {
        try {
          friendsStore.deleteFriend(id)
        } catch (e: any) {
          alert(e.message)
        }
      }
    }

    return { friends, showModal, form, getInitials, addFriend, deleteFriend }
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
}

.friends-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

.friend-card {
  background: white;
  padding: 24px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #3b82f6;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  margin: 0 auto 16px;
}

.stats {
  display: flex;
  justify-content: space-around;
  margin: 16px 0;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-delete {
  background: #ef4444;
  color: white;
  padding: 8px 16px;
  margin-top: 8px;
}

.empty-state {
  text-align: center;
  padding: 64px;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 32px;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.modal-content input {
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
}
</style>
