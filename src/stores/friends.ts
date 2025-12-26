import {defineStore} from 'pinia'
import type {Friend} from '@/types/Item'
import {v4 as uuidv4} from 'uuid'
import {useItemsStore} from './items'

interface FriendsState {
    friends: Friend[]
}

const useFriendsStore = defineStore('friends', {
    state: (): FriendsState => ({
        friends: []
    }),

    getters: {
        getFriendById: (state) => (id: string) => state.friends.find(f => f.id === id),

        sortedByBorrowCount: (state): Friend[] => {
            return [...state.friends].sort((a, b) => b.borrowedCount - a.borrowedCount)
        }
    },

    actions: {
        addFriend(friendData: Omit<Friend, 'id' | 'borrowedCount' | 'totalValue'>) {
            const newFriend: Friend = {
                ...friendData,
                id: uuidv4(),
                borrowedCount: 0,
                totalValue: 0
            }
            this.friends.push(newFriend)
            this.saveToLocalStorage()
        },

        updateFriend(id: string, updates: Partial<Friend>) {
            const index = this.friends.findIndex(f => f.id === id)
            if (index !== -1) {
                const currentFriend = this.friends[index]
                if (!currentFriend) return
                this.friends[index] = {
                    id: currentFriend.id,
                    name: updates.name ?? currentFriend.name,
                    email: updates.email ?? currentFriend.email,
                    phone: updates.phone ?? currentFriend.phone,
                    avatar: updates.avatar !== undefined ? updates.avatar : currentFriend.avatar,
                    borrowedCount: updates.borrowedCount ?? currentFriend.borrowedCount,
                    totalValue: updates.totalValue ?? currentFriend.totalValue
                }
                this.saveToLocalStorage()
            }
        },

        deleteFriend(id: string) {
            const itemsStore = useItemsStore()
            const hasItems = itemsStore.getItemsByFriend(id).length > 0

            if (hasItems) {
                throw new Error('Nemôžete vymazať priateľa, ktorý má požičané veci!')
            }

            const index = this.friends.findIndex(f => f.id === id)
            if (index !== -1) {
                this.friends.splice(index, 1)
                this.saveToLocalStorage()
            }
        },

        updateFriendStats(friendId: string) {
            const itemsStore = useItemsStore()
            const friendItems = itemsStore.getItemsByFriend(friendId)
            const activeItems = friendItems.filter(item => item.status !== 'returned')

            const friend = this.getFriendById(friendId)
            if (friend) {
                this.updateFriend(friendId, {
                    borrowedCount: activeItems.length,
                    totalValue: activeItems.reduce((sum, item) => sum + item.value, 0)
                })
            }
        },

        updateAllStats() {
            this.friends.forEach(friend => {
                this.updateFriendStats(friend.id)
            })
        },

        saveToLocalStorage() {
            localStorage.setItem('borrowTracker_friends', JSON.stringify(this.friends))
        },

        loadFromLocalStorage() {
            const stored = localStorage.getItem('borrowTracker_friends')
            if (stored) {
                try {
                    this.friends = JSON.parse(stored)
                } catch (e) {
                    console.error('Помилка завантаження друзів', e)
                }
            }
        },

        initMockData() {
            if (this.friends.length === 0) {
                this.friends = [
                    {
                        id: '1',
                        name: 'Peter Novák',
                        email: 'peter.novak@email.com',
                        phone: '+421 900 111 222',
                        borrowedCount: 1,
                        totalValue: 550
                    },
                    {
                        id: '2',
                        name: 'Jana Kováčová',
                        email: 'jana.kovacova@email.com',
                        phone: '+421 900 333 444',
                        borrowedCount: 1,
                        totalValue: 120
                    }
                ]
                this.saveToLocalStorage()
            }
        }
    }
})

export default useFriendsStore