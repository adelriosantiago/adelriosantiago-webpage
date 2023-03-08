<template>
  <div class="page-wrapper">
    <div class="jumbotron d-flex align-items-center" style="background-image: url(/img/hero-2.jpg)">
      <div class="container text-center">
        <img class="round-image" src="/img/me2.jpeg" />
        <h1 class="text-center">ALEJANDRO</h1>
        <h1 class="text-center lastname">DEL RIO SANTIAGO</h1>
        <br />
        <div class="row justify-content-center">
          <div class="col-md-6">
            <p>
              Hi! I'm Alejandro! I am an MBA graduate candidate at <em>UofL</em>, KY,<br />
              and B.Sc. in Computer Science Engineering by <em>Tec de Monterrey</em>.<br />I am a data science
              consultant.<br /><br />
              <em
                >#DataScience #DataViz #ChartJs #Javascript #ML #AI #DataAnalytics #MachineLearning
                #ArtificialIntelligence #BusinessIntelligence</em
              >
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {},
  data: () => {
    return {}
  },
  computed: {},
  watch: {},
  async created() {},
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
