import { EnvType, getEnv } from '../../../util/utils';
import { useEffect } from 'react';

export const DELTAKERREGISTRERING_ENTRY = 'src/webComponentWrapper.tsx';

const deltakerRegistreringOrigin = () => {
	switch (getEnv().type) {
		case EnvType.prod:
			return 'https://amt-deltaker-flate.intern.nav.no';
		case EnvType.dev:
			return 'https://cdn.nav.no/amt/amt-deltaker-flate-veileder-dev/build';
		case EnvType.local:
			return 'http://localhost:4173';
		default:
			return '';
	}
};

const deltakerregistreringKometManifestUrl = `${deltakerRegistreringOrigin()}/asset-manifest.json`;

interface DeltakerRegistreringAssetManifest {
	'src/webComponentWrapper.tsx': {
		file: string;
	};
}

const fetchManifest = async (): Promise<DeltakerRegistreringAssetManifest> => {
	const response = await fetch(deltakerregistreringKometManifestUrl);

	if (!response.ok) {
		throw new Error('Failed to load DeltakerRegistrering');
	}

	return await response.json();
};

export function useLoadDeltakerRegistreringApp() {
	useEffect(() => {
		fetchManifest()
			.then(manifest => {
				const entry = manifest[DELTAKERREGISTRERING_ENTRY].file;
				return import(/* @vite-ignore */ `${deltakerRegistreringOrigin()}/${entry}`);
			})
			.catch(error => {
				throw new Error(`Failed to load DeltakerRegistrering: ${error}`);
			});
	}, []);
}
