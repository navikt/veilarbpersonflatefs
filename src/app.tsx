import * as React from 'react';
import Datalaster from './components/datalaster';
import { Features, lagFeatureToggleUrl, NY_LAYOUT_TOGGLE } from './utils/api';
import { enhetFraUrl, hentFodselsnummerFraURL } from './utils/url-utils';
import { fetchToJson } from './utils/rest-utils';
import SideInnhold from './components/side-innhold';
import SideInnholdNyLayout from './components/side-innhold-ny-layout';
import { Aktivitetsplan, MAO, Visittkort } from './components/spa';
import getWindow from './utils/window';
import { initialiserToppmeny } from './utils/dekorator-utils';
import { FeilmeldingManglerFnr, IngenTilgangTilBruker } from './components/feilmeldinger';
import EnhetContext from './context/context';
import PageSpinner from './components/page-spinner/page-spinner';

interface TilgangTilBrukerState {
    tilgang?: boolean;
}

const enhet = enhetFraUrl();

class App extends React.Component<{}, TilgangTilBrukerState> {

    constructor(props: {}) {
        super(props);
        this.state = { tilgang: undefined };
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

    render() {
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
        const aktivitetsplan = <Aktivitetsplan enhet={enhet} fnr={fnr} />;

        return (
            <>
                <EnhetContext />
                <Datalaster<Features> url={lagFeatureToggleUrl()} spinner={<PageSpinner/>}>
                    {(data: Features) =>
                         data[NY_LAYOUT_TOGGLE] ?
                            <SideInnholdNyLayout features={data} visittkort={visittkort} mao={mao} aktivitetsplan={aktivitetsplan}/>
                            :
                            <SideInnhold mao={mao} aktivitetsplan={aktivitetsplan}/>
                    }
                </Datalaster>
            </>
        );
    }

}

export default App;
