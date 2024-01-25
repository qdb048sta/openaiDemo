import axios from "axios";

export type ErrorData = {
  key: string;
  memory: { from: "ai" | "user"; content: string }[];
  status: "success" | "pending" | "error";
  timestamp: string;
};

export const QUERY_KEYS = {
  getAi: "getAi",
};

export const getAi = async () => {
  try {
    const response = await axios.get<ErrorData[]>(
      "http://localhost:8443/langChain"
    );
    return response.data;
  } catch (err) {
    console.error(err);
  }
};

export const postAi = async (payload: { error: string; input?: string }) => {
  try {
    const response = await axios.post<ErrorData[]>(
      "http://localhost:8443/langChain",
      payload
    );
    return response.data;
  } catch (err) {
    console.error(err);
  }
};
