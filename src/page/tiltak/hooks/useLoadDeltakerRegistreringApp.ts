import { useSuspenseQuery } from '@tanstack/react-query';
import { Env, getEnv } from '../../../util/utils';

export const DELTAKERREGISTRERING_ENTRY = 'src/webComponentWrapper.tsx';

const deltakerRegistreringOrigin = () => {
	switch(getEnv()) {
		case Env.Dev: return 'https://amt-deltaker-flate.intern.dev.nav.no'
		case Env.Local: return 'http://localhost:4173'
		default: return ''
	}
};

const deltakerregistreringKometManifestUrl = `${deltakerRegistreringOrigin}/asset-manifest.json`;

interface DeltakerRegistreringAssetManifest {
	'src/webComponentWrapper.tsx': {
		file: string;
	};
}

export function useLoadDeltakerRegistreringApp() {
	return useSuspenseQuery<any>({
		queryKey: ['deltaker-registrering-asset-manifest'],
		queryFn: async () => {
			const response = await fetch(deltakerregistreringKometManifestUrl);

			if (!response.ok) {
				throw new Error('Failed to load DeltakerRegistrering');
			}

			const manifest: DeltakerRegistreringAssetManifest = await response.json();
			const entry = manifest[DELTAKERREGISTRERING_ENTRY].file;
			return import(/* @vite-ignore */ `${deltakerRegistreringOrigin}/${entry}`);
		}
	});
}
