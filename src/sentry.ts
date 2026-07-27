import { EnvType, getEnv } from './util/utils';
import { init } from '@nais/apm';

if (getEnv().type !== EnvType.local) {
	init({
		app: 'veilarbpersonflate',
		namespace: 'poao',
		environment: getEnv().type,
		ignoreErrors: [/^canceled$/]
	});
}
