import { useModiaContext } from '../store/modia-context-store';
import { erITestMiljo } from '../util/url-utils';
import React, { useEffect } from 'react';
import { importSubApp } from './importUtils';

function utledOppfolgingsvedtakCdnUrl(contextPath: string): string {
	const base = 'https://cdn.nav.no/obo';
	return erITestMiljo() ? `${base}/dev/${contextPath}` : `${base}/prod/${contextPath}`;
}

const oppfolgingsvedtakBaseUrl = utledOppfolgingsvedtakCdnUrl('oppfolgingsvedtak-modia/build');

const OppfolgingsvedtakPage = () => {
	const { aktivBrukerFnr, aktivEnhetId } = useModiaContext();

	useEffect(() => {
		importSubApp(oppfolgingsvedtakBaseUrl);
	}, []);

	return React.createElement('veilarbvedtaksstottefs-root', {
		'data-fnr': aktivBrukerFnr,
		'data-enhet': aktivEnhetId ?? undefined
	});
};

export default OppfolgingsvedtakPage;
