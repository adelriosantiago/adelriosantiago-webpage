<template>
  <div class="page-wrapper">
    <section id="gtco-section-featurettes" class="featurettes bg-white">
      <div class="container">
        <div class="section-content">
          <div class="row">
            <p class="text-center">Editing ./blog/ <input v-model="S.editing.file" />.md article</p>
            <div class="row">
              <div class="col-6">
                <p>Write key: <input v-model="S.editing.writeKey" /></p>
              </div>
              <div class="col-6"><!-- Add more options here --></div>
            </div>
          </div>
          <codemirror v-model="S.editing.code" :options="cmOptions" @input="onCmCodeChange"></codemirror>
          <br />
          <div class="row">
            <p>Last log message: ({{ S.editing.log.ts }}) - {{ S.editing.log.text }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { codemirror } from "vue-codemirror"
import "codemirror/lib/codemirror.css"
import "codemirror/mode/javascript/javascript.js"
import "codemirror/theme/base16-dark.css"

export default {
  layout: "empty",
  components: {
    codemirror,
  },
  props: {},
  data: () => {
    return {
      cmOptions: {
        tabSize: 4,
        mode: "text/javascript",
        theme: "base16-dark",
        lineNumbers: true,
        line: true,
      },
    }
  },
  computed: {},
  async created() {
    const fileData = (await this.$axios.post("/loadFile", { article: "index" })).data
    if (fileData.err) {
      this.S.editing.code = ""
      this.S.editing.log = { ts: new Date().toISOString(), text: fileData.err }
      return
    }

    this.S.editing.code = fileData
    this.S.editing.log = { ts: new Date().toISOString(), text: "File loaded." }
  },
  mounted() {},
  methods: {
    async onCmCodeChange(newText) {
      await this.S.editing.saveLock

      this.S.editing.saveLock = new Promise(async (res, rej) => {
        this.code = newText

        const saveResult = await (
          await this.$axios.post("/saveFile", {
            article: this.S.editing.file,
            writeKey: this.S.editing.writeKey,
            text: this.S.editing.code,
          })
        ).data

        if (saveResult.err) {
          this.S.editing.log = { ts: new Date().toISOString(), text: saveResult.err }
          return res()
        }
        this.S.editing.log = { ts: new Date().toISOString(), text: "File saved and commited." }
        res()
      })
    },
  },
}
</script>

<style></style>
