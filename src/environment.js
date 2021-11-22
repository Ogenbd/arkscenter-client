export const baseUrl =
  process.env.NODE_ENV === "development" ? "http://localhost:5000" : "";

export const fetchMode =
  process.env.NODE_ENV === "development" ? "cors" : "same-origin";

export const fetchCredentials =
  process.env.NODE_ENV === "development" ? "include" : "same-origin";
