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
              Hi! I'm Alejandro! B.Sc. in Electronics and Computer Science Engineering and MBA graduate candidate at
              UofL, KY.<br /><br />
              I am an IT consultant and I do data visualization.
              <br /><br />
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
  created() {
    this.S.article = "index"
  },
  mounted() {},
  methods: {},
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
