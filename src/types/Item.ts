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

export interface BorrowedItemFriend {
    id: string
    name: string
    avatar?: string
}

export interface BorrowedItem {
    id: string
    itemName: string
    description: string
    category: ItemCategory
    friendId: string;
    friend: BorrowedItemFriend
    borrowedDate: string
    expectedReturn: string
    actualReturn: string | null
    status: ItemStatus
    imageUrl?: string
    value: number
    notes?: string
}