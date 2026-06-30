const requestLogger = (req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const ms = Date.now() - start;
    const sc = res.statusCode;
    const color =
      sc >= 500 ? "\x1b[31m" : sc >= 400 ? "\x1b[33m" : sc >= 300 ? "\x1b[36m" : "\x1b[32m";
    const reset = "\x1b[0m";
    const ts = new Date().toISOString();
    console.log(`${color}[${ts}] ${req.method} ${req.originalUrl} → ${sc} (${ms}ms)${reset}`);
  });

  next();
};

module.exports = requestLogger;
