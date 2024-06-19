import React from "react";
import axios from "axios";
import { REQUEST_STATUS } from "../constants/requestStatus";
import MySwal from "../utils/swal";
import { logout } from "../utils/auth";

const customAxios = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL + "/api",
});

customAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (!config.headers?.authorization && token) {
    config.headers.authorization = token;
  }

  return config;
});

const useAxios = (axiosConfig, options = { manual: false }) => {
  const [data, setData] = React.useState();
  const [error, setError] = React.useState();
  const [status, setStatus] = React.useState(
    options.manual ? REQUEST_STATUS.IDLE : REQUEST_STATUS.LOADING
  );

  const executeRequest = React.useCallback(
    async (config = {}, cb = () => {}) => {
      try {
        setStatus(REQUEST_STATUS.LOADING);
        const response = await customAxios({ ...axiosConfig, ...config });
        setStatus(REQUEST_STATUS.SUCCESS);
        setData(response?.data);
        cb(response?.data);
      } catch (error) {
        MySwal.showError({
          title: "Error",
          text:
            error?.response?.data?.message ||
            error?.message ||
            "Something went wrong!",
        });
        if (error?.response?.status === 401) {
          logout();
        }
        setStatus(REQUEST_STATUS.ERROR);
        setError(error);
      }
    },
    [axiosConfig]
  );

  React.useEffect(() => {
    if (!options.manual) {
      executeRequest();
    }
  }, []);

  return [{ data, error, status }, executeRequest];
};

export default useAxios;
