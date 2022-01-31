import { rest } from 'msw';
import { mockAktivEnhet, mockAntallUleste, mockFeatures, mockSistOppdatert, mockTilgangTilBruker } from './data';

export const handlers = [
	rest.get('/veilarbpersonflatefs/api/feature', (req, res, ctx) => {
		return res(ctx.delay(500), ctx.json(mockFeatures));
	}),
	rest.get('/veilarbdialog/api/dialog/antallUleste', (req, res, ctx) => {
		return res(ctx.delay(500), ctx.json(mockAntallUleste));
	}),
	rest.get('/veilarbdialog/api/dialog/sistOppdatert', (req, res, ctx) => {
		return res(ctx.delay(500), ctx.json(mockSistOppdatert));
	}),
	rest.get('/modiacontextholder/api/context/aktivenhet', (req, res, ctx) => {
		return res(ctx.delay(500), ctx.json(mockAktivEnhet));
	}),
	rest.get('/veilarbperson/api/person/:fnr/tilgangTilBruker', (req, res, ctx) => {
		return res(ctx.delay(500), ctx.json(mockTilgangTilBruker));
	}),
	rest.post('/veilarboppfolging/api/v2/manuell/synkroniser-med-dkif', (req, res, ctx) => {
		return res(ctx.delay(500), ctx.status(204));
	})
];
