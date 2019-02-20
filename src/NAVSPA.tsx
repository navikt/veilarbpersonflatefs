import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Feil } from './feilmeldinger';
import getWindow from './utils/window';

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

            private el?: HTMLElement;

            constructor(props: PROPS) {
                super(props);
                this.state = {
                    hasError: false,
                };
            }

            public componentDidCatch(error: Error) {
                this.setState({ hasError: true });
                getWindow().frontendlogger.error(error);
            }

            public componentDidMount() {
                try {
                    if (this.el) {
                        NAVSPA.scope[name](this.el, this.props);
                    }
                } catch (e) {
                    this.setState({ hasError: true });
                    getWindow().frontendlogger.error(e);
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

    private static scope: INAVSPAScope = (getWindow().NAVSPA = getWindow().NAVSPA || {});

}
