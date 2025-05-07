import { useEffect, useState } from 'react';

export interface Manifest {
	'index.html': { file: string };
}

const appCache = new Map<string, Promise<Manifest>>();

export function importSubApp(url: string): Promise<Manifest> {
	const cachedPromise = appCache.get(url);
	if (cachedPromise) {
		return cachedPromise;
	}

	const importPromise = new Promise<Manifest>((resolve, reject) => {
		fetch(`${url}/asset-manifest.json`)
			.then(res => res.json())
			.then((manifest: Manifest) => {
				return import(/* @vite-ignore */ `${url}/${manifest['index.html'].file}`).then(() => {
					resolve(manifest);
				});
			})
			.catch(error => {
				appCache.delete(url);
				reject(toError(error));
			});
	});

	appCache.set(url, importPromise);

	return importPromise;
}

export function useSubApp(url: string) {
	const [manifest, setManifest] = useState<Manifest | null>(null);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		importSubApp(url)
			.then(manifestData => {
				setManifest(manifestData);
				setError(null);
			})
			.catch(error => {
				setError(toError(error));
				setManifest(null);
			});
	}, [url]);

	return { manifest, error };
}

function toError(error: unknown): Error {
	return error instanceof Error ? error : new Error(String(error));
}
