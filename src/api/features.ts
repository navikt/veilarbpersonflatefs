export const ARBEIDSMARKEDSTILTAK_LANSERING = 'mulighetsrommet-veileder-flate.lansering';
export const VIS_GAMLE_DETALJER_FANE = 'veilarbpersonflatefs.vis-gamle-detaljer-fane';
export const DIALOG_WEBSOCKET = 'arbeidsrettet-dialog.websockets';

export const OBO_UNLEASH_TOGGLES = [DIALOG_WEBSOCKET];
export const DAB_UNLEASH_TOGGLES = [];

export interface OboUnleashFeatures {
	[VIS_GAMLE_DETALJER_FANE]: boolean;
}

export interface DabUnleashFeatures {
	[DIALOG_WEBSOCKET]: boolean;
}
