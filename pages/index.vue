<template>
  <div class="page-wrapper">
    <div class="jumbotron d-flex align-items-center" style="background-image: url(/img/hero-2.jpg)">
      <div class="container text-center">
        <img class="round-image" src="/img/me.jpg" />
        <h1 class="text-center">ALEJANDRO</h1>
        <h1 class="text-center lastname">DEL RIO SANTIAGO</h1>
        <div class="row justify-content-center">
          <div class="col-md-6">
            <p>
              Hi! I'm Alex! B.Sc. in Electronics and Computer Science Engineering. I am a software developer &
              consultant. I specialize in Javascript and data visualization.
            </p>
            <p>This is where I write. Every hit and every mistake recorded as I type.</p>
          </div>
        </div>
      </div>
    </div>

    <section id="gtco-section-featurettes" class="featurettes bg-white">
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
    this.S.article = "index/all"
  },
  mounted() {},
  methods: {},
}
</script>

<style>
.page-wrapper {
  padding-top: 110px;
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
