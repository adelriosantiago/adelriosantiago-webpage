const bodyParser = require("body-parser")
const app = require("express")()
const { blogLocation } = require("./utils")
const git = new (require("git-wrapper"))({ "git-dir": `./${blogLocation}/.git`, "work-tree": `./${blogLocation}` })
const { calcURLS, getArticleFilename } = require("./path-engine")
const fs = require("fs").promises
const { sanitizePath } = require("./utils")
const WRITE_KEY = process.env.WRITE_KEY
const logStyle = new RegExp("^HASH=([a-f0-9]+)AUTHOR=(.+)DATE=(.+)$")

let incorrectKeyTimeout = false

calcURLS()
app.use(bodyParser.json())

app.post("/", async (req, res) => {
  return res.json({ ok: true })
})

// Get all article versions
app.post("/getVersions", async (req, res) => {
  const article = getArticleFilename(req.body.article)
  if (!article) return res.json([])

  // Note: To obtain all hashes of a particular file this can be used: git log --pretty=format:"%H|||%an|||%ad" --follow sample-article.md
  git.exec(
    "log",
    { pretty: "format:HASH=%HAUTHOR=%anDATE=%ad", follow: true },
    ["--", `${article}.md`],
    (err, msg) => {
      if (err) return res.json([["Error loading hash", "Error loading author", "Error loading date"]])

      return res.json(
        msg
          .split("\n")
          .reverse()
          .map((l) => {
            const match = logStyle.exec(l)
            return [match[1], match[2], match[3]]
          })
      )
    }
  )
})

// Get article at a point in time
app.post("/getArticle", async (req, res) => {
  const article = getArticleFilename(req.body.article)
  const hash = req.body.hash

  git.exec("show", [`${hash}:${article}.md`], (err, text) => {
    if (err) return res.json(`Error loading article. Please try again later. ${err}`)
    return res.json(text)
  })

  calcURLS()
})

// Load file (editor mode)
app.post("/loadFile", async (req, res) => {
  const article = sanitizePath(req.body.article)
  if (article.err) return res.json(article) // Return error from sanitizePath

  let data
  try {
    data = await fs.readFile(`./${blogLocation}/${article}.md`, "UTF8")
  } catch (e) {
    return res.json({ err: "File not found." })
  }

  return res.json(data)
})

// Save file (editor mode)
app.post("/saveFile", async (req, res) => {
  if (incorrectKeyTimeout)
    return res.json({ err: "Saving is locked, please check your Write key and try again in 10 seconds." })

  if (!WRITE_KEY || WRITE_KEY.length < 10)
    return res.json({
      err: "No Write key found or key is not long enough. Saving is disabled. Please provide a +10 chars Write key.",
    })

  const writeKey = req.body.writeKey
  if (!writeKey) return res.json({ err: "No Write key provided, please provide a key to enable saving." })

  if (writeKey !== WRITE_KEY) {
    incorrectKeyTimeout = true
    setTimeout(() => {
      incorrectKeyTimeout = false
    }, 10000)
    return res.json({ err: "Saving is locked, please check your Write key and try again in 10 seconds." })
  }

  const article = sanitizePath(req.body.article)
  if (article.err) return res.json(article)

  const text = req.body.text
  await fs.writeFile(`./${blogLocation}/${article}.md`, text)

  git.exec("status", (err, status) => {
    if (err) {
      console.error(`Error loading article: ${err}`)
      return res.json({ err: "Error loading article. Please try again later or check the server's console." })
    }
    if (status.match(/^nothing to commit, working tree clean$/gim)) return res.json(true)

    git.exec("add", ["."], (err) => {
      if (err) {
        console.error(`Error adding files to commit. ${err}`)
        return res.json({ err: "Couldn't add files to commit. Please try again later or check the server's console." })
      }
      git.exec("commit", { m: `Auto-commit: ${new Date().toISOString()}` }, [], (err) => {
        if (err) {
          console.error(`Error commiting files. ${err}`)
          return res.json({ err: "Error commiting files. Please try again later or check the server's console." })
        }

        return res.json(true)
      })
    })
  })
})

app.post("*", async (req, res) => {
  return res.status(500).json({ err: "Endpoint not found" })
})

module.exports = app
