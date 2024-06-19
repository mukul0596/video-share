import { REQUEST_STATUS } from "../constants/requestStatus";

export const isIdle = (status) => status === REQUEST_STATUS.IDLE;
export const isSuccess = (status) => status === REQUEST_STATUS.SUCCESS;
export const isError = (status) => status === REQUEST_STATUS.ERROR;
export const isLoading = (status) => status === REQUEST_STATUS.LOADING;
export const isNotIdle = (status) => status !== REQUEST_STATUS.IDLE;
export const isNotSuccess = (status) => status !== REQUEST_STATUS.SUCCESS;
export const isNotError = (status) => status !== REQUEST_STATUS.ERROR;
export const isNotLoading = (status) => status !== REQUEST_STATUS.LOADING;
