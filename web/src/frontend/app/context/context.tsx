import * as React from 'react';
import { connect } from 'react-redux';
import EnhetContextListener, {
    EnhetConnectionState,
    EnhetContextEvent,
    EnhetContextEventNames
} from './context-listener';
import { IntlProvider, addLocaleData } from 'react-intl';
import * as nb from 'react-intl/locale-data/nb';
import ContextFeilmodal, { Tekst } from './context-feilmodal';
import { erDev } from '../utils/utils';
import { hentAktivBruker, hentAktivEnhet, oppdaterAktivBruker } from './context-api';
import { hentFodselsnummerFraURL, sendEventOmPersonFraURL, settPersonIURL } from '../eventhandtering';
import NyBrukerModal from './ny-bruker-modal';
import { initialiserToppmeny } from '../utils/dekorator-utils';
import { enhetFinnesIUrl, leggEnhetIUrl, miljoFraUrl } from '../utils/url-utils';
import { tekster } from './context-tekster';
import { fetchToJson } from '../utils/rest-utils';

import './context.less';

addLocaleData(nb);

interface EnhetContextState {
    brukerModalSynlig: boolean;
    feilmodalSynlig: boolean;
    tilkoblingState: EnhetConnectionState;
    lastBrukerPending: boolean;
    tekster: any;
    fnrContext: string;
    feilmeldingTekst: Tekst;
}

export default class EnhetContext extends React.Component<{}, EnhetContextState> {
    contextListener: EnhetContextListener;

    constructor(props) {
        super(props);
        this.state = {
            brukerModalSynlig: false,
            feilmodalSynlig: false,
            fnrContext: hentFodselsnummerFraURL(),
            lastBrukerPending: false,
            tilkoblingState: EnhetConnectionState.NOT_CONNECTED,
            tekster: {},
            feilmeldingTekst: tekster.wsfeilmelding
        };

        this.enhetContextHandler = this.enhetContextHandler.bind(this);
    }

    componentDidMount() {
        window.addEventListener('popstate', () => {
            this.oppdaterAktivBrukHvisEndret();
        });

        this.contextListener = new EnhetContextListener(this.websocketUri(), this.enhetContextHandler);

        const fnrFraUrl = hentFodselsnummerFraURL();
        if(fnrFraUrl != null) {
            this.oppdaterAktivBrukHvisEndret();
        } else {
            this.oppdaterSideMedNyAktivBruker();
        }

        if(!enhetFinnesIUrl()) {
            this.handleNyAktivEnhet();
        }

        fetchToJson('/veilarbaktivitetsplanfs/api/tekster')
            .then((tekstFields: any) => {
                this.setState({ tekster: tekstFields.nb });
            });
    }

    componentWillUnmount() {
        this.contextListener.close();
    }

    websocketUri() {
        const miljo = erDev() ? '-t4' : miljoFraUrl();
        return `wss://veilederflatehendelser${miljo}.adeo.no/modiaeventdistribution/websocket`;
    }

    handleFeilet(feilmelding: Tekst) {
        this.setState({
            lastBrukerPending: false,
            brukerModalSynlig: false,
            feilmodalSynlig: true,
            feilmeldingTekst: feilmelding
        });
    }

    oppdaterAktivBrukHvisEndret() {
        const fnrFraUrl = hentFodselsnummerFraURL();
        return hentAktivBruker()
            .then((nyBruker) => {
                this.setState({fnrContext: nyBruker});

                if (nyBruker !== fnrFraUrl) {
                    oppdaterAktivBruker(fnrFraUrl);
                }
            }).catch(() => this.handleFeilet(tekster.feilmodalTekst));
    }

    oppdaterSideMedNyAktivBruker() {
        hentAktivBruker()
            .then((bruker) => {
                const fnrFraUrl = hentFodselsnummerFraURL();
                this.setState({fnrContext: bruker});

                if (bruker !=  null && bruker !== fnrFraUrl) {
                    settPersonIURL(bruker);
                    sendEventOmPersonFraURL();
                }
            }).catch(() => this.handleFeilet(tekster.feilmodalTekst));
    }

    handleNyAktivBruker() {
        hentAktivBruker()
            .then((nyBruker) => {
                const fnrFraUrl = hentFodselsnummerFraURL();
                this.setState({fnrContext: nyBruker});

                if (fnrFraUrl == null) {
                    this.oppdaterSideMedNyAktivBruker();
                } else if (nyBruker !== fnrFraUrl) {
                    this.setState({
                        brukerModalSynlig: true
                    });
                }
            }).catch(() => this.handleFeilet(tekster.feilmodalTekst));
    }

    handleNyAktivEnhet() {
        hentAktivEnhet()
            .then((enhet) => {
                leggEnhetIUrl(enhet);
                initialiserToppmeny();
            }).catch(() => this.handleFeilet(tekster.feilmodalTekst));
    }

    enhetContextHandler(event: EnhetContextEvent) {
        switch (event.type) {
            case EnhetContextEventNames.CONNECTION_STATE_CHANGED:
                if(event.state === EnhetConnectionState.FAILED &&
                    this.state.tilkoblingState === EnhetConnectionState.NOT_CONNECTED) {
                    this.handleFeilet(tekster.wsfeilmelding);
                }
                this.setState({ tilkoblingState: event.state });
                break;
            case EnhetContextEventNames.NY_AKTIV_ENHET:
                this.handleNyAktivEnhet();
                break;
            case EnhetContextEventNames.NY_AKTIV_BRUKER:
                this.handleNyAktivBruker();
                break;
        }
    }

    handleLastNyBruker() {
        this.oppdaterSideMedNyAktivBruker();
        this.setState({ brukerModalSynlig: false });
    }

    handleFortsettSammeBruker() {
        this.setState({lastBrukerPending: true});
        this.oppdaterAktivBrukHvisEndret()
            .then(() => this.setState({
                brukerModalSynlig: false,
                lastBrukerPending: false
            }));
    }

    render() {
        return (
            <IntlProvider locale="nb" defaultLocale="nb" messages={this.state.tekster}>
                <div>
                    <NyBrukerModal
                        isOpen={this.state.brukerModalSynlig === true}
                        isPending={this.state.lastBrukerPending}
                        doLastNyBruker={() => this.handleLastNyBruker()}
                        doFortsettSammeBruker={() => this.handleFortsettSammeBruker()}
                        fodselsnummer={this.state.fnrContext}
                    />
                    <ContextFeilmodal
                        isOpen={this.state.feilmodalSynlig}
                        onClose={() => this.setState({ feilmodalSynlig: false })}
                        feilmeldingTekst={this.state.feilmeldingTekst}
                    />
                </div>
            </IntlProvider>
        );
    }
}
