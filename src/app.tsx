import * as React from 'react';
import Datalaster from './components/datalaster';
import { Features, lagFeatureToggleUrl, VIS_VEDTAKSSTOTTE } from './utils/api';
import { enhetFraUrl, hentFodselsnummerFraURL } from './utils/url-utils';
import { fetchToJson } from './utils/rest-utils';
import SideInnhold from './components/side-innhold';
import { Aktivitetsplan, MAO, Vedtaksstotte, Visittkort } from './components/spa';
import getWindow from './utils/window';
import { initialiserToppmeny } from './utils/dekorator-utils';
import { FeilmeldingManglerFnr, IngenTilgangTilBruker } from './components/feilmeldinger';
import EnhetContext from './context/context';
import PageSpinner from './components/page-spinner/page-spinner';

interface TilgangTilBrukerState {
    tilgang?: boolean;
    key: number;
}

class App extends React.Component<{}, TilgangTilBrukerState> {
    constructor(props: {}) {
        super(props);
        this.state = {
            key: 0,
            tilgang: undefined,
        };
        this.stopEventListening = this.stopEventListening.bind(this);
        this.startEventListening = this.startEventListening.bind(this);
    }

    componentWillMount(){
        this.startEventListening();
    }

    public setHarTilgang(tilgang: boolean){
        this.setState({ tilgang })
    }


    public componentWillUnmount(){
        this.stopEventListening();
    }


    startEventListening() {
        getWindow().addEventListener('rerenderAktivitetsplan', () => this.setState({key: this.state.key + 1}))
    }

    stopEventListening() {
        getWindow().removeEventListener('rerenderAktivitetsplan', () => this.setState({key: 0}))
    }



    public componentDidMount(){
        const fnr = hentFodselsnummerFraURL();
        fetchToJson(`/veilarbperson/api/person/${fnr}/tilgangTilBruker`)
            .then((value) => this.setHarTilgang(!!value))
            .catch(() => this.setHarTilgang(false));
    }

    render() {

        const enhet = enhetFraUrl();
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

        const visittkort = <Visittkort enhet={enhet} fnr={fnr} visVeilederVerktoy={true} tilbakeTilFlate="veilarbportefoljeflatefs"/>;
        const mao = <MAO enhet={enhet} fnr={fnr} />;
        const aktivitetsplan = <Aktivitetsplan key={this.state.key} enhet={enhet} fnr={fnr} />;

        return (
            <>
                <EnhetContext />
                <Datalaster<Features> url={lagFeatureToggleUrl()} spinner={<PageSpinner/>}>
                    {(data: Features) => {
                        const vedtaksstotte = data[VIS_VEDTAKSSTOTTE] ?
                            <Vedtaksstotte enhet={enhet} fnr={fnr} /> : undefined;

                        return (
                            <SideInnhold
                                features={data}
                                visittkort={visittkort}
                                mao={mao}
                                aktivitetsplan={aktivitetsplan}
                                vedtaksstotte={vedtaksstotte}
                            />
                        );
                    }}
                </Datalaster>
            </>
        );
    }

}

export default App;
