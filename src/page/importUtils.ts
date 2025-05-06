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
				reject(error);
			});
	});

	appCache.set(url, importPromise);

	return importPromise;
}
