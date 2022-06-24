<template>
  <div>
    <div id="md-content" v-if="S.content.md.current" v-html="S.content.md.current"></div>
  </div>
</template>

<script>
export default {
  data: () => {
    return {}
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {},
}
</script>

<style>
span.pill {
  background-color: whitesmoke;
  padding: 5px;
  border-radius: 5px;
  font-size: 10px;
}
img {
  display: block;
  margin: 0 auto;
}
hidden {
  display: none;
}
</style>
