import axios, { AxiosPromise, AxiosRequestConfig } from 'axios';
import useAxiosHook, { configure, Options, RefetchOptions, ResponseValues } from 'axios-hooks';

type UseAxiosResponseValue<T> = ResponseValues<T> & {
	refetch: (config?: AxiosRequestConfig, options?: RefetchOptions) => AxiosPromise<T>;
};

export const axiosInstance = axios.create({
	withCredentials: true,
	headers: {'X-Consumer-Id': 'veilarbpersonflatefs'}
});

configure({ axios: axiosInstance });

export function useAxios<T = any>(config: AxiosRequestConfig | string, options?: Options): UseAxiosResponseValue<T> {
	const [{ data, loading, error }, refetch] = useAxiosHook<T>(config, options);
	return { data, loading, error, refetch };
}

export function isAnyLoading(...axiosResponseValues: Array<UseAxiosResponseValue<any>>): boolean {
	return axiosResponseValues.some(responseValue => responseValue.loading);
}

export function hasAnyFailed(...axiosResponseValues: Array<UseAxiosResponseValue<any>>): boolean {
	return axiosResponseValues.some(responseValue => responseValue.error);
}
