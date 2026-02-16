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
import {graphqlMock} from "../graphqlMock";

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
		return HttpResponse.json(json, { status: status ?? HTTP_OK });
	};
};

export const handlers = [
	http.get('/oauth2/session', responseResolver({ json: sessionData })),
	http.get(
		'/mulighetsrommet-api/api/v1/internal/features',
		responseResolver({ json: mockMulighetsrommetUnleashFeatures })
	),
	http.get('/obo-unleash/api/feature', responseResolver({ json: {} })),
	http.post('/veilarbdialog/api/dialog/antallUleste', responseResolver({ json: mockAntallUleste })),
	http.post('/veilarbdialog/api/dialog/sistOppdatert', responseResolver({ json: mockSistOppdatert })),
	http.get('/modiacontextholder/api/context/aktivenhet', responseResolver({ json: mockAktivEnhet })),
	http.get('/modiacontextholder/api/context/v2/aktivenhet', responseResolver({ json: mockAktivEnhet })),
	http.post('/modiacontextholder/api/context', responseResolver({ json: mockAktivEnhet })),
	http.get('/veilarbperson/api/v3/person/hent-tilgangTilBruker', responseResolver({ json: mockTilgangTilBruker })),
	http.post('/veilarboppfolging/api/v3/manuell/synkroniser-med-dkif', responseResolver({ status: 204 })),

	http.get('/veilarbdialog/api/eskaleringsvarsel/gjeldende', responseResolver({ status: 204 })),
	http.get('/veilarbdialog/api/dialog', responseResolver({ json: [] })),
	http.post(
		'/veilarbdialog/graphql',
		responseResolver({
			json: {
				data: {
					dialoger: [],
					stansVarsel: {
						id: 311044,
						tilhorendeDialogId: 618904,
						opprettetAv: 'Z994188',
						opprettetDato: '2024-08-16T09:51:55.743718+02:00',
						opprettetBegrunnelse:
							'Les denne meldingen nøye og gi beskjed til veilederen din hvis det er noe du lurer på. Det gjør du ved å svare på denne meldingen.\n\nVi kan stanse arbeidsavklaringspengene dine dersom du ikke deltar på de planlagte aktivitetene og bidrar for å komme i arbeid.\n\nDette går fram av folketrygdloven §§ 11-7 og 11-8.\n\n[Fyll inn begrunnelse for varslet]\n\nVi sender deg dette varselet for at du skal ha mulighet til å uttale deg før vi avgjør saken din. Du må uttale deg innen [fristDato]. Du kan uttale deg skriftlig her eller du kan ringe oss på 55 55 33 33 og uttale deg muntlig.\n\nDersom arbeidsavklaringspengene dine blir stanset, kan du sende inn en ny søknad. Du kan tidligst gjenoppta arbeidsavklaringspengene dine fra den dagen du søker. Søknadsskjema finner du på nav.no.\n'
					}
				}
			}
		})
	),
	http.post('/veilarbdialog/api/logger/event', responseResolver({ status: 204 })),

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
	http.post('/veilarboppfolging/api/v3/oppfolging/hent-status', responseResolver({ json: oppfolgingMockData })),
	http.post(
		'/veilarboppfolging/api/v2/person/hent-oppfolgingsstatus',
		responseResolver({ json: oppfolgingsStatusMockData })
	),
	http.get(
		'/veilarboppfolging/api/oppfolging/veilederTilgang',
		responseResolver({ json: veilederHarTilgangMockData })
	),
	http.get('/veilarboppfolging/api/oppfolging/me', responseResolver({ json: meMockData })),
	http.post('/veilarboppfolging/api/v3/hent-maal', responseResolver({ json: malMockData })),
	http.get('/veilarboppfolging/api/oppfolging/harFlereAktorIderMedOppfolging', responseResolver({ json: false })),
	http.post('/veilarboppfolging/api/v3/veileder/lest-aktivitetsplan', responseResolver({ status: 204 })),
	http.get('/veilarboppfolging/api/v3/oppfolging/me', responseResolver({ json: meMockData })),
	http.post('/veilarboppfolging/api/v3/oppfolging/harFlereAktorIderMedOppfolging', responseResolver({ status: 204 })),
	http.post('/veilarboppfolging/api/graphql', () => {
		return graphqlMock('IKKE_TILGANG_ENHET', true)
	}),
	http.post(
		'/veilarboppfolging/api/v3/oppfolging/hent-veilederTilgang',
		responseResolver({ json: { tilgangTilBrukersKontor: true } })
	),

	http.get('/veilarbveileder/api/veileder/me', responseResolver({ json: veilederMeMockData })),
	http.get('/veilarbveileder/api/enhet/:enhetsNr/veiledere', responseResolver({ status: 204 })),

	http.post('/veilarbaktivitet/graphql', responseResolver({ json: aktiviteterMockdata })),
	http.get('/veilarbaktivitet/api/feature', responseResolver({ json: {} })),
	http.post('/veilarbaktivitet/api/logger/event', responseResolver({ status: 204 })),
	http.post('/veilarbaktivitet/api/arena/tiltak', responseResolver({ json: [] })),
	http.post('/veilarbaktivitet/api/innsynsrett', responseResolver({ json: {} })),

	http.post('/veilarbportefolje/api/v2/hent-arbeidsliste', responseResolver({ json: {} })),
	http.post('/veilarbportefolje/api/v1/hent-er-bruker-ufordelt', responseResolver({ json: true })),
	http.post('/veilarblest/api/aktivitetsplan/les', responseResolver({ json: lesMockData })),

	http.post('/veilarbperson/api/v3/person/hent-fullmakt', responseResolver({ json: lesMockData })),
	http.post('/veilarbvedtaksstotte/api/hent-gjeldende-14a-vedtak', responseResolver({ json: {} })),
	http.post(
		'/veilarbperson/api/v3/person/hent-siste-opplysninger-om-arbeidssoeker-med-profilering',
		responseResolver({ json: {} })
	),

	http.post('https://umami.nav.no/api/send', responseResolver({ json: {} })),

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
