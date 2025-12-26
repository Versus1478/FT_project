import {defineStore} from 'pinia'
import type {BorrowedItem, ItemStatus} from '@/types/Item'
import {v4 as uuidv4} from 'uuid'

interface ItemsState {
    items: BorrowedItem[]
}

export const useItemsStore = defineStore('items', {
    state: (): ItemsState => ({
        items: []
    }),

    getters: {
        activeItems: (state): BorrowedItem[] =>
            state.items.filter(i => i.status !== 'returned'),

        returnedItems: (state): BorrowedItem[] =>
            state.items.filter(i => i.status === 'returned'),

        overdueItems: (state): BorrowedItem[] => {
            const today = new Date()
            today.setHours(0, 0, 0, 0)

            return state.items.filter(i => {
                if (i.status === 'returned') return false
                const expectedDate = new Date(i.expectedReturn)
                return expectedDate < today
            })
        },

        getItemById: (state) => (id: string) =>
            state.items.find(i => i.id === id),

        getItemsByFriend: (state) => (friendId: string) =>
            state.items.filter(i => i.friend.id === friendId),

        totalBorrowedValue: (state): number =>
            state.items
                .filter(i => i.status !== 'returned')
                .reduce((sum, i) => sum + i.value, 0)
    },

    actions: {
        addItem(item: Omit<BorrowedItem, 'id' | 'status' | 'actualReturn'>) {
            const newItem: BorrowedItem = {
                ...item,
                id: uuidv4(),
                actualReturn: null,
                status: this.calculateStatus(item.expectedReturn, null)
            }

            this.items.push(newItem)
            this.saveToLocalStorage()
        },

        updateItem(id: string, updates: Partial<BorrowedItem>) {
            const index = this.items.findIndex(i => i.id === id)
            if (index === -1) return

            const currentItem = this.items[index]
            if (!currentItem) return

            const expectedReturn =
                updates.expectedReturn ?? currentItem.expectedReturn

            const actualReturn =
                updates.actualReturn !== undefined
                    ? updates.actualReturn
                    : currentItem.actualReturn

            const finalStatus =
                updates.status ?? this.calculateStatus(expectedReturn, actualReturn)

            this.items[index] = {
                ...currentItem,
                ...updates,
                id: currentItem.id,
                status: finalStatus
            }

            this.saveToLocalStorage()
        },

        returnItem(id: string, returnDate?: string) {
            const finalDate =
                returnDate || new Date().toISOString().split('T')[0]

            this.updateItem(id, {
                actualReturn: finalDate,
                status: 'returned'
            })
        },

        deleteItem(id: string) {
            const index = this.items.findIndex(i => i.id === id)
            if (index === -1) return

            this.items.splice(index, 1)
            this.saveToLocalStorage()
        },

        calculateStatus(
            expectedReturn: string,
            actualReturn: string | null
        ): ItemStatus {
            if (actualReturn) return 'returned'

            const today = new Date()
            today.setHours(0, 0, 0, 0)

            const expected = new Date(expectedReturn)
            return expected < today ? 'overdue' : 'borrowed'
        },

        updateAllStatuses() {
            this.items.forEach(item => {
                if (item.status !== 'returned') {
                    item.status = this.calculateStatus(
                        item.expectedReturn,
                        item.actualReturn
                    )
                }
            })

            this.saveToLocalStorage()
        },

        saveToLocalStorage() {
            localStorage.setItem(
                'borrowTracker_items',
                JSON.stringify(this.items)
            )
        },

        loadFromLocalStorage() {
            const stored = localStorage.getItem('borrowTracker_items')
            if (this.items.length > 0) return
            if (stored === null) {
                this.initMockData()
                return
            }
            try {
                const parsed = JSON.parse(stored)
                if (Array.isArray(parsed)) {
                    this.items = parsed
                    this.updateAllStatuses()
                } else {
                    this.initMockData()
                }
            } catch (e) {
                console.error('Pomилка завантаження даних', e)
                this.initMockData()
            }
        },

        initMockData() {
            this.items = [
                {
                    id: uuidv4(),
                    itemName: 'PlayStation 5',
                    description: 'Herná konzola s dvoma ovládačmi',
                    category: 'elektronika',
                    friend: {
                        id: '1',
                        name: 'Peter Novák'
                    },
                    friendId: "1",
                    borrowedDate: '2024-11-15',
                    expectedReturn: '2024-12-30',
                    actualReturn: null,
                    status: 'borrowed',
                    value: 550,
                    notes: 'Opatrne s ovládačmi'
                },
                {
                    id: uuidv4(),
                    itemName: 'Vŕtačka Bosch',
                    description: 'Príklepová vŕtačka 750W',
                    category: 'naradie',
                    friend: {
                        id: '2',
                        name: 'Jana Kováčová'
                    },
                    friendId: "2",
                    borrowedDate: '2024-10-05',
                    expectedReturn: '2024-11-10',
                    actualReturn: null,
                    status: 'overdue',
                    value: 120
                }
            ]
            this.saveToLocalStorage()
        }
    }
})
