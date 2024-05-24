import React, { useEffect } from 'react';
import { useModiaContext } from '../store/modia-context-store';
import { EnvType, getEnv } from '../util/utils';
import { importSubApp } from './importUtils';

const dabCdnUrl = 'https://cdn.nav.no/dab';

const aktivitetsplanCdnUrl =
	getEnv().type === EnvType.prod
		? `${dabCdnUrl}/aktivitetsplan-prod-intern/build`
		: `${dabCdnUrl}/aktivitetsplan-dev-intern/build`;

const AktivitetsplanPage = () => {
	const { aktivBrukerFnr, aktivEnhetId } = useModiaContext();
	useEffect(() => {
		importSubApp(aktivitetsplanCdnUrl);
	}, []);

	return React.createElement('dab-aktivitetsplan', {
		['data-fnr']: aktivBrukerFnr,
		['data-aktivEnhet']: aktivEnhetId
	});
};

export default AktivitetsplanPage;
