const glob = require("glob")
const fs = require("fs").promises

let urls = { index: "index", undefined: "index", "": "index" }

module.exports = {
  async calcURLS() {
    urls = await new Promise((res, rej) => {
      glob("./articles/**/*.md", async (err, files) => {
        if (err) return urls

        const calculatedPaths = await files.reduce(async (acc, cur) => {
          acc = await acc

          // Grab article aliases
          let articleText = await fs.readFile(cur, "UTF8")
          const aliasLineMatch = new RegExp("\\$URLS=(.+)", "gm").exec(articleText)
          let aliasArray = aliasLineMatch && aliasLineMatch[1] ? aliasLineMatch[1].split(",") : []

          let filename = new RegExp("\\./articles/(.+)\\.md$").exec(cur)
          if (!filename) {
            console.log("Error: Couldn't grab article filename.")
            return acc
          }
          aliasArray.forEach((alias) => (acc = { ...acc, ...{ [alias]: filename } }))

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
