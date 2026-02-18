import React, { useContext } from 'react';
import { DispatchContext } from './store-provider';
import { erMock } from '../util/utils';
import { applications } from '../data/applications';
import { dispatchNavigateEvent } from '../Router';
import { testEnhetId } from '../mock/api/data';

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
export const ModiaContext = React.createContext<ModiaContextData>(null as any);
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

export const ON_AKTIV_BRUKER_CHANGED = 'ON_AKTIV_BRUKER_CHANGED' as const;

interface OnAktivBrukerChanged {
	type: typeof ON_AKTIV_BRUKER_CHANGED;
	fnr: string | null | undefined;
}

export const ON_AKTIV_ENHET_CHANGED = 'ON_AKTIV_ENHET_CHANGED' as const;

interface OnAktivEnhetChanged {
	type: typeof ON_AKTIV_ENHET_CHANGED;
	enhet: string | null | undefined;
}

export type ModiaContextActions = SetFnr | SetEnhet | SetRenderKey | OnAktivBrukerChanged | OnAktivEnhetChanged;
export type ModiaContextDispatchActions = (action: ModiaContextActions) => void;

export const reducer = (state: ModiaContextData, action: ModiaContextActions): ModiaContextData => {
	switch (action.type) {
		case 'ON_AKTIV_ENHET_CHANGED':
			if (action.enhet && action.enhet !== state.aktivEnhetId) {
				return {
					...state,
					aktivEnhetId: action.enhet
				};
			}
			return state;
		case 'ON_AKTIV_BRUKER_CHANGED':
			if (!action.fnr) return state;

			const forrigeFnr = state.aktivBrukerFnr;
			const application = applications.find(app => window.location.pathname.startsWith(app.pathEntrypoint));
			const harByttetBruker = !!forrigeFnr; // hvis ikke finnes forrige bruker er dette feltet tom string, ikke undefined
			const skalNavigereTilRot = application && harByttetBruker;

			if (skalNavigereTilRot) {
				dispatchNavigateEvent(application.pathEntrypoint);
			}
			return {
				...state,
				aktivBrukerFnr: action.fnr
			};
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

export const createInitialStore = (fnr: string): ModiaContextData => {
	// For å unngå at vi viser "Du må søke opp en person for å vise aktivitetsplanen"-feilmelding
	// når man kjører appen lokalt, må `aktivBrukerFnr` settes til en verdi.
	// Årsaken til dette er at internflatedecorator-en ikke er tilgjengelig lokalt og
	// derfor ikke har mulighet til å oppdatere aktiv bruker.
	// Om vi finner en løsning der vi kan dra inn internflatedecorator når appen kjøres lokalt,
	// kan antakeligvis `erMock`-steget fjernes.
	return erMock()
		? {
				...defaultValue,
				aktivBrukerFnr: '12345678900',
				aktivEnhetId: testEnhetId
			}
		: {
				...defaultValue,
				aktivBrukerFnr: fnr
			};
};
