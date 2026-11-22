const {createHash} = require("node:crypto");
const {readFileSync, writeFileSync} = require("node:fs");
const {resolve, join} = require("node:path");

const root = resolve(__dirname, "..");
const read = path => readFileSync(join(root, path), "utf8").replace(/\r\n?/g, "\n");
const hash = source => "'sha256-" + createHash("sha256").update(source).digest("base64") + "'";
const policy = (html, offline) => {
  const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(match => hash(match[1]));
  const styles = [...html.matchAll(/<style>([\s\S]*?)<\/style>/g)].map(match => hash(match[1]));
  const sources = hashes => (offline ? hashes : ["'self'", ...hashes]).join(" ");
  const content = [
    "default-src 'none'", "base-uri 'none'", "form-action 'none'", "connect-src 'none'",
    "script-src " + sources(scripts), "style-src " + sources(styles),
    "img-src blob: data:", "media-src blob:", "object-src 'none'", "frame-src 'none'"
  ].join("; ");
  return html.replace(/(<meta http-equiv="Content-Security-Policy" content=")[^"]*(")/, "$1" + content + "$2");
};

const source = read("index.html");
writeFileSync(join(root, "index.html"), policy(source, false));
if (process.argv[2]) {
  const library = read("vendor/cfb.min.js").replace(/^\/\/[#@] sourceMappingURL=.*$/gm, "");
  const license = read("vendor/cfb-LICENSE.txt");
  const offline = source
    .replace('<link rel="stylesheet" href="styles.css">', () => "<style>\n" + read("styles.css") + "</style>")
    .replace('<script src="vendor/cfb.min.js"></script>', () =>
      "<!-- Bundled CFB library license\n" + license + "\n-->\n<script>\n" + library + "\n</script>")
    .replace('<script src="vendor/pdf-preview.min.js" defer></script>', () =>
      "<!-- Bundled PDF.js license\n" + read("vendor/pdfjs-LICENSE.txt") +
      "\n-->\n<script>\n" + read("vendor/pdf-preview.min.js") + "\n</script>");
  writeFileSync(resolve(process.argv[2]), policy(offline, true));
}
