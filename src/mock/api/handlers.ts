import { delay, http, HttpResponse, JsonBodyType } from 'msw';
import {
	aktivBrukerMock,
	aktiviteterMockdata,
	contextMock,
	defaultSessionDataMockConfig,
	harniva4MockData,
	lesMockData,
	malMockData,
	meMockData,
	mockAktivEnhet,
	mockAktorFnrMappingMockData,
	mockAntallUleste,
	mockMulighetsrommetUnleashFeatures,
	mockOboUnleashFeatures,
	mockSistOppdatert,
	mockTilgangTilBruker,
	oppfolgingMockData,
	oppfolgingsStatusMockData,
	personV2mockData,
	sessionData as getSessionData,
	veilederHarTilgangMockData,
	veilederMeMockData
} from './data';
import { SessionMeta } from '../../api/api';

const HTTP_OK = 200;
const DEFAULT_DELAY_MILLISECONDS = 100;

const sessionDataMockConfig = defaultSessionDataMockConfig(Date.now());
let sessionData: SessionMeta = getSessionData(sessionDataMockConfig);

export const sesjonUtlopt = (): boolean => {
	if (sessionData?.tokens?.expire_at && sessionData?.session?.ends_at) {
		return (
			Date.now() >=
			Math.min(new Date(sessionData.tokens.expire_at).getTime(), new Date(sessionData.session.ends_at).getTime())
		);
	}

	return false;
};

interface ResponseResolverOptions<RESPONSE_TYPE> {
	json?: RESPONSE_TYPE;
	status?: number;
	delayMilliseconds?: number;
}

const responseResolver = <RESPONSE_TYPE extends JsonBodyType>(
	{ status, json, delayMilliseconds }: ResponseResolverOptions<RESPONSE_TYPE>,
	refreshSessionOnSuccess: boolean = true
) => {
	return async () => {
		if (sesjonUtlopt()) {
			return new HttpResponse(null, { status: 401 });
		}

		if (refreshSessionOnSuccess) {
			sessionData = getSessionData(sessionDataMockConfig);
		}

		await delay(delayMilliseconds ?? DEFAULT_DELAY_MILLISECONDS);
		return HttpResponse.json(json, { status: status ?? HTTP_OK })
	};
};

export const handlers = [
	http.get('/oauth2/session', responseResolver({ json: sessionData })),
	http.get('/obo-unleash/api/feature', responseResolver({ json: mockOboUnleashFeatures })),
	http.get(
		'/mulighetsrommet-api/api/v1/internal/features',
		responseResolver({ json: mockMulighetsrommetUnleashFeatures })
	),
	http.get('/veilarbdialog/api/dialog/antallUleste', responseResolver({ json: mockAntallUleste })),
	http.get('/veilarbdialog/api/dialog/sistOppdatert', responseResolver({ json: mockSistOppdatert })),
	http.get('/modiacontextholder/api/context/aktivenhet', responseResolver({ json: mockAktivEnhet })),
	http.get('/veilarbperson/api/v3/person/hent-tilgangTilBruker', responseResolver({ json: mockTilgangTilBruker })),
	http.post('/veilarboppfolging/api/v3/manuell/synkroniser-med-dkif', responseResolver({ status: 204 })),

	http.get('/veilarbdialog/api/eskaleringsvarsel/gjeldende', responseResolver({ status: 204 })),
	http.get('/veilarbdialog/api/dialog', responseResolver({ json: [] })),

	http.get('/modiacontextholder/api/context/aktivenhet', responseResolver({ json: mockAktivEnhet })),
	http.get('/modiacontextholder/api/context/aktivbruker', responseResolver({ json: aktivBrukerMock })),
	http.post(
		'/modiacontextholder/api/v2/decorator/aktor/hent-fnr',
		responseResolver({ json: mockAktorFnrMappingMockData })
	),
	http.get('/modiacontextholder/api/decorator', responseResolver({ json: contextMock })),

	http.post('/veilarbperson/api/v3/person/hent-tilgangTilBruker', responseResolver({ json: mockTilgangTilBruker })),
	http.post('/veilarbperson/api/v3/person/hent-vergeOgFullmakt', responseResolver({ status: 204 })),
	http.get('/veilarbperson/api/person/:fnr/harNivaa4', responseResolver({ json: harniva4MockData })),
	http.post('/veilarbperson/api/v3/hent-person', responseResolver({ json: personV2mockData })),
	http.post('/veilarbperson/api/v3/person/hent-tolk', responseResolver({ status: 204 })),

	http.post('/veilarboppfolging/api/v3/manuell/synkroniser-med-dkif', responseResolver({ status: 204 })),
	http.get('/veilarboppfolging/api/oppfolging', responseResolver({ json: oppfolgingMockData })),
	http.post(
		'/veilarboppfolging/api/v2/person/hent-oppfolgingsstatus',
		responseResolver({ json: oppfolgingsStatusMockData })
	),
	http.get(
		'/veilarboppfolging/api/oppfolging/veilederTilgang',
		responseResolver({ json: veilederHarTilgangMockData })
	),
	http.get('/veilarboppfolging/api/oppfolging/me', responseResolver({ json: meMockData })),
	http.get('/veilarboppfolging/api/oppfolging/harFlereAktorIderMedOppfolging', responseResolver({ json: false })),
	http.get('/veilarboppfolging/api/oppfolging/mal', responseResolver({ json: malMockData })),
	http.post('veilarboppfolging/api/v3/veileder/lest-aktivitetsplan', responseResolver({ status: 204 })),

	http.get('/veilarbveileder/api/veileder/me', responseResolver({ json: veilederMeMockData })),
	http.get('/veilarbveileder/api/enhet/:enhetsNr/veiledere', responseResolver({ status: 204 })),

	http.get('/veilarbaktivitet/api/aktivitet', responseResolver({ json: aktiviteterMockdata })),
	http.post('/veilarbaktivitet/api/logger/event', responseResolver({ status: 204 })),
	http.get('/veilarbaktivitet/api/arena/tiltak', responseResolver({ json: [] })),

	http.post('/veilarbportefolje/api/v2/hent-arbeidsliste', responseResolver({ json: {} })),
	http.get('/veilarblest/api/aktivitetsplan/les', responseResolver({ json: lesMockData })),

	http.get(
		'/auth/info',
		responseResolver({
			json: {
				loggedIn: true,
				expirationTime: '2040-07-04T14:18:54.000Z',
				remainingSeconds: 60 * 70
			}
		})
	),
	http.get(
		'/oauth2/session',
		responseResolver({
			json: {
				loggedIn: true,
				expirationTime: '2040-07-04T14:18:54.000Z',
				remainingSeconds: 60 * 70
			}
		})
	)
];
