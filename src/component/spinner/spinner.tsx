import './spinner.less';
import { Loader } from '@navikt/ds-react';

interface SpinnerProps {
	type?: 'large';
	className?: string;
}

function Spinner(props: SpinnerProps) {
	return (
		<div className={props.className || 'veilarbpersonflatefs-spinner'}>
			<Loader size={props.type || 'xlarge'} />
		</div>
	);
}

export default Spinner;
