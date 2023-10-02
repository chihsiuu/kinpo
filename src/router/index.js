import { createRouter, createWebHistory } from "vue-router"
import ErrPage from "../pages/404.vue"

const routes = [
    { path: '/', redirect: '/zh-TW/home/' },
    { path: '/:lang/', redirect: '/' + window.location.pathname.split("/")[1] + '/home/' },
    //{path: '/:lang/errorpage',name: 'ErrPage',component: ErrPage },
    { path: '/:lang/:pathMatch(.*)*', name: 'ErrPage', component: ErrPage },
    { path: '/:lang/:dyna', name: 'Dyna', component: () => import('../pages/dyna-page.vue'),},
    { path: '/:lang/:dyna/:subdyna', name: 'DynaChildren', component: () => import('../pages/dyna-page.vue') },
    { path: '/guide', name: 'guide', component: () => import('../pages/guide.vue') },
]
const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
    scrollBehavior(to, from, savedPosition) {
        let toPath = to.path.substring(0, (to.path.lastIndexOf('/') == to.path.length - 1) ? to.path.lastIndexOf('/') : to.path.length);
        let fromPath = from.path.substring(0, (from.path.lastIndexOf('/') == from.path.length - 1) ? from.path.lastIndexOf('/') : from.path.length);
        if (savedPosition) {
            setTimeout(() => {
                window.scrollTo(0, savedPosition.top);
            }, 800)
        }
        if (to.hash){
            const element = document.body.querySelector('[data-sec-scroll="'+to.hash.replace(/#/, '')+'"]');
            if(element){
                return {el: element, top: 100, behavior: 'smooth'};
            }
        } else {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve({ left: 0, top: 0, behavior: 'auto' })
                }, 500)
            })
        }
    }
})
export default router