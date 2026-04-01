export interface ProxyTargetApp {
	name: string;
	namespace: string;
}

export interface ProxyBackend {
	fromPath: string;
	toApp: ProxyTargetApp;
}

// Mirrors JSON_CONFIG.proxies in .nais/poao-nais-dev.yaml.
const proxyBackends: ProxyBackend[] = [
	{ fromPath: '/tryggtekst', toApp: { name: 'tryggtekst-proxy', namespace: 'team-effekt' } },
	{ fromPath: '/veilarbperson', toApp: { name: 'veilarbperson', namespace: 'obo' } },
	{ fromPath: '/veilarboppfolging', toApp: { name: 'veilarboppfolging', namespace: 'poao' } },
	{ fromPath: '/veilarbdialog', toApp: { name: 'veilarbdialog', namespace: 'dab' } },
	{ fromPath: '/veilarbaktivitet', toApp: { name: 'veilarbaktivitet', namespace: 'dab' } },
	{ fromPath: '/veilarblest', toApp: { name: 'veilarblest', namespace: 'dab' } },
	{ fromPath: '/ao-oppfolgingskontor', toApp: { name: 'ao-oppfolgingskontor', namespace: 'dab' } },
	{ fromPath: '/veilarbportefolje', toApp: { name: 'veilarbportefolje', namespace: 'obo' } },
	{ fromPath: '/obo-unleash', toApp: { name: 'obo-unleash', namespace: 'obo' } },
	{ fromPath: '/modiacontextholder', toApp: { name: 'modiacontextholder', namespace: 'personoversikt' } },
	{ fromPath: '/veilarbveileder', toApp: { name: 'veilarbveileder', namespace: 'obo' } },
	{ fromPath: '/veilarbvedtaksstotte', toApp: { name: 'veilarbvedtaksstotte', namespace: 'obo' } },
	{ fromPath: '/mulighetsrommet-api', toApp: { name: 'mulighetsrommet-api', namespace: 'team-mulighetsrommet' } },
	{ fromPath: '/veilarboppgave', toApp: { name: 'veilarboppgave', namespace: 'obo' } },
	{ fromPath: '/please', toApp: { name: 'please', namespace: 'dab' } },
	{ fromPath: '/orkivar', toApp: { name: 'orkivar', namespace: 'dab' } },
	{ fromPath: '/veilarbfilter', toApp: { name: 'veilarbfilter', namespace: 'obo' } },
	{ fromPath: '/amt-deltaker-bff', toApp: { name: 'amt-deltaker-bff', namespace: 'amt' } },
	{ fromPath: '/veilarbarena', toApp: { name: 'veilarbarena', namespace: 'pto' } }
];

const sortedProxyBackends = [...proxyBackends].sort((a, b) => b.fromPath.length - a.fromPath.length);

const getPathname = (urlOrPath: string): string | null => {
	if (!urlOrPath) return null;
	if (urlOrPath.startsWith('/')) return urlOrPath;
	try {
		return new URL(urlOrPath).pathname;
	} catch {
		return null;
	}
};

export const resolveProxyBackendFromUrl = (urlOrPath?: string): ProxyBackend | undefined => {
	if (!urlOrPath) return undefined;
	const pathname = getPathname(urlOrPath);
	if (!pathname) return undefined;
	return sortedProxyBackends.find(proxy => pathname === proxy.fromPath || pathname.startsWith(proxy.fromPath + '/'));
};
