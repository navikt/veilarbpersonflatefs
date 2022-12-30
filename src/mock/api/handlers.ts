import { ResponseComposition, rest, RestContext, RestRequest } from 'msw';
import {
	aktivBrukerMock,
	aktiviteterMockdata, contextMock,
	defaultSessionDataMockConfig, harniva4MockData, lesMockData, meMockData,
	mockAktivEnhet, mockAktorFnrMappingMockData,
	mockAntallUleste,
	mockFeatures,
	mockSistOppdatert,
	mockTilgangTilBruker, oppfolgingMockData, oppfolgingsStatusMockData, personV2mockData,
	sessionData as getSessionData, veilederHarTilgangMockData, veilederMeMockData
} from './data';
import { SessionMeta } from '../../api/api';

const HTTP_OK = 200;

let sessionDataMockConfig = defaultSessionDataMockConfig(Date.now());
let sessionData: SessionMeta = getSessionData(sessionDataMockConfig);

export const sesjonUtlopt = (): boolean => {
	if (sessionData?.tokens?.expire_at && sessionData?.session?.ends_at) {
		return Date.now() >= Math.min(new Date(sessionData.tokens.expire_at).getTime(), new Date(sessionData.session.ends_at).getTime());
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
	rest.get('/veilarbdialog/api/eskaleringsvarsel/gjeldende', responseResolver({ status: 204 })),
	rest.get('/veilarbdialog/api/dialog', responseResolver({ json: [] })),

	rest.get('/modiacontextholder/api/context/aktivenhet', responseResolver({ json: mockAktivEnhet })),
	rest.get('/modiacontextholder/api/context/aktivbruker', responseResolver({ json: aktivBrukerMock })),
	rest.get('/modiacontextholder/api/decorator/aktor/:fnr', responseResolver({ json: mockAktorFnrMappingMockData })),
	rest.get('/modiacontextholder/api/decorator', responseResolver({ json: contextMock })),

	rest.get('/veilarbperson/api/person/:fnr/tilgangTilBruker', responseResolver({ json: mockTilgangTilBruker })),
	rest.get('/veilarbperson/api/v2/person/vergeOgFullmakt', responseResolver({ status: 204})),
	rest.get('/veilarbperson/api/person/:fnr/harNivaa4', responseResolver({ json: harniva4MockData })),
	rest.get('/veilarbperson/api/v2/person', responseResolver({json: personV2mockData })),
	rest.get('/veilarbperson/api/v2/person/tolk', responseResolver({ status: 204 })),

	rest.post('/veilarboppfolging/api/v2/manuell/synkroniser-med-dkif', responseResolver({ status: 204 })),
	rest.get('/veilarboppfolging/api/oppfolging', responseResolver({ json: oppfolgingMockData })),
	rest.get('/veilarboppfolging/api/person/:fnr/oppfolgingsstatus', responseResolver({ json: oppfolgingsStatusMockData })),
	rest.get('/veilarboppfolging/api/oppfolging/veilederTilgang', responseResolver({ json: veilederHarTilgangMockData })),
	rest.get('/veilarboppfolging/api/oppfolging/me', responseResolver({ json: meMockData })),
	rest.get('/veilarboppfolging/api/oppfolging/harFlereAktorIderMedOppfolging', responseResolver({  json: false })),
	rest.get('/veilarboppfolging/api/oppfolging/mal', responseResolver({ status: 200  })),
	rest.post('veilarboppfolging/api/:fnr/lestaktivitetsplan', responseResolver({ status: 204 })),

	rest.get('/veilarbveileder/api/veileder/me', responseResolver({ json: veilederMeMockData })),
	rest.get('/veilarbveileder/api/enhet/:enhetsNr/veiledere', responseResolver({ status: 204 })),

	rest.get('/veilarbaktivitet/api/aktivitet', responseResolver({json: aktiviteterMockdata })),
	rest.post('/veilarbaktivitet/api/logger/event', responseResolver({ status: 204 })),
	rest.get('/veilarbaktivitet/api/arena/tiltak', responseResolver({ json: [] })),

	rest.get('/veilarbportefolje/api/arbeidsliste/:fnr', responseResolver({ json: {} })),
    rest.get('/veilarblest/api/aktivitetsplan/les', responseResolver({ json: lesMockData })),
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
