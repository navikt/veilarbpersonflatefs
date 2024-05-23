import { EnvType, erMock, getEnv } from './utils';

const DEV_DOMAINS = ['dev', 'localhost'];

export const erITestMiljo = (): boolean => {
	return window.location.hostname.split('.').findIndex(domain => DEV_DOMAINS.includes(domain)) >= 0;
};

// feks <appname>.ansatt.dev.nav.no eller <appname>.intern.dev.nav.no
const rootDomain = (): string => {
	const hostnameParts = window.location.hostname.split('.');
	return hostnameParts.slice(-(hostnameParts.length - 1)).join('.');
};

export const utledSpaUrl = (appName: string): string => {
	return `${window.location.protocol}//${appName}.${rootDomain()}`;
};

export const utledTilbakeUrl = () => {
	// feks https://veilarbportefoljeflate.intern.dev.nav.no vs https://veilarbportefoljeflate.ansatt.dev.nav.no
	return `${window.location.protocol}//veilarbportefoljeflate.${rootDomain()}`;
};

export const utledCDNSpaUrl = (teamName: string, appName: string) => {
	const miljo = getEnv().type === EnvType.prod ? 'prod' : 'dev';
	return `https://cdn.nav.no/${teamName}/${appName}-${miljo}/build`;
};

export const loginUrl = () => {
	if (erMock()) {
		return `${window.location.href}`;
	}
	return `${window.location.origin}/oauth2/login?redirect=${window.location.href}`;
};
