<template>
  <div class="page-wrapper">
    <div class="jumbotron d-flex align-items-center" style="background-image: url(/img/hero-2.jpg)">
      <div class="container text-center">
        <img class="round-image" src="/img/me2.jpeg" />
        <h1 class="text-center">ALEJANDRO</h1>
        <h1 class="text-center lastname">DEL RIO SANTIAGO</h1>
        <div class="row justify-content-center">
          <div class="col-md-6">
            <p>
              Hi! I'm Alejandro! I am an MBA graduate candidate at
              <a href="https://business.louisville.edu/learnmore/professionalmba/">UofL</a>, KY,<br />
              and B.Sc. in Computer Science Engineering by <a href="https://tec.mx/en">Tec de Monterrey</a>.<br />I am a
              data science consultant. <br /><br />
              <em
                >#DataScience #DataViz #ChartJs #Javascript #ML #AI #DataAnalytics #MachineLearning
                #ArtificialIntelligence #BusinessIntelligence</em
              >
            </p>
          </div>
        </div>
      </div>
    </div>

    <section id="gtco-section-featurettes" class="featurettes bg-white" v-show="S.showBlog">
      <div class="container">
        <div class="section-content">
          <div class="row">
            <Content />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  props: {},
  data: () => {
    return {}
  },
  computed: {},
  watch: {
    "S.content.viewing"() {
      this.updateBrowserUrl()
    },
    "S.content.hash"() {
      this.updateBrowserUrl()
    },
  },
  async created() {
    try {
      this.S.content.versions = (await this.$axios.post("/getVersions", { article: "index" })).data
    } catch (e) {
      throw "Error fetching index.md found. The blog won't work."
    }
    if (this.S.content.versions.length === 0) throw "No blog index.md found. The blog won't work."
  },
  mounted() {
    console.log("Vue", this)

    $(window).scroll((q, w, e, r) => {
      // GIT header settings
      if ($(window).scrollTop() > 150) {
        $("body").addClass("not-on-top")
      } else {
        $("body").removeClass("not-on-top")
      }

      // Calculate the correct hashtag in the URL
      this.updateViewingHash()
    })
  },
  methods: {
    updateBrowserUrl() {
      history.replaceState(null, null, `?version=${this.S.content.viewing}#${this.S.content.hash}`)
    },
  },
}
</script>

<style>
.jumbotron {
  padding: 100px 0px;
}

.round-image {
  display: block;
  margin: auto;
  margin-bottom: 30px;
  width: 20rem;
  height: 20rem;
  border: 2px solid rgba(234, 97, 83, 0.1);
  border-radius: 50%;
  box-shadow: 0 0 1px 1px rgba(0, 0, 0, 0.3);
}

.lastname {
  font-size: 1.9em;
}
</style>
