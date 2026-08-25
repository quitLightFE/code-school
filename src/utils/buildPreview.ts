const consoleInterceptor = `
<script>
(function () {
  const original = { log: console.log, warn: console.warn, error: console.error, info: console.info };
  const originalClear = console.clear;

  console.clear = () => {
    window.parent.postMessage({ source: "iframe-console", type: "clear" }, "*");
    originalClear();
  };

  function serialize(value) {
    try {
      if (typeof value === "object" && value !== null) return JSON.stringify(value, null, 2);
      return String(value);
    } catch {
      return String(value);
    }
  }

  function send(type, args) {
    window.parent.postMessage({ source: "iframe-console", type, message: args.map(serialize).join(" ") }, "*");
  }

  ["log", "warn", "error", "info"].forEach((type) => {
    console[type] = (...args) => {
      send(type, args);
      original[type](...args);
    };
  });

  window.onerror = function (message, source, line, column) {
    send("error", [message + " (" + line + ":" + column + ")"]);
  };

  window.addEventListener("unhandledrejection", (event) => {
    send("error", ["Unhandled Promise Rejection:", event.reason]);
  });
})();
</script>
`;

export const buildSrcDoc = (html: string, css: string, js: string) => `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8">
      <style>${css}</style>
      ${consoleInterceptor}
    </head>
    <body>
      ${html}
      <script>${js}</script>
    </body>
  </html>
`;