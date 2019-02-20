import * as React from 'react';
import EnhetContext from './context/context';
import NAVSPA from './utils/NAVSPA';
import { initialiserToppmeny } from './utils/dekorator-utils';
import { fetchToJson } from "./utils/rest-utils";
import { enhetFraUrl, hentFodselsnummerFraURL } from './utils/url-utils';
import getWindow from './utils/window';
import { FeilmeldingManglerFnr, IngenTilgangTilBruker } from './components/feilmeldinger';

interface AppProps {
    enhet?: string;
    fnr: string;
}

const MAO: React.ComponentType<AppProps> = NAVSPA.importer<AppProps>('veilarbmaofs');
const Aktivitetsplan: React.ComponentType<AppProps> = NAVSPA.importer<AppProps>('aktivitetsplan');

interface TilgangTilBrukerState {
    tilgang?: boolean;
}

class App extends React.Component<{}, TilgangTilBrukerState> {
    constructor(props: {}) {
        super(props);
        this.state = {
            tilgang: undefined
        }
    }

    public setHarTilgang(tilgang: boolean){
        this.setState({ tilgang })
    }

    public componentDidMount(){
        const fnr = hentFodselsnummerFraURL();
        fetchToJson(`/veilarbperson/api/person/${fnr}/tilgangTilBruker`)
            .then((value) => this.setHarTilgang(!!value))
            .catch(() => this.setHarTilgang(false));
    }


    public render() {
        const fnr = hentFodselsnummerFraURL();
        const erDecoratorenIkkeLastet = !getWindow().renderDecoratorHead;

        if (erDecoratorenIkkeLastet) {
            return <div>500 feil: Mangler decoratøren</div>;
        }

        initialiserToppmeny();

        if (!fnr) {
            return <FeilmeldingManglerFnr />;
        }

        if (this.state.tilgang === undefined) {
            return null;
        } else if (!this.state.tilgang) {
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
