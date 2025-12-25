<template>
  <v-container class="add-item-view" max-width="700px">
    <v-card elevation="2" class="pa-6">
      <v-card-title><h1>Pridať novú požičku</h1></v-card-title>

      <v-card-text>
        <v-form ref="formRef" v-model="valid" @submit.prevent="handleSubmit">
          <v-text-field v-model="form.itemName" label="Názov veci *" placeholder="napr. PlayStation 5" :rules="[v => !!v || 'Pole je povinné']" required />
          <v-textarea v-model="form.description" label="Popis" placeholder="Krátky popis veci..." rows="3" />

          <v-row class="mt-4" dense>
            <v-col cols="6">
              <v-select v-model="form.category" :items="categories" label="Kategória *" item-title="title" item-value="value" :rules="[v => !!v || 'Vyberte kategóriu']" required />
            </v-col>
            <v-col cols="6">
              <v-text-field v-model.number="form.value" label="Hodnota (€) *" type="number" min="0" step="0.01" :rules="[v => v >= 0 || 'Hodnota musí byť >= 0']" required />
            </v-col>
          </v-row>

          <v-select v-model="form.friendId" :items="friends" item-title="name" item-value="id" label="Požičané komu *" :rules="[v => !!v || 'Vyberte priateľa']" required />

          <v-row class="mt-4" dense>
            <v-col cols="6">
              <v-menu v-model="borrowedMenu" :close-on-content-click="false" transition="scale-transition" offset-y min-width="auto">
                <template #activator="{ props }">
                  <v-text-field v-model="form.borrowedDate" label="Dátum požičania *" readonly v-bind="props" />
                </template>
                <v-date-picker v-model="form.borrowedDate" @input="borrowedMenu = false" />
              </v-menu>
            </v-col>
            <v-col cols="6">
              <v-menu v-model="returnMenu" :close-on-content-click="false" transition="scale-transition" offset-y min-width="auto">
                <template #activator="{ props }">
                  <v-text-field v-model="form.expectedReturn" label="Očakávané vrátenie *" readonly v-bind="props" />
                </template>
                <v-date-picker v-model="form.expectedReturn" @input="returnMenu = false" />
              </v-menu>
            </v-col>
          </v-row>

          <v-textarea v-model="form.notes" label="Poznámky" rows="2" />

          <v-card-actions class="mt-6 justify-space-between">
            <v-btn color="primary" type="submit">Pridať požičku</v-btn>
            <v-btn color="secondary" @click="handleCancel">Zrušiť</v-btn>
          </v-card-actions>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { useItemsStore } from '@/stores/items'
import useFriendsStore from '@/stores/friends'
import type { ItemCategory, Friend } from '@/types/Item'

export default defineComponent({
  name: 'AddItemView',
  data() {
    return {
      itemsStore: useItemsStore(),
      friendsStore: useFriendsStore(),
      valid: false,
      formRef: null,
      borrowedMenu: false,
      returnMenu: false,
      form: {
        itemName: '',
        description: '',
        category: '' as ItemCategory | '',
        value: 0,
        friendId: '',
        borrowedDate: new Date().toISOString().slice(0, 10),
        expectedReturn: '',
        notes: ''
      },
      categories: [
        { title: '💻 Elektronika', value: 'elektronika' },
        { title: '📚 Knihy', value: 'knihy' },
        { title: '🔨 Náradie', value: 'naradie' },
        { title: '⚽ Šport', value: 'sport' },
        { title: '📦 Iné', value: 'ine' }
      ]
    }
  },
  computed: {
    friends(): Friend[] {
      return this.friendsStore.friends
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    loadData() {
      this.friendsStore.loadFromLocalStorage()
      if (!this.friends.length) this.friendsStore.initMockData()
    },
    handleSubmit() {
      const friend = this.friends.find(f => f.id === this.form.friendId)
      if (!friend) return alert('Vyberte priateľa')
      if (!this.form.category) return alert('Vyberte kategóriu')
      if (this.form.expectedReturn < this.form.borrowedDate) return alert('Dátum vrátenia nemôže byť pred dátumom požičania')

      this.itemsStore.addItem({
        itemName: this.form.itemName,
        description: this.form.description,
        category: this.form.category as ItemCategory,
        friend: { id: friend.id, name: friend.name, avatar: friend.avatar },
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
      if (confirm('Naozaj chcete zrušiť pridávanie požičky?')) this.$router.push('/')
    }
  }
})
</script>

<style scoped>
.add-item-view { margin-top: 32px; }
</style>
