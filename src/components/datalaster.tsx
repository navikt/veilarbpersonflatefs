import React from 'react';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import { fetchToJson } from '../utils/rest-utils';

interface DatalasterProps<D> {
	url: string;
	spinner?: React.ReactElement;
	children: (data: D) => React.ReactElement;
}

interface DatalasterState<D> {
	data?: D;
	harFeilet?: boolean;
}

class Datalaster<D> extends React.Component<DatalasterProps<D>, DatalasterState<D>> {
	constructor(props: DatalasterProps<D>) {
		super(props);

		this.state = {
			harFeilet: false
		};

		fetchToJson<D>(props.url)
			.then(this.handleDataLastet)
			.catch(this.handleDatalastFeilet);
	}

	handleDataLastet = (data: D) => {
		this.setState({ data });
	};

	handleDatalastFeilet = () => {
		this.setState({ harFeilet: true });
	};

	render() {
		const { data, harFeilet } = this.state;
		const { children, spinner } = this.props;

		if (harFeilet) {
			return <AlertStripeAdvarsel>Kunne ikke laste data, prøv på nytt ...</AlertStripeAdvarsel>;
		} else if (data == null) {
			return spinner ? spinner : <NavFrontendSpinner type="XL" />;
		}

		return children(data);
	}
}

export default Datalaster;
