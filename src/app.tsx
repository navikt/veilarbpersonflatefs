import * as React from 'react';
import EnhetContext from './context/context';
import { FeilmeldingManglerFnr, IngenTilgangTilBruker } from './feilmeldinger';
import NAVSPA from './NAVSPA';
import { initialiserToppmeny } from './utils/dekorator-utils';
import { harTilgangTilBruker } from "./utils/rest-utils";
import { enhetFraUrl, hentFodselsnummerFraURL } from './utils/url-utils';

interface AppProps {
    enhet?: string;
    fnr: string;
}

const MAO: React.ComponentType<AppProps> = NAVSPA.importer<AppProps>(
    'veilarbmaofs'
);
const Aktivitetsplan: React.ComponentType<AppProps> = NAVSPA.importer<AppProps>(
    'aktivitetsplan'
);

class App extends React.Component {
    public render() {
        const fnr = hentFodselsnummerFraURL();
        const erDecoratorenLastet = !(window as any).renderDecoratorHead;

        if (erDecoratorenLastet) {
            return <div>500 feil: Mangler decoratøren</div>;
        }

        initialiserToppmeny();

        if (!fnr) {
            return <FeilmeldingManglerFnr />;
        }

        if (!harTilgangTilBruker(fnr)) {
            return <IngenTilgangTilBruker />;
        }

        const appProps: AppProps = {
            enhet: enhetFraUrl(),
            fnr: hentFodselsnummerFraURL()!,
        };

        return (
            <div>
                <EnhetContext />
                <div className="hovedinnhold">
                    <MAO {...appProps} />
                </div>
                <div className="hovedinnhold">
                    <Aktivitetsplan {...appProps} />
                </div>
            </div>
        );
    }
}

export default App;
