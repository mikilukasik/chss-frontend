export const catchErrors = ({ logger }: { logger: (arg: any) => void }) => {
  // self.onerror = (message, source, lineno, colno, error) => {
  //   logger({
  //     type: "error",
  //     message,
  //     source,
  //     lineno,
  //     colno,
  //     error,
  //     stack: (error || {}).stack,
  //   });
  // };

  self.addEventListener("error", (e) => {
    logger({
      type: "error",
      message: (e.message || e.error?.message) + 1,
      stack: e.error?.stack,
      filename: e.filename,
      lineno: e.lineno,
      colno: e.colno,
    });
  });

  self.addEventListener("unhandledrejection", (e) => {
    logger({
      type: "error",
      message: e.reason.message,
      stack: e.reason.stack,
    });
  });
};
