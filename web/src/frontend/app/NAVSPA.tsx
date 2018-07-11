import * as React from 'react';
import * as ReactDOM from 'react-dom';

interface INAVSPAScope {
    [name: string]: NAVSPAApp;
}
type NAVSPAApp = (element: HTMLElement, props: any) => void;

export default class NAVSPA {
    public static eksporter<PROPS>(name: string, component: React.ComponentType<PROPS>) {
        NAVSPA.scope[name] = (element: HTMLElement, props: PROPS) => {
            ReactDOM.render(React.createElement(component, props), element);
        };
    }

    public static importer<PROPS>(name: string): React.ComponentType<PROPS> {
        class NAVSPAImporter extends React.Component<PROPS> { // tslint:disable-line
            private el: HTMLElement;

            public componentDidMount() {
                NAVSPA.scope[name](this.el, this.props);
            }

            public componentWillUnmount() {
                ReactDOM.unmountComponentAtNode(this.el);
            }

            public render() {
                return <div ref={this.saveRef}/>
            }

            private saveRef = (el: HTMLDivElement) => {
                this.el = el;
            };
        }

        return NAVSPAImporter;
    }

    private static scope: INAVSPAScope = (global as any)['NAVSPA'] = (global as any)['NAVSPA'] || {}; // tslint:disable-line
}