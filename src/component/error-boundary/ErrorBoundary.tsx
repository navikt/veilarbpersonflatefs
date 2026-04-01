import { Component, ReactNode } from 'react';
import { Alert } from '@navikt/ds-react';

interface Props {
	children: ReactNode;
	fallback?: ReactNode;
}

interface State {
	hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
	state: State = { hasError: false };

	static getDerivedStateFromError(): State {
		return { hasError: true };
	}

	render() {
		if (this.state.hasError) {
			return (
				this.props.fallback ?? (
					<Alert variant="error" style={{ margin: '2rem auto', maxWidth: 600 }}>
						En uventet feil oppsto. Last siden på nytt.
					</Alert>
				)
			);
		}
		return this.props.children;
	}
}
