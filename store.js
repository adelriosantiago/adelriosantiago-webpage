import Vue from "vue"

export const S = Vue.observable({
  article: "index",
  content: {
    raw: undefined,
    md: undefined,
  },
  editing: {
    file: "index",
    writeKey: "",
    log: { ts: new Date().toISOString(), text: "Ready to edit" },
    saveLock: false,
    code: "",
  },
  showBlog: false,
  displayRaw: false,
  versions: [],
  range: {
    min: 0,
    max: 1,
    selected: 0,
  },
})
