import * as faroLib from '@grafana/faro-web-sdk';
import { TracingInstrumentation } from '@grafana/faro-web-tracing';
import { Env, getEnv } from './util/utils';

const { getWebInstrumentations, initializeFaro } = faroLib;

declare global {
	interface Window {
		faro: typeof faroLib;
	}
}
window.faro = faroLib;

const faroEnvUrls: Record<Env, string> = {
	[Env.Prod]: 'https://telemetry.nav.no/collect',
	[Env.Dev]: 'https://telemetry.ekstern.dev.nav.no/collect',
	[Env.Local]: '/collect'
};

const url = faroEnvUrls[getEnv()];

initializeFaro({
	url,
	app: {
		name: 'veilarbpersonflate',
		version: '1.0'
	},
	instrumentations: [...getWebInstrumentations(), new TracingInstrumentation()],
	isolate: true
});
