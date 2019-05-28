import * as React from 'react';
import Datalaster from './components/datalaster';
import { Features, lagFeatureToggleUrl, VIS_VEDTAKSSTOTTE } from './utils/featue-utils';
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
    aktivitetsplanKey: number;
    maoKey: number;
}

class App extends React.Component<{}, TilgangTilBrukerState> {
    constructor(props: {}) {
        super(props);
        this.state = {
            aktivitetsplanKey: 0,
            maoKey: 0,
            tilgang: undefined,
        };

        this.incrementKey = this.incrementKey.bind(this);
        this.incrementMaoKey = this.incrementMaoKey.bind(this);
    }

    public incrementKey() {
        this.setState({aktivitetsplanKey: this.state.aktivitetsplanKey + 1});
    }

    public incrementMaoKey() {
        this.setState({maoKey: this.state.maoKey + 1});
    }

    public componentWillMount() {
        this.startAktivitetsplanEventListening();
        this.startMaoEventListening();
    }

    public setHarTilgang(tilgang: boolean){
        this.setState({ tilgang })
    }

    public componentWillUnmount(){
        this.stopAktivitetsplanEventListening();
        this.stoppMaoEventListening();
    }

    startAktivitetsplanEventListening() {
        getWindow().addEventListener('rerenderAktivitetsplan', this.incrementKey);
    }

    startMaoEventListening() {
        getWindow().addEventListener('rerenderMao', this.incrementMaoKey);
    }

    stopAktivitetsplanEventListening() {
        getWindow().removeEventListener('rerenderAktivitetsplan', this.incrementKey);
    }

    stoppMaoEventListening() {
        getWindow().removeEventListener('rerenderMao', this.incrementMaoKey);
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
        const mao = <MAO enhet={enhet} fnr={fnr} key={this.state.maoKey}/>;
        const aktivitetsplan = <Aktivitetsplan key={this.state.aktivitetsplanKey} enhet={enhet} fnr={fnr} />;

        return (
            <>
                <EnhetContext />
                <Datalaster<Features> url={lagFeatureToggleUrl()} spinner={<PageSpinner/>}>
                    {(data: Features) => {
                        const vedtaksstotte = data[VIS_VEDTAKSSTOTTE] ?
                            <Vedtaksstotte enhet={enhet} fnr={fnr} /> : undefined;

                        return (
                            <SideInnhold
                                fnr={fnr}
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
