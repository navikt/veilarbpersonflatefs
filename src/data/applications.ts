import { ComponentType } from 'react';
import AktivitetsplanPage from '../page/AktivitetsplanPage';
import DialogPage from '../page/DialogPage';
import OverblikkPage from '../page/OverblikkPage';
import OppfolgingsvedtakPage from '../page/OppfolgingsvedtakPage';
import ArbeidsmarkedstiltakPage from '../page/ArbeidsmarkedstiltakPage';
import TiltakPage from '../page/tiltak/TiltakPage';
import FinnStillingerPage from '../page/FinnStillingerPage';
import { TabId } from './tab-id';

export interface Application {
	pathEntrypoint: string;
	tabId: TabId;
	component: ComponentType<any>;
}

export const defaultApplication = {
	pathEntrypoint: '/aktivitetsplan',
	tabId: TabId.AKTIVITETSPLAN,
	component: AktivitetsplanPage
};

export const applications: Application[] = [
	defaultApplication,
	{
		pathEntrypoint: '/dialog',
		tabId: TabId.DIALOG,
		component: DialogPage
	},
	{
		pathEntrypoint: '/overblikk',
		tabId: TabId.OVERBLIKK,
		component: OverblikkPage
	},
	{
		pathEntrypoint: '/vedtaksstotte',
		tabId: TabId.VEDTAKSSTOTTE,
		component: OppfolgingsvedtakPage
	},
	{
		pathEntrypoint: '/arbeidsmarkedstiltak',
		tabId: TabId.ARBEIDSMARKEDSTILTAK,
		component: ArbeidsmarkedstiltakPage
	},
	// {
	// 	pathEntrypoint: '/arbeidsmarkedstiltak/tiltak',
	// 	tabId: TabId.ARBEIDSMARKEDSTILTAK,
	// 	component: TiltakPage
	// },
	{
		pathEntrypoint: '/finn-stillinger',
		tabId: TabId.FINN_STILLING_INNGANG,
		component: FinnStillingerPage
	}
];
