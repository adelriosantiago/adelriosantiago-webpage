const glob = require("glob")
const fs = require("fs").promises
const { blogLocation } = require("./utils")

let urls = { index: "index" }

module.exports = {
  async calcURLS() {
    urls = await new Promise((resolve, reject) => {
      glob(`./${blogLocation}/**/*.md`, async (err, files) => {
        if (err) return urls

        const calculatedPaths = files.reduce(async (acc, cur) => {
          acc = await acc

          // Add filename as default URL
          let filename = new RegExp(`\\./${blogLocation}/(.+)\\.md$`).exec(cur)
          if (!filename) {
            console.error("Error: Couldn't grab article filename.")
            return acc
          }
          filename = filename[1]
          acc[filename] = filename

          // Add article aliases
          const articleText = await fs.readFile(cur, "UTF8")
          let aliases = new RegExp("\\$URLS=(.+)", "gm").exec(articleText)
          aliases = aliases && aliases[1] ? aliases[1].split(",") : []
          aliases.forEach((alias) => (acc = { ...acc, ...{ [alias]: filename } }))

          return acc
        }, urls)

        return resolve(calculatedPaths)
      })
    })
  },
  getArticleFilename(path) {
    return urls[path]
  },
}
