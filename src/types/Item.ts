export type ItemStatus = 'borrowed' | 'returned' | 'overdue'

export type ItemCategory = 'elektronika' | 'knihy' | 'naradie' | 'sport' | 'ine'

export interface Friend {
    id: string
    name: string
    email: string
    phone: string
    avatar?: string
    borrowedCount: number
    totalValue: number
}

export interface BorrowedItem {
    id: string
    itemName: string
    description: string
    category: ItemCategory
    friend: {
        id: string
        name: string
        avatar?: string
    }
    borrowedDate: string
    expectedReturn: string
    actualReturn: string | null
    status: ItemStatus
    imageUrl?: string
    value: number
    notes?: string
}