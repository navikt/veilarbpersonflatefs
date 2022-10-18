import {
	ARBEIDSMARKEDSTILTAK_LANSERING,
	Features,
	SPOR_OM_TILBAKEMELDING,
	TOUR_MODAL_LAST_NED_CV_TOGGLE,
	TOUR_MODAL_VEDTAKSSTOTTE_LANSERING_TOGGLE
} from '../../api/features';
import { AktivEnhetResponse, SistOppdatertData, AntallUlesteDialoger, SessionMeta } from '../../api/api';

export const testBrukerFnr = '00123456789';

export const testEnhetId = '0123';

export const mockFeatures: Features = {
	[TOUR_MODAL_VEDTAKSSTOTTE_LANSERING_TOGGLE]: true,
	[TOUR_MODAL_LAST_NED_CV_TOGGLE]: false,
	[SPOR_OM_TILBAKEMELDING]: true,
	[ARBEIDSMARKEDSTILTAK_LANSERING]: true
};

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

export default sessionData;
