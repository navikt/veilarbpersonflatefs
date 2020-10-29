import { useCallback, useMemo, useState } from 'react';
import useFetchHook from 'react-fetch-hook';

export interface FetchResponse<D = any> {
	error?: any;
	data?: D;
	httpCode?: number;
}

export type UseFetchState<T> = useFetchHook.FetchResult<T> & { refetch: () => void}

export function useFetch<T>(requestInfo: RequestInfo,
							options?: useFetchHook.HookOptions | useFetchHook.HookOptionsWithFormatter<T>,
							specialOptions?: useFetchHook.HookOptions): UseFetchState<T> {
	const [trigger, setTrigger] = useState(1);
	const dependsWithTrigger = options && options.depends ? [...options.depends, trigger] : [trigger];
	const fetchState = useFetchHook<T>(requestInfo, Object.assign(options || {}, {depends: dependsWithTrigger}), specialOptions);
	const refetch = useCallback(() => {
		setTrigger(prev => ++prev);
	}, []);

	return useMemo(() => ({...fetchState, refetch}), [fetchState, refetch]);
}

export const hasAnyFailed = (state: UseFetchState<any> | Array<UseFetchState<any>>): boolean => {
	if (Array.isArray(state)) {
		return state.some(s => s.error !== undefined);
	}
	return state.error !== undefined;
};

export const isAnyLoading = (state: UseFetchState<any> | Array<UseFetchState<any>>): boolean => {
	if (Array.isArray(state)) {
		return state.some(s => s.isLoading);
	}
	return state.isLoading;
};
