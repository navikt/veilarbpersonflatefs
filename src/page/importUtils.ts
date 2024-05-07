interface Manifest {
	'index.html': { file: string };
}

export const importSubApp = (url: string) => {
	return fetch(`${url}/asset-manifest.json`)
		.then(res => res.json())
		.then((manifest: Manifest) => {
			import(/* @vite-ignore */ `${url}/${manifest['index.html'].file}`);
		});
};
