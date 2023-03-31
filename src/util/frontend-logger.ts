import { sendEventTilVeilarbperson } from '../api/api';

export interface FrontendEvent {
	name: string;
	fields?: {};
	tags?: {};
}

export const logEvent = (metrikkNavn: string, fields?: {}, tags?: {}): void => {
	if (import.meta.env.MODE === 'development') {
		// tslint:disable-next-line:no-console
		console.log('Event', metrikkNavn, 'Fields:', fields, 'Tags:', tags);
	} else {
		sendEventTilVeilarbperson({ name: `veilarbpersonflatefs.metrikker.${metrikkNavn}`, fields, tags });
	}
};
