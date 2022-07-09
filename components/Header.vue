<template>
  <nav id="gtco-header-navbar" v-show="S.showBlog">
    <div>
      <div id="navbar-nav-header">
        <h5 class="text-center">
          {{
            parseInt(S.content.viewing) === S.content.versions.length - 1
              ? "Viewing latest version"
              : `Viewing version ${S.content.viewing}`
          }}
        </h5>
        <input
          type="range"
          class="form-range"
          min="0"
          :max="S.content.versions.length - 1"
          step="1"
          v-model="S.content.viewing"
          @input="getArticle"
        />
        <div v-if="S.content.versions && S.content.versions[S.content.viewing]" class="commit-data">
          <div class="row">
            <div class="col-md-8">
              <p>
                Hash
                <a
                  :href="
                    'https://github.com/adelriosantiago/adelriosantiago-blog/commit/' +
                    S.content.versions[S.content.viewing][0]
                  "
                  >{{ S.content.versions[S.content.viewing][0] | shorten }}</a
                >
                as of
                {{ S.content.versions[S.content.viewing][2] }}
              </p>
            </div>
            <div class="col-md-4">
              <p id="checkboxOptions">
                <input type="checkbox" name="keystrokes" v-model="S.followKeystrokes" checked />
                <label for="keystrokes">Follow keystrokes</label>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
const md = require("markdown-it")({
  html: true,
  xhtmlOut: true,
  breaks: true,
  linkify: true,
  typographer: true,
})

let previousHTML = undefined // Preview html for keystroke follower

const goToBlogStart = () => {
  window.scrollTo({
    left: 0,
    top: Math.round($("#gtco-section-featurettes")[0].offsetTop),
    behavior: "instant",
  })
}

export default {
  props: {},
  data: () => {
    return {}
  },
  computed: {},
  created() {},
  async mounted() {
    console.log("Vue", this)
    if (this.$route.hash) this.S.showBlog = true

    $(window).scroll((q, w, e, r) => {
      // GIT header settings
      if ($(window).scrollTop() > 150) {
        $("body").addClass("not-on-top")
      } else {
        $("body").removeClass("not-on-top")
      }

      // Add the correct hashtag in the URL
      this.processHashtag()
    })

    // Article slider
    this.S.content.versions = (await this.$axios.post("/getVersions", { article: this.S.article })).data
    if (this.S.content.versions.length === 0) {
      this.$router.push("/")
      return
    }
    this.S.content.viewing = this.S.content.versions.length - 1

    // Get latest article
    this.getArticle()
  },
  methods: {
    async getArticle() {
      const article = this.S.article
      const hash = this.S.content.versions[this.S.content.viewing][0]

      this.S.content.pending = await new Promise(async (res, rej) => {
        previousHTML = $("#md-content").clone().children().toArray()
        this.S.content.md.current = await md.render(
          (await this.$axios.post("/getArticle", { article, hash })).data.replace(/\n\n$/gm, "\n ")
        )
        //await this.$nextTick()
        await new Promise((resolve) => setTimeout(resolve, 5)) // NOTE:  for some reason nextTick will not wait the content to be rendered, this timeout is needed
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

      /*const verNum = parseInt(this.S.content.viewing)
      if (verNum === this.S.content.versions.length - 1) {
        this.$router.replace({ query: { version: undefined } })
      } else {
        if (verNum !== this.$route.query.version) this.$router.replace({ query: { version: this.S.content.viewing } }) // CONTINUE HERE
      }*/

      this.processHashtag()

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
    async processHashtag() {
      if (!this.S.showBlog) return
      const h1Pos = this.h1Positions()
      for (let i = 0; i < h1Pos.length; i++) {
        if (h1Pos[i][1] >= scrollY) {
          const currentHash = this.$route.hash.substr(1)
          if (currentHash !== h1Pos[i][0])
            this.$router.replace({ hash: "#" + h1Pos[i][0], params: { savePosition: true } })
          break
        }
      }
    },
  },
}
</script>

<style lang="scss">
#gtco-header-navbar {
  position: absolute;
  background-color: white;
  padding: 15px;
  top: 0;
  right: 0;
  left: 0;
  z-index: 11;
  border-top-right-radius: 5px;
  border-top-left-radius: 5px;

  #home-button {
    float: left;
  }

  #checkboxOptions {
    float: right;
  }
}
</style>
