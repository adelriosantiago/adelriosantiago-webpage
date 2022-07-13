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
      this.updateUrl()
    })
  },
  methods: {},
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
