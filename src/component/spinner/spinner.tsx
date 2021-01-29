import React from 'react';
import NavFrontendSpinner from 'nav-frontend-spinner';
import './spinner.less';

interface SpinnerProps {
	type?: 'XXS'|  'XS' | 'S'|  'M' |  'L'|  'XL'|  'XXL' |  'XXXL';
	className?: string;
}

function Spinner(props: SpinnerProps) {
	return (
		<div className={props.className || 'veilarbpersonflatefs-spinner'}>
			<NavFrontendSpinner type={props.type || 'XL'} />
		</div>
	);
}

export default Spinner;
