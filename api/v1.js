const bodyParser = require("body-parser")
const app = require("express")()

app.use(bodyParser.json())

app.post("/", async (req, res) => {
  return res.json({ ok: true })
})

app.post("*", async (req, res) => {
  return res.status(500).json({ err: "Endpoint not found" })
})

module.exports = app
