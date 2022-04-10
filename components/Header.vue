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
