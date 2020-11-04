import {
	Features,
	SPOR_OM_TILBAKEMELDING,
	TOUR_MODAL_LAST_NED_CV_TOGGLE,
	TOUR_MODAL_VEDTAKSSTOTTE_LANSERING_TOGGLE
} from '../../api/features';
import { AktivEnhetResponse, SistOppdatertData, UlesteDialoger } from '../../api/api';

export const testBrukerFnr = '00123456789';

export const testEnhetId = '0123';

export const mockFeatures: Features = {
	[TOUR_MODAL_VEDTAKSSTOTTE_LANSERING_TOGGLE]: true,
	[TOUR_MODAL_LAST_NED_CV_TOGGLE]: false,
	[SPOR_OM_TILBAKEMELDING]: true
};

export const mockAntallUleste: UlesteDialoger = {
	antallUleste: 1
};

export const mockSistOppdatert: SistOppdatertData = {
	sistOppdatert: '2020-06-25T12:58:12.757+02:00'
};

export const mockAktivEnhet: AktivEnhetResponse = {
	aktivEnhet: testEnhetId
};

export const mockTilgangTilBruker = true;
