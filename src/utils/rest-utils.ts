const MED_CREDENTIALS: RequestInit = {
	credentials: 'same-origin',
	headers: {
		'Content-Type': 'application/json'
	}
};

export function fetchToJson<Modell>(uri: string, config: RequestInit = {}): Promise<Modell> {
	return fetch(uri, { ...MED_CREDENTIALS, ...config }).then(response => response.json());
}

export function fetchText(uri: string, config: RequestInit = {}): Promise<string> {
	return fetch(uri, { ...MED_CREDENTIALS, ...config }).then(response => response.text());
}

export function postData(uri: string, config: RequestInit = {}): Promise<Response> {
	return fetch(uri, { ...MED_CREDENTIALS, ...config });
}
