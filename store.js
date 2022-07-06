import Vue from "vue"

const hashtagOffset = 100
let lastContentHash = 0
let h1Positions = []

export const S = Vue.observable({
  article: "index",
  content: {
    versions: [],
    viewing: 0,
    pending: undefined,
    md: {
      current: undefined,
      preview: undefined,
    },
  },
  editing: {
    file: "index",
    writeKey: "",
    log: { ts: new Date().toISOString(), text: "Ready to edit" },
    saveLock: false,
    code: "",
  },
  showBlog: false,
  followKeystrokes: false,
})

export const C = {}

export const M = {
  h1Positions() {
    if (lastContentHash === S.content.md.current.length) return h1Positions
    lastContentHash = S.content.md.current.length
    h1Positions = $("#gtco-section-featurettes h1[id]")
      .toArray()
      .map((e) => [e.id, e.offsetTop - hashtagOffset - 50])
      .filter((p) => p[1] > 0)

    return h1Positions
  },
}
