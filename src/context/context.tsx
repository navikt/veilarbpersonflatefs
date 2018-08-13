import { AlertStripeAdvarselSolid } from 'nav-frontend-alertstriper';
import * as React from 'react';
import { addLocaleData, FormattedMessage, IntlProvider } from 'react-intl';
import * as nb from 'react-intl/locale-data/nb';
import { hentFodselsnummerFraURL, sendEventOmPersonFraURL, settPersonIURL } from '../eventhandtering';
import { initialiserToppmeny } from '../utils/dekorator-utils';
import { enhetFinnesIUrl, leggEnhetIUrl, miljoFraUrl } from '../utils/url-utils';
import { erDev } from '../utils/utils';
import { hentAktivBruker, hentAktivEnhet, hentIdent, oppdaterAktivBruker } from './context-api';
import ContextFeilmodal from './context-feilmodal';
import EnhetContextListener, {
    EnhetConnectionState,
    EnhetContextEvent,
    EnhetContextEventNames
} from './context-listener';
import { tekster } from './context-tekster';
import NyBrukerModal from './ny-bruker-modal';

import './context.less';

addLocaleData(nb);

interface EnhetContextState {
    brukerModalSynlig: boolean;
    feilmodalSynlig: boolean;
    tilkoblingState: EnhetConnectionState;
    lastBrukerPending: boolean;
    tekster: any;
    fnrContext?: string;
}

export default class EnhetContext extends React.Component<{}, EnhetContextState> {
    public contextListenerPromise: Promise<EnhetContextListener>;

    constructor(props: {}) {
        super(props);
        this.state = {
            brukerModalSynlig: false,
            feilmodalSynlig: false,
            fnrContext: hentFodselsnummerFraURL(),
            lastBrukerPending: false,
            tekster: {},
            tilkoblingState: EnhetConnectionState.NOT_CONNECTED
        };

        this.enhetContextHandler = this.enhetContextHandler.bind(this);
    }

    public componentDidMount() {
        window.addEventListener('popstate', () => {
            this.oppdaterAktivBrukHvisEndret();
        });

        this.contextListenerPromise = hentIdent()
            .then((ident) => {
                 return new EnhetContextListener(this.websocketUri(ident), this.enhetContextHandler);
            });

        const fnrFraUrl = hentFodselsnummerFraURL();
        if(fnrFraUrl != null) {
            this.oppdaterAktivBrukHvisEndret();
        } else {
            this.oppdaterSideMedNyAktivBruker();
        }

        if(!enhetFinnesIUrl()) {
            this.handleNyAktivEnhet();
        }
    }

    public componentWillUnmount() {
        this.contextListenerPromise.then((contextListener) => contextListener.close());
    }

    public websocketUri(ident: string) {
        const miljo = erDev() ? '-t6' : miljoFraUrl();
        return `wss://veilederflatehendelser${miljo}.adeo.no/modiaeventdistribution/ws/${ident}`;
    }

    public handleFeilet() {
        this.setState({
            brukerModalSynlig: false,
            feilmodalSynlig: true,
            lastBrukerPending: false
        });
    }

    public oppdaterAktivBrukHvisEndret() {
        const fnrFraUrl = hentFodselsnummerFraURL();
        return hentAktivBruker()
            .then((nyBruker) => {
                this.setState({fnrContext: nyBruker});

                if (nyBruker !== fnrFraUrl) {
                    oppdaterAktivBruker(nyBruker);
                }
            }).catch(() => this.handleFeilet());
    }

    public oppdaterSideMedNyAktivBruker() {
        hentAktivBruker()
            .then((bruker) => {
                const fnrFraUrl = hentFodselsnummerFraURL();
                this.setState({fnrContext: bruker});

                if (bruker !=  null && bruker !== fnrFraUrl) {
                    settPersonIURL(bruker);
                    sendEventOmPersonFraURL();
                }
            }).catch(() => this.handleFeilet());
    }

    public handleNyAktivBruker() {
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
            }).catch(() => this.handleFeilet());
    }

    public handleNyAktivEnhet() {
        hentAktivEnhet()
            .then((enhet) => {
                leggEnhetIUrl(enhet);
                initialiserToppmeny();
            }).catch(() => this.handleFeilet());
    }

    public enhetContextHandler(event: EnhetContextEvent) {
        switch (event.type) {
            case EnhetContextEventNames.CONNECTION_STATE_CHANGED:
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

    public handleLastNyBruker() {
        this.oppdaterSideMedNyAktivBruker();
        this.setState({ brukerModalSynlig: false });
    }

    public handleFortsettSammeBruker() {
        this.setState({lastBrukerPending: true});
        this.oppdaterAktivBrukHvisEndret()
            .then(() => this.setState({
                brukerModalSynlig: false,
                lastBrukerPending: false
            }));
    }

    public render() {
        const alertIkkeTilkoblet = (
            <AlertStripeAdvarselSolid>
                <FormattedMessage {...tekster.wsfeilmelding} />
            </AlertStripeAdvarselSolid>
        );

        return (
            <IntlProvider locale="nb" defaultLocale="nb">
                <div>
                    { this.state.tilkoblingState === EnhetConnectionState.FAILED ? alertIkkeTilkoblet : null }

                    <NyBrukerModal
                        isOpen={this.state.brukerModalSynlig}
                        isPending={this.state.lastBrukerPending}
                        doLastNyBruker={this.handleLastNyBruker}
                        doFortsettSammeBruker={this.handleFortsettSammeBruker}
                        fodselsnummer={this.state.fnrContext!}
                    />

                    <ContextFeilmodal
                        isOpen={this.state.feilmodalSynlig}
                        onClose={this.lukkFeilmodal}
                    />
                </div>
            </IntlProvider>
        );
    }

    private lukkFeilmodal() {
        this.setState({feilmodalSynlig: false});
    }
}
