import React, { useReducer } from 'react';
import { useEventListener } from '../util/utils';
import { createInitialStore, ModiaContext, reducer, SET_RENDER_KEY } from './modia-context-store';

interface StoreProviderProps {
	fnr: string;
	children: React.ReactNode;
}

export const DispatchProvider = React.createContext((a: any) => {});

const StoreProvider = (props: StoreProviderProps) => {
	const [state, dispatch] = useReducer(reducer, props.fnr, createInitialStore);

	// const [fnr, setFnr] = useState(props.fnr);
	// const [aktivEnhet, setAktivEnhet] = useState<null | string>(null);
	// const [renderKey, setRenderKey] = useState(1);
	//
	// const memoSetfnr = useMemo(() => setFnr, [setFnr]);
	// const memoSetEnhet = useMemo(() => setAktivEnhet, [setAktivEnhet]);
	// const memoSetRenderKey = useMemo(() => setRenderKey, [setRenderKey]);
	//
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
