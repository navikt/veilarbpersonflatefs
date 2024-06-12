import { ComponentType } from 'react';
import AktivitetsplanPage from '../page/AktivitetsplanPage';
import DialogPage from '../page/DialogPage';
import OverblikkPage from '../page/OverblikkPage';
import OppfolgingsvedtakPage from '../page/OppfolgingsvedtakPage';
import ArbeidsmarkedstiltakPage from '../page/ArbeidsmarkedstiltakPage';
import FinnStillingerPage from '../page/FinnStillingerPage';
import { AppId, TabId } from './tab-id';
import DeltakelsePage from '../page/DeltakelsePage';

export interface Application {
	id: AppId;
	pathEntrypoint: string;
	tabId: TabId;
	component: ComponentType<any>;
}

export const defaultApplication = {
	id: AppId.AKTIVITETSPLAN,
	pathEntrypoint: '/aktivitetsplan',
	tabId: TabId.AKTIVITETSPLAN,
	component: AktivitetsplanPage
};

export const applications: Application[] = [
	defaultApplication,
	{
		id: AppId.DIALOG,
		pathEntrypoint: '/dialog',
		tabId: TabId.DIALOG,
		component: DialogPage
	},
	{
		id: AppId.OVERBLIKK,
		pathEntrypoint: '/overblikk',
		tabId: TabId.OVERBLIKK,
		component: OverblikkPage
	},
	{
		id: AppId.VEDTAKSSTOTTE,
		pathEntrypoint: '/vedtaksstotte',
		tabId: TabId.VEDTAKSSTOTTE,
		component: OppfolgingsvedtakPage
	},
	{
		id: AppId.DELTAKELSE,
		pathEntrypoint: '/arbeidsmarkedstiltak/deltakelse',
		tabId: TabId.ARBEIDSMARKEDSTILTAK,
		component: DeltakelsePage
	},
	{
		id: AppId.ARBEIDSMARKEDSTILTAK,
		pathEntrypoint: '/arbeidsmarkedstiltak',
		tabId: TabId.ARBEIDSMARKEDSTILTAK,
		component: ArbeidsmarkedstiltakPage
	},
	{
		id: AppId.FINN_STILLING_INNGANG,
		pathEntrypoint: '/finn-stillinger',
		tabId: TabId.FINN_STILLING_INNGANG,
		component: FinnStillingerPage
	}
];
