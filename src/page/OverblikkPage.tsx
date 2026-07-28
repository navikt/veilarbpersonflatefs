import React, { useEffect } from 'react';
import { utledOboCdnUrl } from '../util/url-utils';
import { useModiaContext } from '../store/modia-context-store';
import { importSubApp } from './importUtils';

const overblikkBaseUrl = utledOboCdnUrl('veilarbdetaljerfs/dist');

type Theme = 'light' | 'dark';

interface OverblikkPageProps {
	theme: Theme;
}

const OverblikkPage = ({ theme }: OverblikkPageProps) => {
	const { aktivBrukerFnr } = useModiaContext();

	useEffect(() => {
		importSubApp(overblikkBaseUrl);
	}, []);

	return React.createElement('veilarb-detaljer', {
		'data-fnr': aktivBrukerFnr,
		theme
	});
};

export default OverblikkPage;
