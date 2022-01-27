const unsafeChars = [".", "\\", "0x", "?", "<", ">", ":", "*", "|", '"', "~", "@", "$", "&"]

module.exports = {
  sanitizePath(s) {
    s = s.trim()

    if (s[s.length - 1] === "/") return { err: "File name can't end in '/'" }
    if (unsafeChars.some((v) => s.indexOf(v) >= 0)) return { err: "Unsafe characters found." }
    if ((s.match(/\//g) || []).length > 10) return { err: "Path too long" }

    return s
  },
}
