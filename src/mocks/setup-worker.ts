import { setupWorker } from 'msw';
import { handlers } from './handlers';

setupWorker(...handlers)
	.start({ serviceWorker: { url: process.env.PUBLIC_URL + '/mockServiceWorker.js' } })
	.then(() => {
		// tslint:disable-next-line:no-console
		console.log('Running with mocked API endpoints');
	})
	.catch((e) => {
		// tslint:disable-next-line:no-console
		console.error('Unable to setup mocked API endpoints', e)
	});