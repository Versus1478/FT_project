<template>
  <div class="add-item-view">
    <div class="form-container">
      <h1>Pridať novú požičku</h1>

      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label>Názov veci *</label>
          <input v-model="form.itemName" type="text" required class="form-input" />
        </div>

        <div class="form-group">
          <label>Popis</label>
          <textarea v-model="form.description" rows="3" class="form-input"></textarea>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Kategória *</label>
            <select v-model="form.category" required class="form-input">
              <option value="">Vyberte...</option>
              <option value="elektronika">💻 Elektronika</option>
              <option value="knihy">📚 Knihy</option>
              <option value="naradie">🔨 Náradie</option>
              <option value="sport">⚽ Šport</option>
              <option value="ine">📦 Iné</option>
            </select>
          </div>

          <div class="form-group">
            <label>Hodnota (€) *</label>
            <input
                v-model.number="form.value"
                type="number"
                min="0"
                step="0.01"
                required
                class="form-input"
            />
          </div>
        </div>

        <div class="form-group">
          <label>Požičané komu *</label>
          <select v-model="form.friendId" required class="form-input">
            <option value="">Vyberte priateľa...</option>
            <option v-for="friend in friends" :key="friend.id" :value="friend.id">
              {{ friend.name }}
            </option>
          </select>
          <router-link to="/friends" class="add-friend-link">
            + Pridať nového priateľa
          </router-link>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Dátum požičania *</label>
            <input v-model="form.borrowedDate" type="date" required class="form-input" />
          </div>

          <div class="form-group">
            <label>Očakávané vrátenie *</label>
            <input v-model="form.expectedReturn" type="date" required class="form-input" />
          </div>
        </div>

        <div class="form-group">
          <label>Poznámky</label>
          <textarea v-model="form.notes" rows="2" class="form-input"></textarea>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn btn-primary">Pridať požičku</button>
          <button type="button" @click="$router.push('/')" class="btn btn-secondary">
            Zrušiť
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useItemsStore } from '@/stores/items'
import  useFriendsStore  from '@/stores/friends'
import type { ItemCategory } from '@/types/Item'

interface AddItemForm {
  itemName: string
  description: string
  category: ItemCategory | ''
  value: number
  friendId: string
  borrowedDate: string
  expectedReturn: string
  notes: string
}

export default defineComponent({
  name: 'AddItemView',

  data(): { form: AddItemForm } {
    return {
      form: {
        itemName: '',
        description: '',
        category: '',
        value: 0,
        friendId: '',
        borrowedDate: new Date().toISOString().slice(0, 10),
        expectedReturn: '',
        notes: ''
      }
    }
  },

  computed: {
    itemsStore() {
      return useItemsStore()
    },
    friendsStore() {
      return useFriendsStore()
    },
    friends() {
      return this.friendsStore.friends
    }
  },

  mounted() {
    this.friendsStore.loadFromLocalStorage()
    if (this.friends.length === 0) {
      this.friendsStore.initMockData()
    }
  },

  methods: {
    handleSubmit() {
      const friend = this.friends.find(f => f.id === this.form.friendId)
      if (!friend) {
        alert('Vyberte priateľa')
        return
      }

      this.itemsStore.addItem({
        itemName: this.form.itemName,
        description: this.form.description,
        category: this.form.category as ItemCategory,
        friend: {
          id: friend.id,
          name: friend.name,
          avatar: friend.avatar
        },
        borrowedDate: this.form.borrowedDate,
        expectedReturn: this.form.expectedReturn,
        value: this.form.value,
        notes: this.form.notes
      })

      this.friendsStore.updateFriendStats(friend.id)
      this.$router.push('/')
    }
  }
})
</script>
