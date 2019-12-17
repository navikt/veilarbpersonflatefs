import * as React from 'react';
import * as ReactDOM from 'react-dom';

interface NAVSPAScope {
	[name: string]: NAVSPAApp;
}
type NAVSPAApp = (element: HTMLElement, props: any) => void;
interface Frontendlogger { error(e: Error): void; }
interface State { hasError: boolean; }

export default class NAVSPA {
	public static eksporter<PROPS>(name: string, component: React.ComponentType<PROPS>) {
		NAVSPA.scope[name] = (element: HTMLElement, props: PROPS) => {
			ReactDOM.render(React.createElement(component, props), element);
		};
	}

	public static importer<PROPS>(name: string): React.ComponentType<PROPS> {
		// tslint:disable-next-line:max-classes-per-file
		class NAVSPAImporter extends React.Component<PROPS, State> {

			private el?: HTMLElement;

			constructor(props: PROPS) {
				super(props);
				this.state = {
					hasError: false,
				};
			}

			public componentDidCatch(error: Error) {
				this.setState({ hasError: true });
				NAVSPA.logger.error(error);
			}

			public componentDidMount() {
				this.renderImportedComponent();
			}

			public componentDidUpdate(): void {
				if (!this.state.hasError) {
					this.renderImportedComponent();
				}
			}

			public componentWillUnmount() {
				if (this.el) {
					ReactDOM.unmountComponentAtNode(this.el);
				}
			}

			public render() {
				if (this.state.hasError) {
					return <div className="navspa--applikasjonsfeil">Feil i {name}</div>;
				}
				return <div className="veilarbpersonflatefs__spa-app" ref={this.saveRef} />;
			}

			private saveRef = (el: HTMLDivElement) => {
				this.el = el;
			};

			private renderImportedComponent() {
				try {
					if (this.el) {
						NAVSPA.scope[name](this.el, this.props);
					}
				} catch (e) {
					this.setState({ hasError: true });
					NAVSPA.logger.error(e);
				}
			}
		}

		return NAVSPAImporter;
	}

	private static scope: NAVSPAScope = (window as any)['NAVSPA'] = (window as any)['NAVSPA'] || {}; // tslint:disable-line
	private static logger: Frontendlogger = (window as any).frontendlogger = (window as any).frontendlogger || { error() {} }; // tslint:disable-line
}
