interface Manifest {
	'index.html': { file: string };
}

interface WebComponentManifest {
	'src/webComponentWrapper.tsx': { file: string };
}

const importedApps: Record<string, boolean> = {};

export const importSubApp = (url: string) => {
	if (url in importedApps) return;
	importedApps[url] = true;
	return fetch(`${url}/asset-manifest.json`)
		.then(res => res.json())
		.then((manifest: Manifest) => {
			import(/* @vite-ignore */ `${url}/${manifest['index.html'].file}`);
		});
};

const importedWebComponents: Record<string, boolean> = {};

export const importWebComponent = (url: string) => {
	if (url in importedWebComponents) return;
	importedWebComponents[url] = true;
	return fetch(`${url}/asset-manifest.json`)
		.then(res => res.json())
		.then((manifest: WebComponentManifest) => {
			import(/* @vite-ignore */ `${url}/${manifest['src/webComponentWrapper.tsx'].file}`);
		});
};
