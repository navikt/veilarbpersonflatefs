import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Feil } from './feilmeldinger';

interface INAVSPAScope {
    [name: string]: NAVSPAApp;
}
type NAVSPAApp = (element: HTMLElement, props: any) => void;

interface State {
    hasError: boolean;
}

export default class NAVSPA {
    public static eksporter<PROPS>(
        name: string,
        component: React.ComponentType<PROPS>
    ) {
        NAVSPA.scope[name] = (element: HTMLElement, props: PROPS) => {
            ReactDOM.render(React.createElement(component, props), element);
        };
    }

    public static importer<PROPS>(name: string): React.ComponentType<PROPS> {
        class NAVSPAImporter extends React.Component<PROPS, State> {
            // tslint:disable-line
            private el: HTMLElement;

            constructor(props: PROPS) {
                super(props);
                this.state = {
                    hasError: false,
                };
            }

            public componentDidCatch(error: Error) {
                this.setState({ hasError: true });
                (global as any).frontendlogger.error(error);
            }

            public componentDidMount() {
                try {
                    NAVSPA.scope[name](this.el, this.props);
                } catch (e) {
                    this.setState({ hasError: true });
                    (global as any).frontendlogger.error(e);
                }
            }

            public componentWillUnmount() {
                if (this.el) {
                    ReactDOM.unmountComponentAtNode(this.el);
                }
            }

            public render() {
                if (this.state.hasError) {
                    return <Feil appNavn={name} />;
                }
                return <div ref={this.saveRef} />;
            }

            private saveRef = (el: HTMLDivElement) => {
                this.el = el;
            };
        }

        return NAVSPAImporter;
    }

    // tslint:disable
    private static scope: INAVSPAScope = ((global as any)['NAVSPA'] =
        (global as any)['NAVSPA'] || {});

    // tslint:enable
}
