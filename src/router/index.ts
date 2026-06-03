import { createRouter, createWebHistory } from "vue-router";
import ScoringView from "../views/ScoringView.vue";
import ShooterView from "../views/ShooterView.vue";
import ScoreCard from "../views/ScoreCard.vue";
import ResultList from "@/components/ResultList.vue";
import DefaultLayout from "@/layouts/DefaultLayout.vue";
import FullPageLayout from "@/layouts/FullPageLayout.vue";

const router = createRouter({
  history: createWebHistory("/sra-test/"),
  routes: [
    {
      path: "/",
      component: DefaultLayout,
      children: [
        {
          path: "/",
          name: "result-list",
          component: ResultList,
        },
        {
          path: "/shooter",
          name: "shooter-with-data",
          component: ShooterView,
        },
        {
          path: "/shooter/:shooter",
          name: "shooter",
          component: ShooterView,
        },
        {
          path: "/entry/:stage/:shooter",
          name: "entry",
          component: ScoringView,
        },
        {
          path: "/range-setup",
          name: "rangeSetup",
          component: () => import("../views/RangeSetupView.vue"),
        },
        {
          path: "/about",
          name: "about",
          component: () => import("../views/AboutView.vue"),
        },
        {
          path: "/safety",
          name: "safety",
          component: () => import("../views/SafetyView.vue"),
        },
        {
          path: "/rules",
          name: "rules",
          component: () => import("../views/RulesView.vue"),
        },
        {
          path: "/:catchAll(.*)",
          name: "NotFound",
          component: () => import("../views/AboutView.vue"),
          meta: {
            requiresAuth: false,
          },
        },
      ],
    },

    {
      path: "/result",
      component: FullPageLayout,
      children: [
        {
          path: "",
          component: ScoreCard,
        },
      ],
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else if (to.hash) {
      return {
        el: to.hash,
        behavior: "smooth",
      };
    } else {
      return { top: 0 };
    }
  },
});

// Recover from stale dynamic-import chunk hashes after a deploy.
// Old HTML cached in the browser (or service worker) may reference a chunk
// filename that no longer exists on the server; reload the page so the
// fresh HTML — and the new chunk filenames it points at — are picked up.
router.onError((error, to) => {
  const message = error instanceof Error ? error.message : String(error);
  if (
    /Failed to fetch dynamically imported module|Importing a module script failed|Loading chunk \d+ failed/i.test(
      message,
    )
  ) {
    window.location.href = to.fullPath;
  }
});

export default router;
