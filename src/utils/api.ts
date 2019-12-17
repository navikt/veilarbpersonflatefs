import { fetchToJson } from './rest-utils';

export const FEATURE_TOGGLE_URL = '/veilarbpersonflatefs/api/feature';
export const ULESTE_DIALOGER_URL = '/veilarbdialog/api/dialog/antallUleste';

export interface UlesteDialoger {
	antallUleste: number;
}

export function fetchUlesteDialoger(fnr: string): Promise<UlesteDialoger> {
	return fetchToJson<UlesteDialoger>(`${ULESTE_DIALOGER_URL}/?fnr=${fnr}`);
}
