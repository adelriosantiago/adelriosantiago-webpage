import Vue from "vue"
import { S } from "@/store.js"

if (!Vue.scMixin) {
  Vue.scMixin = true
  Vue.mixin({
    data: () => {
      return {
        S,
      }
    },
  })
}
