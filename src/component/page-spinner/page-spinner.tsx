import React from 'react';
import './page-spinner.less';
import { Loader } from '@navikt/ds-react';

const PageSpinner: React.FunctionComponent = () => {
	return (
		<div className="page-spinner">
			<Loader size="xlarge" />
		</div>
	);
};

export default PageSpinner;
