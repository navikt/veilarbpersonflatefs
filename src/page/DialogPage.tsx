import React, { useEffect } from 'react';
import { EnvType, getEnv } from '../util/utils';
import { useModiaContext } from '../store/modia-context-store';
import { importSubApp } from './importUtils';

const dabCdnUrl = 'https://cdn.nav.no/dab';

const dialogCdnUrl =
	getEnv().type === EnvType.prod
		? `${dabCdnUrl}/arbeidsrettet-dialog-prod-intern/build`
		: `${dabCdnUrl}/arbeidsrettet-dialog-dev-intern/build`;

type Theme = 'light' | 'dark';

interface DialogPageProps {
	theme: Theme;
}

const DialogPage = ({ theme }: DialogPageProps) => {
	const { aktivBrukerFnr } = useModiaContext();
	useEffect(() => {
		importSubApp(dialogCdnUrl);
	}, []);

	return React.createElement('dab-dialog', {
		['data-fnr']: aktivBrukerFnr,
		theme,
		['data-theme']: theme
	});
};

export default DialogPage;
