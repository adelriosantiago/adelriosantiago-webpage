<template>
  <div>
    <div class="jumbotron d-flex align-items-center" style="background-image: url(/img/hero-2.jpg)">
      <div class="container text-center">
        <h1 class="display-2 mb-4 single-blog-title">Amazing Blog Title {{ S.article }}</h1>
      </div>
    </div>
    <!-- Contact Form Section -->
    <section id="gtco-single-content" class="bg-white">
      <div class="container">
        <div class="section-content blog-content">
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
  data: () => {
    return {}
  },
  computed: {},
  created() {
    this.S.article = this.$route.params.pathMatch
  },
  mounted() {},
  methods: {},
}
</script>

<style></style>
