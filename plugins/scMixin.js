import Vue from "vue"
import { S, C } from "@/store.js"

if (!Vue.scMixin) {
  Vue.scMixin = true
  Vue.mixin({
    data: () => {
      return {
        S,
      }
    },
    computed: {
      C() {
        return C
      },
    },
  })
}
