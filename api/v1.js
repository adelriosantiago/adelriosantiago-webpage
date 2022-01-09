const bodyParser = require("body-parser")
const app = require("express")()
const git = new (require("git-wrapper"))({ "git-dir": "./articles/.git" })

app.use(bodyParser.json())

app.post("/", async (req, res) => {
  return res.json({ ok: true })
})

app.post("/getVersions", async (req, res) => {
  const article = req.body.article

  // Note: To obtain all hashes of a particular file this can be used: git log --pretty=format:"%H|||%an|||%ad" --follow sample-article.md
  git.exec("log", { pretty: 'format:"%H|||%an|||%ad"', follow: true }, [`-- ${article}.md`], (err, msg) => {
    if (err) return res.json([["Error loading hash", "Error loading author", "Error loading date"]])

    return res.json(
      msg
        .split("\n")
        .map((e) => e.split("|||"))
        .reverse()
    )
  })
})
app.post("/getArticle", async (req, res) => {
  const article = req.body.article
  const hash = req.body.hash

  git.exec("show", [`${hash}:${article}.md`], (err, text) => {
    if (err) return res.json(`Error loading article. Please try again later. ${err}`)
    return res.json(text)
  })
})

app.post("*", async (req, res) => {
  return res.status(500).json({ err: "Endpoint not found" })
})

module.exports = app
