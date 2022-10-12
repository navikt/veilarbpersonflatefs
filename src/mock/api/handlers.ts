import { ResponseComposition, rest, RestContext, RestRequest } from 'msw';
import {
	defaultSessionDataMockConfig,
	mockAktivEnhet,
	mockAntallUleste,
	mockFeatures,
	mockSistOppdatert,
	mockTilgangTilBruker,
	sessionData as getSessionData
} from './data';
import { SessionMeta } from '../../api/api';

const HTTP_OK = 200;

let sessionDataMockConfig = defaultSessionDataMockConfig(Date.now());
let sessionData: SessionMeta = getSessionData(sessionDataMockConfig);

export const sesjonUtlopt = (): boolean => {
	if (sessionData && sessionData.tokens && sessionData.tokens.expire_at) {
		return Date.now() >= new Date(sessionData?.tokens?.expire_at).getTime();
	}

	return false;
};

interface ResponseResolverOptions<RESPONSE_TYPE> {
	json?: RESPONSE_TYPE;
	status?: number;
	delay?: number;
}

const responseResolver = <RESPONSE_TYPE>(
	{ status, json, delay }: ResponseResolverOptions<RESPONSE_TYPE>,
	refreshSessionOnSuccess: boolean = true
) => {
	return (req: RestRequest, res: ResponseComposition, ctx: RestContext) => {
		if (sesjonUtlopt()) {
			return res(ctx.status(401));
		}

		if(refreshSessionOnSuccess) {
			sessionData = getSessionData(sessionDataMockConfig)
		}

		return res(ctx.status(status || HTTP_OK), ctx.json(json || undefined), ctx.delay(delay || 500));
	};
};

export const handlers = [
	rest.get('/oauth2/session', responseResolver({ json: sessionData })),
	rest.get('/veilarbpersonflatefs/api/feature', responseResolver({ json: mockFeatures })),
	rest.get('/veilarbdialog/api/dialog/antallUleste', responseResolver({ json: mockAntallUleste })),
	rest.get('/veilarbdialog/api/dialog/sistOppdatert', responseResolver({ json: mockSistOppdatert })),
	rest.get('/modiacontextholder/api/context/aktivenhet', responseResolver({ json: mockAktivEnhet })),
	rest.get('/veilarbperson/api/person/:fnr/tilgangTilBruker', responseResolver({ json: mockTilgangTilBruker })),
	rest.post('/veilarboppfolging/api/v2/manuell/synkroniser-med-dkif', responseResolver({ status: 204 })),
	rest.get(
		'/auth/info',
		responseResolver({
			json: {
				loggedIn: true,
				expirationTime: '2040-07-04T14:18:54.000Z',
				remainingSeconds: 60 * 70
			}
		})
	)
];
