<template>
  <nav id="gtco-header-navbar" v-show="S.showBlog">
    <div>
      <div id="navbar-nav-header">
        <h5 class="text-center">Viewing version {{ S.range.selected }}</h5>
        <input
          type="range"
          class="form-range"
          :min="S.range.min"
          :max="S.range.max"
          step="1"
          v-model="S.range.selected"
          @input="getArticle"
        />
        <div v-if="S.versions && S.versions[S.range.selected]" class="commit-data">
          <div class="row">
            <div class="col-md-8">
              <p>
                Hash
                <a
                  :href="
                    'https://github.com/adelriosantiago/adelriosantiago-blog/commit/' + S.versions[S.range.selected][0]
                  "
                  >{{ S.versions[S.range.selected][0] | shorten }}</a
                >
                as of
                {{ S.versions[S.range.selected][2] }}
              </p>
            </div>
            <div class="col-md-4">
              <p id="displayRaw">
                <input type="checkbox" name="scales" v-model="S.displayRaw" checked />
                <label for="scales">Display raw</label>
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

const hashtagOffset = 100

let h1Positions = [] // Contains all blog article start positions
const updateBlogH1Positions = () => {
  h1Positions = $("#gtco-section-featurettes h1[id]")
    .toArray()
    .map((e) => [e.id, e.offsetTop - hashtagOffset - 50])
}

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
    $(document).ready(() => {
      $(window).scroll((q, w, e, r) => {
        if ($(window).scrollTop() > 150) {
          $("body").addClass("not-on-top")
        } else {
          $("body").removeClass("not-on-top")
        }

        updateBlogH1Positions()

        let scrollToAddToUrl = ""
        for (let i = 0; i < h1Positions.length; i++) {
          if (h1Positions[i][1] >= scrollY) {
            scrollToAddToUrl = h1Positions[i][0]
            history.pushState({}, "", "#" + scrollToAddToUrl)
            break
          }
        }
      })
    })

    // Article slider
    this.S.versions = (await this.$axios.post("/getVersions", { article: this.S.article })).data
    if (this.S.versions.length === 0) {
      this.$router.push("/")
      return
    }

    this.S.range.max = this.S.versions.length - 1
    this.S.range.selected = this.S.range.max
    this.getArticle()
  },
  methods: {
    async getArticle() {
      const article = this.S.article
      const hash = this.S.versions[this.S.range.selected][0]

      this.S.content.raw = (await this.$axios.post("/getArticle", { article, hash })).data.replace(/\n\n$/gm, "\n ")
      this.S.content.md = md.render(this.S.content.raw) // TODO: Make a MD render toggle buttons

      // Update all h1 hashtag positions
      updateBlogH1Positions()

      // Scroll if needed
      const hashURL = this.$route.hash.substr(1)
      if (!hashURL) return

      const m = hashURL.match(/%|\//gi) || [] // Cleanup invalid hashtags
      if (m.length) return (window.location.hash = "")

      const hashFound = h1Positions.filter((e) => e[0] === hashURL)
      if (!hashFound) return goToBlogStart() // If no hashtag is found in current version then go top the blog

      // Check if the scroll is between any of these positions
      const currentPosition = window.scrollY
      for (let i = 0; i < h1Positions.length; i++) {
        if (h1Positions[i][0] === hashURL) {
          try {
            if (
              currentPosition <= h1Positions[i][1] - Math.round(window.innerHeight / 2) ||
              currentPosition >= h1Positions[i + 1][1]
            ) {
              window.scrollTo({ left: 0, top: h1Positions[i][1], behavior: "instant" })
            }
          } catch (e) {
            console.info("Ignored scroll", e) // If an error happened just don't scroll
          }
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

  #displayRaw {
    float: right;
  }
}
</style>
