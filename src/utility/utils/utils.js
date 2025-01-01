import axios from "axios";

const decodeError = (error, defaultMessage = "") => {
  const message =
    error?.response?.data?.msg ||
    error?.response?.data?.error ||
    error?.message ||
    defaultMessage;
  const code = error.response.status || error.code || 400;
  return { message, code };
};

const callApi = async (options, retry = 0) => {
  try {
    const response = await axios(options);
    return response.data;
  } catch (error) {
    if (error.status >= 500 && retry < 3) {
      callApi(options, ++retry);
    }
    throw error;
  }
};

export { decodeError, callApi };
