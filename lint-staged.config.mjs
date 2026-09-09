import path from "node:path"

export default {
  "apps/web/**/*.{ts,tsx}": (filenames) => {
    const cwd = process.cwd()
    const relFiles = filenames
      .map((f) => {
        const full = path.isAbsolute(f) ? f : path.join(cwd, f)
        const rel = path.relative(path.join(cwd, "apps/web"), full)
        return `"${rel.replace(/\\/g, "/")}"`
      })
      .join(" ")
    const quotedFiles = filenames.map((f) => `"${f}"`).join(" ")
    return [
      `pnpm --filter web exec eslint --fix ${relFiles}`,
      `prettier --write ${quotedFiles}`,
    ]
  },
  "**/*.{json,yaml,yml,md,css,js,mjs,cjs}": (filenames) => {
    const quotedFiles = filenames.map((f) => `"${f}"`).join(" ")
    return `prettier --write ${quotedFiles}`
  },
}
