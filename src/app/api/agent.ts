import axios, { AxiosResponse } from "axios";
import { Activity } from "../models/activity";

axios.defaults.baseURL = 'http://localhost:5000/api';

const responseBody = <T> (response: AxiosResponse<T>) => response.data;

const requests = {
    get: <T>(url: string) => axios.get<T>(url).then(responseBody),
    post: <T>(url: string, body: {}) => axios.post<T>(url, body).then(responseBody),
    put: <T>(url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
    del: <T>(url: string) => axios.delete<T>(url).then(responseBody)
}

const Activities = {
    list: () => requests.get<Activity[]>('/Activities'),
    details: (id: string) => requests.get<Activity>(`/Activities/${id}`),
    create: (activity: Activity) => requests.post<void>('/Activities', activity),
    update: (activity: Activity) => requests.put<void>(`/Activities/${activity.id}`, activity),
    delete: (id: string) =>  requests.del<void>(`/Activities/${id}`),
}

const agent = {
    Activities
}

export default agent;