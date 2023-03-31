import { loginUrl } from '../../util/url-utils';
import { Alert, Link } from '@navikt/ds-react';
import './utlopt-sesjon-advarsel.less';

export const UtloptSesjonAdvarsel = () => {
	const LoginLenke = () => <Link href={loginUrl()}>Logg inn på nytt.</Link>;

	return (
		<div className="utloptSesjonAdvarselWrapper">
			<Alert variant="warning">
				Økten din er utløpt. <LoginLenke />
			</Alert>
		</div>
	);
};
