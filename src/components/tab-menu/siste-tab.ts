import { TabId } from '../side-innhold';

export const SISTE_BESOKTE_TAB_KEY = 'SISTE_BESOKTE_TAB';

interface SisteBesokteTab {
	fnr: string;
	tab: TabId;
}

export const lagreSistBesokteTab = (sisteBesokteTab: SisteBesokteTab) => {
	window.sessionStorage.setItem(SISTE_BESOKTE_TAB_KEY, JSON.stringify(sisteBesokteTab));
};

export const hentSistBesokteTab = (fnr: string): TabId | null => {
	const sisteTabStr = window.sessionStorage.getItem(SISTE_BESOKTE_TAB_KEY);

	if (!sisteTabStr) {
		return null;
	}

	const sisteTab = JSON.parse(sisteTabStr) as SisteBesokteTab;

	if (sisteTab.fnr !== fnr) {
		window.sessionStorage.removeItem(SISTE_BESOKTE_TAB_KEY);
		return null;
	}

	return sisteTab.tab;
};
