import { useMemo } from 'react';
import axios, { AxiosPromise, AxiosRequestConfig } from 'axios';
import useAxiosHook, { configure, Options, RefetchOptions, ResponseValues } from 'axios-hooks';

export type UseAxiosResponseValue<T> = ResponseValues<T, any, any> & {
	fetch: (config?: AxiosRequestConfig, options?: RefetchOptions) => AxiosPromise<T>;
};

export const axiosInstance = axios.create({
	withCredentials: true,
	headers: { 'Nav-Consumer-Id': 'veilarbpersonflatefs' },
	timeout: 5000
});

configure({ axios: axiosInstance });

export function useAxios<T = any>(config: AxiosRequestConfig | string, options?: Options): UseAxiosResponseValue<T> {
	const [{ data, loading, error }, refetch] = useAxiosHook<T>(config, options);
	return useMemo(() => ({ data, loading, error, fetch: refetch }), [data, loading, error, refetch]);
}

export function isAnyLoading(...axiosResponseValues: UseAxiosResponseValue<any>[]): boolean {
	return axiosResponseValues.some(responseValue => responseValue.loading);
}

export function hasAnyFailed(...axiosResponseValues: UseAxiosResponseValue<any>[]): boolean {
	return axiosResponseValues.some(responseValue => responseValue.error);
}
