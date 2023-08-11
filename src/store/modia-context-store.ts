import React, { useContext } from 'react';
import { DispatchContext } from './store-provider';

export interface ModiaContextData {
	aktivBrukerFnr: string;
	aktivEnhetId: string | null;
	renderKey: number;
}

// tslint:disable-next-line:no-empty
const noop = () => {};

const defaultValue = {
	aktivBrukerFnr: '',
	aktivEnhetId: null,
	dispatch: noop,
	renderKey: 1
};
export const ModiaContext = React.createContext<ModiaContextData>(null);
export const useModiaContext = () => {
	const dispatch = useContext(DispatchContext);
	const values = useContext(ModiaContext);
	return {
		...values,
		setAktivBrukerFnr: (fnr: string) => dispatch({ type: SET_FNR, fnr }),
		setAktivEnhetId: (enhet: string) => dispatch({ type: SET_ENHET, enhet }),
		setRenderKey: (renderKey: number) => dispatch({ type: SET_RENDER_KEY, renderKey })
	};
};

export const SET_FNR = 'SET_FNR' as const;
interface SetFnr {
	type: typeof SET_FNR;
	fnr: string;
}
const SET_ENHET = 'SET_ENHET' as const;
interface SetEnhet {
	type: typeof SET_ENHET;
	enhet: string;
}
export const SET_RENDER_KEY = 'SET_RENDER_KEY' as const;
interface SetRenderKey {
	type: typeof SET_RENDER_KEY;
	renderKey: number;
}
export const reducer = (state: ModiaContextData, action: SetFnr | SetEnhet | SetRenderKey): ModiaContextData => {
	switch (action.type) {
		case 'SET_ENHET':
			return {
				...state,
				aktivEnhetId: action.enhet
			};
		case 'SET_RENDER_KEY':
			return {
				...state,
				renderKey: action.renderKey
			};
		case SET_FNR:
			return {
				...state,
				aktivBrukerFnr: action.fnr
			};
		default:
			throw Error('Unknown action');
	}
};

export const createInitialStore = (fnr: string) => {
	return {
		...defaultValue,
		aktivBrukerFnr: fnr
	};
};
