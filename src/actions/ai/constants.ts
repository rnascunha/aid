export const pythonPath = "./scripts/.venv/bin/python";
export const serverAPIhost =
  process.env.NODE_ENV === "production"
    ? "http://aid-api"
    : "http://127.0.0.1:8000";
