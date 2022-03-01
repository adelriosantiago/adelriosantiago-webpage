const fs = require("fs")
const unsafeChars = [".", "\\", "0x", "?", "<", ">", ":", "*", "|", '"', "~", "@", "$", "&"]

// Get blog location
let blogLocation
try {
  if (fs.existsSync("./blog/.git")) {
    blogLocation = "blog" // Update blog as it is dev
  } else if (fs.existsSync("./static/blog/.git")) {
    blogLocation = "static/blog" // Update blog as it is dev
  } else {
    throw new Error(
      "No blog repository found. Create a init a .git repository inside `./static/blog`. This is where the blog content will live."
    )
  }
} catch (e) {
  throw new Error("Unable to check if blog exists.")
}
if (!blogLocation) throw new Error("Blog path not found, './static/blog/.git' or './blog/.git' should exist.")

module.exports = {
  blogLocation,
  sanitizePath(s) {
    s = s.trim()

    if (s[s.length - 1] === "/") return { err: "File name can't end in '/'" }
    if (unsafeChars.some((v) => s.indexOf(v) >= 0)) return { err: "Unsafe characters found." }
    if ((s.match(/\//g) || []).length > 10) return { err: "Path too long" }

    return s
  },
}
