import {createRouter, createWebHashHistory, createWebHistory} from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'Dashboard',
        component: () => import('@/views/DashboardView.vue'),
        meta: { title: 'Dashboard - Borrow Tracker' }
    },
    {
        path: '/add-item',
        name: 'AddItem',
        component: () => import('@/views/AddItemView.vue'),
        meta: { title: 'Pridať požičku' }
    },
    {
        path: '/items/:id',
        name: 'ItemDetail',
        component: () => import('@/views/ItemDetailView.vue'),
        meta: { title: 'Detail požičky' },
        props: true
    },
    {
        path: '/friends',
        name: 'Friends',
        component: () => import('@/views/FriendsView.vue'),
        meta: { title: 'Moji priatelia' }
    },
    {
        path: '/history',
        name: 'History',
        component: () => import('@/views/HistoryView.vue'),
        meta: { title: 'História' }
    },
    {
        path: '/stats',
        name: 'Stats',
        component: () => import('@/views/StatsView.vue'),
        meta: { title: 'Štatistiky' }
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('@/views/NotFoundView.vue'),
        meta: { title: '404' }
    }
]

const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes,
    scrollBehavior() {
        return { top: 0 }
    }
})

router.beforeEach((to) => {
    document.title = to.meta.title as string || 'Borrow Tracker'
})

export default router
