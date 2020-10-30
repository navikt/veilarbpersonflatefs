import { rest } from 'msw'
import { AKTIV_ENHET_URL, FEATURE_TOGGLE_URL, SIST_OPPDATERT_DIALOGER_URL, ULESTE_DIALOGER_URL } from '../api/api';
import { mockAktivEnhet, mockAntallUleste, mockFeatures, mockSistOppdatert } from './data';

export const handlers = [
	rest.get(FEATURE_TOGGLE_URL, (req, res, ctx) => {
		return res(ctx.delay(500), ctx.json(mockFeatures));
	}),
	rest.get(ULESTE_DIALOGER_URL, (req, res, ctx) => {
		return res(ctx.delay(500), ctx.json(mockAntallUleste));
	}),
	rest.get(SIST_OPPDATERT_DIALOGER_URL, (req, res, ctx) => {
		return res(ctx.delay(500), ctx.json(mockSistOppdatert));
	}),
	rest.get(AKTIV_ENHET_URL, (req, res, ctx) => {
		return res(ctx.delay(500), ctx.json(mockAktivEnhet));
	}),
];
