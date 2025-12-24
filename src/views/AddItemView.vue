<template>
  <div class="add-item-view">
    <div class="form-container">
      <h1>Pridať novú požičku</h1>

      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label>Názov veci *</label>
          <input
              v-model="form.itemName"
              type="text"
              required
              class="form-input"
              placeholder="napr. PlayStation 5"
          />
        </div>

        <div class="form-group">
          <label>Popis</label>
          <textarea
              v-model="form.description"
              rows="3"
              class="form-input"
              placeholder="Krátky popis veci..."
          />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Kategória *</label>
            <select v-model="form.category" required class="form-input">
              <option value="">Vyberte kategóriu...</option>
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
            <option
                v-for="friend in friends"
                :key="friend.id"
                :value="friend.id"
            >
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
            <input
                v-model="form.borrowedDate"
                type="date"
                required
                class="form-input"
            />
          </div>

          <div class="form-group">
            <label>Očakávané vrátenie *</label>
            <input
                v-model="form.expectedReturn"
                type="date"
                required
                class="form-input"
            />
          </div>
        </div>

        <div class="form-group">
          <label>Poznámky</label>
          <textarea
              v-model="form.notes"
              rows="2"
              class="form-input"
          />
        </div>

        <div class="form-actions">
          <button type="submit" class="btn btn-primary">
            Pridať požičku
          </button>
          <button
              type="button"
              class="btn btn-secondary"
              @click="handleCancel"
          >
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
import type { Friend } from '@/types/Item.ts'

export default defineComponent({
  name: 'AddItemView',

  data() {
    return {
      itemsStore: useItemsStore(),
      friendsStore: useFriendsStore(),

      form: {
        itemName: '',
        description: '',
        category: '' as ItemCategory | '',
        value: 0,
        friendId: '',
        borrowedDate: new Date().toISOString().slice(0, 10),
        expectedReturn: '',
        notes: ''
      }
    }
  },

  computed: {
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
      const friend = this.friends.find(
          (f: Friend) => f.id === this.form.friendId
      )

      if (!friend) {
        alert('Vyberte priateľa zo zoznamu')
        return
      }

      if (!this.form.category) {
        alert('Vyberte kategóriu')
        return
      }

      if (this.form.expectedReturn < this.form.borrowedDate) {
        alert('Dátum vrátenia nemôže byť pred dátumom požičania')
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
      alert('✅ Požička úspešne pridaná!')
      this.$router.push('/')
    },

    handleCancel() {
      if (confirm('Naozaj chcete zrušiť pridávanie požičky?')) {
        this.$router.push('/')
      }
    }
  }
})
</script>
