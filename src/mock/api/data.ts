import {
	ARBEIDSMARKEDSTILTAK_LANSERING,
	Features,
	FINN_STILLING_INNGANG_ENABLED,
	OboUnleashFeatures,
	VEILARBDETALJERFS_ENABLED
} from '../../api/features';
import { AktivEnhetResponse, AntallUlesteDialoger, SessionMeta, SistOppdatertData } from '../../api/api';

export const testBrukerFnr = '03818796950';

export const testEnhetId = '0123';

export const mockFeatures: Features = {
	[ARBEIDSMARKEDSTILTAK_LANSERING]: true,
	[FINN_STILLING_INNGANG_ENABLED]: true
};

export const mockOboUnleashFeatures: OboUnleashFeatures = {
	[VEILARBDETALJERFS_ENABLED]: true
};

export const mockMulighetsrommetUnleashFeatures: boolean = true;

export const mockAntallUleste: AntallUlesteDialoger = {
	antallUleste: 1
};

export const mockSistOppdatert: SistOppdatertData = {
	sistOppdatert: '2020-06-25T12:58:12.757+02:00'
};

export const mockAktivEnhet: AktivEnhetResponse = {
	aktivEnhet: testEnhetId
};

export const mockTilgangTilBruker = true;

type SessionDataMockConfig = {
	createdAt: string;
	tokensExpireTimestamp: number;
	sessionExpireTimestamp: number;
	tokensRefreshBufferPeriodMs: number;
	tokensRefreshedAt?: string;
};

export const sessionData = ({
	createdAt,
	tokensExpireTimestamp,
	sessionExpireTimestamp,
	tokensRefreshBufferPeriodMs,
	tokensRefreshedAt
}: SessionDataMockConfig): SessionMeta => {
	const nowTimestamp: number = Date.now();

	return {
		session: {
			created_at: createdAt,
			ends_at: new Date(sessionExpireTimestamp).toISOString(),
			ends_in_seconds:
				nowTimestamp >= sessionExpireTimestamp ? 0 : Math.floor((sessionExpireTimestamp - nowTimestamp) / 1000)
		},
		tokens: {
			refreshed_at: tokensRefreshedAt ? tokensRefreshedAt : createdAt,
			expire_at: new Date(Math.floor(tokensExpireTimestamp)).toISOString(),
			expire_in_seconds:
				nowTimestamp >= tokensExpireTimestamp ? 0 : Math.floor((tokensExpireTimestamp - nowTimestamp) / 1000),
			next_auto_refresh_in_seconds:
				nowTimestamp >= tokensExpireTimestamp - tokensRefreshBufferPeriodMs
					? 0
					: Math.floor((tokensExpireTimestamp - tokensRefreshBufferPeriodMs - nowTimestamp) / 1000),
			refresh_cooldown: false,
			refresh_cooldown_seconds: 0
		}
	};
};

export const defaultSessionDataMockConfig = (
	baseTimestamp: number,
	extendSessionWithSeconds?: number
): SessionDataMockConfig => {
	const timeLeftInSessionSeconds = extendSessionWithSeconds ? extendSessionWithSeconds : 10 * 60; // 10 minutes
	const timeLeftInTokensSeconds = timeLeftInSessionSeconds;
	const sessionLifetimeSeconds = 10 * 60 * 60;
	const tokensLifetimeSeconds = 60 * 60;

	return {
		createdAt: new Date(
			baseTimestamp + timeLeftInSessionSeconds * 1000 - sessionLifetimeSeconds * 1000
		).toISOString(),
		tokensExpireTimestamp: baseTimestamp + timeLeftInTokensSeconds * 1000,
		sessionExpireTimestamp: baseTimestamp + timeLeftInSessionSeconds * 1000,
		tokensRefreshBufferPeriodMs: 5 * 60 * 1000,
		tokensRefreshedAt: new Date(
			baseTimestamp + timeLeftInTokensSeconds * 1000 - tokensLifetimeSeconds * 1000
		).toISOString()
	};
};

export const oppfolgingMockData = {
	fnr: '28877798234',
	aktorId: '2618633343329',
	veilederId: null,
	reservasjonKRR: false,
	kanVarsles: true,
	manuell: false,
	underOppfolging: true,
	underKvp: false,
	oppfolgingUtgang: null,
	kanStarteOppfolging: false,
	avslutningStatus: null,
	oppfolgingsPerioder: [
		{
			uuid: '7e84ec71-e193-4d37-a62c-68178987b94e',
			aktorId: '2618633343329',
			veileder: null,
			startDato: '2022-12-28T12:50:53.258511+01:00',
			sluttDato: null,
			begrunnelse: null,
			kvpPerioder: []
		}
	],
	harSkriveTilgang: true,
	inaktivIArena: false,
	kanReaktiveres: null,
	inaktiveringsdato: null,
	erSykmeldtMedArbeidsgiver: false,
	servicegruppe: 'IVURD',
	formidlingsgruppe: 'ARBS',
	rettighetsgruppe: 'IYT',
	erIkkeArbeidssokerUtenOppfolging: false
};

export const oppfolgingsStatusMockData = {
	oppfolgingsenhet: { navn: 'NAV Alta-Kvænangen-Loppa', enhetId: testEnhetId },
	veilederId: null,
	formidlingsgruppe: 'ARBS',
	servicegruppe: 'IVURD',
	hovedmaalkode: 'SKAFFEA'
};

export const veilederHarTilgangMockData = { tilgangTilBrukersKontor: true };

export const meMockData = { id: 'Z994381', erVeileder: true, erBruker: false };

export const personV2mockData = {
	fornavn: 'LYKKELIG',
	mellomnavn: null,
	etternavn: 'FOXTROT',
	forkortetNavn: null,
	fodselsnummer: testBrukerFnr,
	fodselsdato: '1977-07-28',
	kjonn: 'KVINNE',
	dodsdato: null,
	diskresjonskode: null,
	egenAnsatt: false,
	kontonummer: null,
	geografiskTilknytning: '5432',
	geografiskEnhet: { enhetsnummer: '2012', navn: 'NAV Alta-Kvænangen-Loppa' },
	telefon: [{ prioritet: '1', telefonNr: '12121212', registrertDato: '19.12.2022', master: 'KRR' }],
	epost: { epostAdresse: 'sig@sig.no', epostSistOppdatert: '19.12.2022', master: 'KRR' },
	statsborgerskapKoder: ['NOR'],
	statsborgerskap: ['NORGE'],
	sikkerhetstiltak: null,
	barn: [],
	sivilstandliste: [
		{
			sivilstand: 'UGIFT',
			fraDato: '1977-07-28',
			skjermet: null,
			gradering: null,
			relasjonsBosted: null,
			master: 'FREG',
			registrertDato: '2022-03-02T14:29:38'
		}
	],
	bostedsadresse: {
		gyldigFraOgMed: '2022-03-02T00:00:00',
		gyldigTilOgMed: null,
		coAdressenavn: null,
		metadata: { master: 'FREG', endringer: null },
		vegadresse: {
			matrikkelId: 275432908,
			postnummer: '9585',
			husnummer: '52',
			husbokstav: null,
			adressenavn: 'Øraveien',
			tilleggsnavn: null,
			poststed: 'SANDLAND',
			kommunenummer: '5432',
			kommune: 'Loppa'
		},
		matrikkeladresse: null,
		utenlandskAdresse: null,
		ukjentBosted: null
	},
	oppholdsadresse: null,
	kontaktadresser: [],
	malform: null
};

export const aktiviteterMockdata = {
	aktiviteter: [
		{
			id: '941945',
			funksjonellId: null,
			versjon: '2342703',
			tittel: 'Oppdater CV-en og jobbønsker',
			beskrivelse:
				'Når du registrerer CV-en din og jobbønskene dine, kan NAV følge deg opp på en bedre måte. CV-en gir oss nyttig informasjon om din kompetanse og dine jobbønsker. Etter avtale med deg, videreformidler NAV relevant informasjon til aktuelle arbeidsgivere og bemanningsbransjen for å hjelpe deg ut i jobb.',
			lenke: 'https://arbeidsplassen-q1.nav.no/cv',
			type: 'EGEN',
			status: 'GJENNOMFORES',
			fraDato: '2022-12-28T11:51:58.222+00:00',
			tilDato: '2023-01-05T11:51:58.222+00:00',
			opprettetDato: '2022-12-28T11:51:58.281+00:00',
			endretDato: '2022-12-28T11:51:58.281+00:00',
			endretAv: '0307d96e-76e8-4808-8aa4-78258b1fe5e7',
			historisk: false,
			avsluttetKommentar: null,
			avtalt: false,
			forhaandsorientering: null,
			lagtInnAv: 'NAV',
			transaksjonsType: 'OPPRETTET',
			malid: null,
			oppfolgingsperiodeId: '7e84ec71-e193-4d37-a62c-68178987b94e',
			etikett: null,
			kontaktperson: null,
			arbeidsgiver: null,
			arbeidssted: null,
			stillingsTittel: null,
			hensikt: 'Tydeliggjøre arbeidserfaring og jobbønsker slik at NAV kan bidra til å hjelpe deg ut i jobb',
			oppfolging: null,
			antallStillingerSokes: null,
			antallStillingerIUken: null,
			avtaleOppfolging: null,
			jobbStatus: null,
			ansettelsesforhold: null,
			arbeidstid: null,
			behandlingType: null,
			behandlingSted: null,
			effekt: null,
			behandlingOppfolging: null,
			adresse: null,
			forberedelser: null,
			kanal: null,
			referat: null,
			erReferatPublisert: false,
			stillingFraNavData: null,
			eksternAktivitet: null
		}
	]
};

export const lesMockData = [{ tidspunkt: '2022-12-30T13:55:47.742843', ressurs: 'aktivitetsplan', verdi: null }];

export const harniva4MockData = {
	harbruktnivaa4: true,
	erRegistrertIdPorten: true,
	personidentifikator: testBrukerFnr
};

export const veilederMeMockData = {
	ident: 'Z994381',
	navn: 'E_994381, F_994381',
	fornavn: 'F_994381',
	etternavn: 'E_994381'
};

export const aktivBrukerMock = { aktivBruker: testBrukerFnr, aktivEnhet: null };

export const mockAktorFnrMappingMockData = { fnr: '28877798234', aktorId: '2618633343329' };

export const contextMock = {
	ident: 'Z994381',
	navn: 'F_Z994381 E_Z994381',
	fornavn: 'F_Z994381',
	etternavn: 'E_Z994381',
	enheter: [
		{ enhetId: '0219', navn: 'NAV Bærum' },
		{ enhetId: '0501', navn: 'NAV Lillehammer-Gausdal' },
		{ enhetId: testEnhetId, navn: 'NAV Dalane' }
	]
};

export const malMockData = { mal: null, endretAv: 'VEILEDER', dato: null };
export default sessionData;
