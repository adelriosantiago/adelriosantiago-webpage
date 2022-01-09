import Vue from "vue"

export const S = Vue.observable({
  article: "index",
  content: {
    raw: undefined,
    md: undefined,
  },
  displayRaw: false,
  versions: [],
  range: {
    min: 0,
    max: 1,
    selected: 0,
  },
})

export const C = {}
