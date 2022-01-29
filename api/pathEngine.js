const glob = require("glob")
const fs = require("fs").promises

let urls = { index: "index", undefined: "index", "": "index" }

module.exports = {
  async calcURLS() {
    urls = await new Promise((res, rej) => {
      glob("./static/blog/**/*.md", async (err, files) => {
        if (err) return urls

        const calculatedPaths = await files.reduce(async (acc, cur) => {
          acc = await acc

          // Grab article aliases
          let articleText = await fs.readFile(cur, "UTF8")
          const aliasLineMatch = new RegExp("\\$URLS=(.+)", "gm").exec(articleText)
          let aliasArray = aliasLineMatch && aliasLineMatch[1] ? aliasLineMatch[1].split(",") : []

          let filename = new RegExp("\\./static/blog/(.+)\\.md$").exec(cur)
          if (!filename) {
            console.error("Error: Couldn't grab article filename.")
            return acc
          }
          aliasArray.forEach((alias) => (acc = { ...acc, ...{ [alias]: filename[1] } }))

          return acc
        }, urls)

        return res(calculatedPaths)
      })
    })
  },
  getURL(path) {
    return urls[path] || "index"
  },
}
