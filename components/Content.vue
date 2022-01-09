<template>
  <div>
    <div v-if="S.displayRaw === true">
      <pre v-if="S.content.raw" v-html="S.content.raw"></pre>
    </div>
    <div v-else>
      <div v-if="S.content.md" v-html="S.content.md"></div>
    </div>
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
</style>
