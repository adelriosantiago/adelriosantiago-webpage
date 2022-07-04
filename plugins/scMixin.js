import Vue from "vue"
import { S, C, M } from "@/store.js"

if (!Vue.scMixin) {
  Vue.scMixin = true
  Vue.mixin({
    data: () => {
      return {
        S,
      }
    },
    computed: {
      ...C,
    },
    methods: {
      ...M,
    },
  })
}
