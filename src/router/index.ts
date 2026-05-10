import { createRouter, createWebHistory } from 'vue-router'
import ScoringView from '../views/ScoringView.vue'
import ShooterView from '../views/ShooterView.vue'
import ScoreCard from '../views/ScoreCard.vue'
import ResultList from "@/components/ResultList.vue";
import DefaultLayout from "@/layouts/DefaultLayout.vue";
import FullPageLayout from "@/layouts/FullPageLayout.vue";

const router = createRouter({
  history: createWebHistory('/sra-koe/'),
  routes: [
    {
      path: '/',
      component: DefaultLayout,
      children: [
        {
          path: '/',
          name: 'result-list',
          component: ResultList
        },
        {
          path: '/shooter',
          name: 'shooter-with-data',
          component: ShooterView
        },
        {
          path: '/shooter/:shooter',
          name: 'shooter',
          component: ShooterView
        },
        {
          path: '/entry/:stage/:shooter',
          name: 'entry',
          component: ScoringView
        },
        {
          path: '/about',
          name: 'about',
          // route level code-splitting
          // this generates a separate chunk (About.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import('../views/AboutView.vue')
        },
        {
          path: '/safety',
          name: 'safety',
          component: () => import('../views/SafetyView.vue')
        },
        {
          path: '/rules',
          name: 'rules',
          component: () => import('../views/RulesView.vue')
        },
        {
          path: "/:catchAll(.*)",
          name: "NotFound",
          component: () => import('../views/AboutView.vue'),
          meta: {
            requiresAuth: false
          }
        }
      ]
    },

    {
      path: '/result',
      component: FullPageLayout,
      children: [
        {
          path: '',
          component: ScoreCard
        }
      ]
    }


  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
      };
    } else {
      return { top: 0 };
    }
  },
})

export default router
