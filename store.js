import Vue from "vue"

const hashtagOffset = 100
let lastContentHash = 0
let h1Positions = []

const md = require("markdown-it")({
  html: true,
  xhtmlOut: true,
  breaks: true,
  linkify: true,
  typographer: true,
})

export const S = Vue.observable({
  article: "index",
  content: {
    versions: [],
    viewing: 0,
    md: {
      previous: undefined,
      current: undefined,
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
      .filter(e => e.id.match(/[ <>/]/gi)?.length ? false : e.id)
      .map((e) => [e.id, e.offsetTop - hashtagOffset - 50])
      .filter((p) => p[1] > 0)

    return h1Positions
  },
  async updateUrl() {
    if (!S.showBlog) return
    const h1Pos = this.h1Positions()
    for (let i = 0; i < h1Pos.length; i++) {
      if (h1Pos[i][1] >= scrollY) {
        const currentHash = this.$route.hash.substr(1)
        if (currentHash !== h1Pos[i][0]) history.replaceState(null, null, `?version=${S.content.viewing}#${h1Pos[i][0]}`)
        break
      }
    }
  },
  async getArticle() {
    const article = S.article
    const hash = S.content.versions[S.content.viewing][0]

    await new Promise(async (res, rej) => {
      S.content.md.previous = $("#md-content").clone().children().toArray()
      S.content.md.current = await md.render(
        (await this.$axios.post("/getArticle", { article, hash })).data.replace(/\n\n$/gm, "\n ")
      )
      //await this.$nextTick() // NOTE: nextTick will not wait the content to be rendered, the timeout below is needed
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return res()
    })

    /* TODO: Implement follow keystrokes
    const newHTML = $("#md-content").children().toArray()
    let diffFoundAt = undefined
    for (let i = 0; i < newHTML.length; i++) {
      if (!newHTML[i] || !previousHTML[i] || newHTML[i].outerHTML !== previousHTML[i].outerHTML) {
        diffFoundAt = i
        break
      }
    }*/

    // TODO: Restore url at latest as undefined
    /*const verNum = parseInt(this.S.content.viewing)
    if (verNum === this.S.content.versions.length - 1) {
      this.$router.replace({ query: { version: undefined } })
    } else {
      if (verNum !== this.$route.query.version) this.$router.replace({ query: { version: this.S.content.viewing } }) // CONTINUE HERE
    }*/

    this.updateUrl() // Update hash

    // TODO: Fix scroll to position when opening article
    /*// Scroll if needed
    const hashURL = this.$route.hash.substr(1)
    if (!hashURL) return

    const m = hashURL.match(/%|\//gi) || [] // Cleanup invalid hashtags
    if (m.length) this.$router.replace({ hash: "" })

    const h1Pos = this.h1Positions()
    const hashFound = h1Pos.filter((e) => e[0] === hashURL)
    if (!hashFound) return goToBlogStart() // If no hashtag is found in current version then go top the blog

    // Check if the scroll is between any of these positions
    const currentPosition = window.scrollY
    for (let i = 0; i < h1Pos.length; i++) {
      if (h1Pos[i][0] === hashURL) {
        try {
          if (
            currentPosition <= h1Pos[i][1] - Math.round(window.innerHeight / 2) ||
            currentPosition >= h1Pos[i + 1][1]
          ) {
            window.scrollTo({ left: 0, top: h1Pos[i][1], behavior: "instant" })
          }
        } catch (e) {
          console.info("Ignored scroll", e) // If an error happened just don't scroll
        }
        break
      }
    }*/
  },
}
