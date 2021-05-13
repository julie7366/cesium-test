import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
	{
		name:'01',
	    path: '/01',
	    component: () => import('@/components/01')
	},
    {
		name:'01',
	    path: '/01',
	    component: () => import('@/components/01')
	},
	{
		name:'02',
	    path: '/02',
	    component: () => import('@/components/02')
	},
	{
		name:'03',
	    path: '/03',
	    component: () => import('@/components/03')
	},
	{
		name:'earthMap',
	    path: '/earthMap',
	    component: () => import('@/components/earthMap')
	},
	{
		name:'default',
	    path: '/default',
	    component: () => import('@/components/default')
	},
	{
		name:'flyModel',
	    path: '/flyModel',
	    component: () => import('@/components/flyModel')
	},
	{
		name:'3dBuild',
	    path: '/3dBuild',
	    component: () => import('@/components/3dBuild')
	},
	{
		name:'test',
	    path: '/test',
	    component: () => import('@/components/test')
	},
	{
		name:'test2',
	    path: '/test2',
	    component: () => import('@/components/test2')
	}
]

const router = new VueRouter({
    routes
})

export default router