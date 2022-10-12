import React from 'react';
import { loginUrl } from '../../util/url-utils';
import Lenke from 'nav-frontend-lenker';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import './utlopt-sesjon-advarsel.less';

export const UtloptSesjonAdvarsel = () => {
	const LoginLenke = () => <Lenke href={loginUrl()}>Logg inn på nytt.</Lenke>;

	return (
		<div className="utloptSesjonAdvarselWrapper">
			<AlertStripeAdvarsel>
				Økten din er utløpt. <LoginLenke />
			</AlertStripeAdvarsel>
		</div>
	);
};
