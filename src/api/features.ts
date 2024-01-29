export const VIS_GAMLE_DETALJER_FANE = 'veilarbpersonflatefs.vis-gamle-detaljer-fane';
export const DIALOG_WEBSOCKET = 'veilarbpersonflatefs.dialog.websockets';

export const OBO_UNLEASH_TOGGLES = [VIS_GAMLE_DETALJER_FANE];
export const DAB_UNLEASH_TOGGLES = [DIALOG_WEBSOCKET];

export interface OboUnleashFeatures {
	[VIS_GAMLE_DETALJER_FANE]: boolean;
}

export interface DabUnleashFeatures {
	[DIALOG_WEBSOCKET]: boolean;
}
