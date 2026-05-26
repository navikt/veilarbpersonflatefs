export const DIALOG_WEBSOCKET = 'veilarbpersonflatefs.dialog.websockets';
export const BRUK_AO_KONTOR_SOM_MASTER = 'bruk_ao_kontor_som_master';
export const DAB_UNLEASH_TOGGLES = [DIALOG_WEBSOCKET];

export interface DabUnleashFeatures {
	[DIALOG_WEBSOCKET]: boolean;
	[BRUK_AO_KONTOR_SOM_MASTER]: boolean;
}
