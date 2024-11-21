import { API_ROUTER } from "./apiRouter";
import { axiosGet } from "./axiosHelper";

export const GetFiltersService = () => {
    return axiosGet(API_ROUTER.GET_FILTERS);
};
