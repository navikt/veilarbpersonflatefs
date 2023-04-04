import React, { useEffect, useReducer } from 'react';
import { useEventListener } from '../util/utils';
import { createInitialStore, ModiaContext, reducer, SET_RENDER_KEY } from './modia-context-store';
import { a } from 'msw/lib/SetupServerApi-1855d9c6';

interface StoreProviderProps {
	fnr: string;
	children: React.ReactNode;
}

export const DispatchProvider = React.createContext((a: any) => {});

const StoreProvider = (props: StoreProviderProps) => {
	const [state, dispatch] = useReducer(reducer, props.fnr, createInitialStore);
	console.log({ state, fnr: props.fnr });
	const forceRerender = () => dispatch({ type: SET_RENDER_KEY, renderKey: state.renderKey + 1 });
	useEventListener('rerenderMao', forceRerender);
	useEventListener('oppfolgingAvslutet', forceRerender);
	useEventListener('eskaleringsVarselSendt', forceRerender);

	return (
		<DispatchProvider.Provider value={dispatch}>
			<ModiaContext.Provider value={state}>{props.children}</ModiaContext.Provider>
		</DispatchProvider.Provider>
	);
};

export default StoreProvider;
