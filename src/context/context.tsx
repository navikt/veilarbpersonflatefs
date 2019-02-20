import { AlertStripeAdvarselSolid } from 'nav-frontend-alertstriper';
import * as React from 'react';
import { addLocaleData, FormattedMessage, IntlProvider } from 'react-intl';
import * as nb from 'react-intl/locale-data/nb';
import { initialiserToppmeny } from '../utils/dekorator-utils';
import {
    enhetFinnesIUrl,
    leggEnhetIUrl,
    miljoFraUrl,
} from '../utils/url-utils';
import { hentFodselsnummerFraURL, settPersonIURL } from '../utils/url-utils';
import { erDev } from '../utils/utils';
import {
    hentAktivBruker,
    hentAktivEnhet,
    hentIdent,
    oppdaterAktivBruker,
} from './context-api';
import ContextFeilmodal from './context-feilmodal';
import EnhetContextListener, {
    EnhetConnectionState,
    EnhetContextEvent,
    EnhetContextEventNames,
} from './context-listener';
import { tekster } from './context-tekster';
import NyBrukerModal from './ny-bruker-modal';

import './context.less';

addLocaleData(nb);

interface EnhetContextState {
    brukerModalSynlig: boolean;
    feilmodalSynlig: boolean;
    tilkoblingState: EnhetConnectionState;
    tilkoblingHarFeilet: boolean;
    lastBrukerPending: boolean;
    tekster: any;
    fnrContext?: string;
}

export default class EnhetContext extends React.Component<{}, EnhetContextState> {
    public contextListenerPromise?: Promise<EnhetContextListener>;

    constructor(props: {}) {
        super(props);
        this.state = {
            brukerModalSynlig: false,
            feilmodalSynlig: false,
            fnrContext: hentFodselsnummerFraURL(),
            lastBrukerPending: false,
            tekster: {},
            tilkoblingHarFeilet: false,
            tilkoblingState: EnhetConnectionState.NOT_CONNECTED,
        };

        this.enhetContextHandler = this.enhetContextHandler.bind(this);
        this.lukkFeilmodal = this.lukkFeilmodal.bind(this);
        this.handleLastNyBruker = this.handleLastNyBruker.bind(this);
        this.handleFortsettSammeBruker = this.handleFortsettSammeBruker.bind(
            this
        );
    }

    public componentDidMount() {
        window.addEventListener('popstate', () => {
            this.oppdaterAktivBrukHvisEndret();
        });

        this.contextListenerPromise = hentIdent().then(ident => {
            return new EnhetContextListener(
                this.websocketUri(ident),
                this.enhetContextHandler
            );
        });

        const fnrFraUrl = hentFodselsnummerFraURL();
        if (fnrFraUrl != null) {
            this.oppdaterAktivBrukHvisEndret();
        } else {
            this.oppdaterSideMedNyAktivBruker();
        }

        if (!enhetFinnesIUrl()) {
            this.handleNyAktivEnhet();
        }
    }

    public componentWillUnmount() {
        if (this.contextListenerPromise) {
            this.contextListenerPromise.then(contextListener => contextListener.close());
        }
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
                    {this.state.tilkoblingHarFeilet ? alertIkkeTilkoblet : null}

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

    private websocketUri(ident: string) {
        const miljo = erDev() ? '-q6' : miljoFraUrl();
        return `wss://veilederflatehendelser${miljo}.adeo.no/modiaeventdistribution/ws/${ident}`;
    }

    private handleFeilet() {
        this.setState({
            brukerModalSynlig: false,
            feilmodalSynlig: true,
            lastBrukerPending: false,
        });
    }

    private oppdaterAktivBrukHvisEndret() {
        const fnrFraUrl = hentFodselsnummerFraURL();
        return hentAktivBruker()
            .then(nyBruker => {
                this.setState({ fnrContext: nyBruker });

                if (!!fnrFraUrl && nyBruker !== fnrFraUrl) {
                    oppdaterAktivBruker(fnrFraUrl);
                }
            })
            .catch(() => this.handleFeilet());
    }

    private oppdaterSideMedNyAktivBruker() {
        hentAktivBruker()
            .then(bruker => {
                const fnrFraUrl = hentFodselsnummerFraURL();
                this.setState({ fnrContext: bruker });

                if (bruker != null && bruker !== fnrFraUrl) {
                    settPersonIURL(bruker);
                }
            })
            .catch(() => this.handleFeilet());
    }

    private enhetContextHandler(event: EnhetContextEvent) {
        switch (event.type) {
            case EnhetContextEventNames.CONNECTION_STATE_CHANGED:
                this.handleTilkoblingStateChange(event.state);
                break;
            case EnhetContextEventNames.NY_AKTIV_ENHET:
                this.handleNyAktivEnhet();
                break;
            case EnhetContextEventNames.NY_AKTIV_BRUKER:
                this.handleNyAktivBruker();
                break;
        }
    }

    private handleNyAktivBruker() {
        hentAktivBruker()
            .then(nyBruker => {
                const fnrFraUrl = hentFodselsnummerFraURL();
                this.setState({ fnrContext: nyBruker });

                if (fnrFraUrl == null) {
                    this.oppdaterSideMedNyAktivBruker();
                } else if (nyBruker !== fnrFraUrl) {
                    this.setState({
                        brukerModalSynlig: true,
                    });
                }
            })
            .catch(() => this.handleFeilet());
    }

    private handleTilkoblingStateChange(
        nyTilkoblingState: EnhetConnectionState
    ) {
        const fortsattFeil =
            this.state.tilkoblingState === EnhetConnectionState.FAILED &&
            nyTilkoblingState !== EnhetConnectionState.CONNECTED;
        this.setState({
            tilkoblingHarFeilet:
                nyTilkoblingState === EnhetConnectionState.FAILED ||
                fortsattFeil,
            tilkoblingState: nyTilkoblingState,
        });
    }

    private handleNyAktivEnhet() {
        hentAktivEnhet()
            .then(enhet => {
                leggEnhetIUrl(enhet);
                initialiserToppmeny();
            })
            .catch(() => this.handleFeilet());
    }

    private handleLastNyBruker() {
        this.oppdaterSideMedNyAktivBruker();
        this.setState({ brukerModalSynlig: false });
    }

    private handleFortsettSammeBruker() {
        this.setState({ lastBrukerPending: true });
        this.oppdaterAktivBrukHvisEndret().then(() =>
            this.setState({
                brukerModalSynlig: false,
                lastBrukerPending: false,
            })
        );
    }

    private lukkFeilmodal() {
        this.setState({ feilmodalSynlig: false });
    }
}
