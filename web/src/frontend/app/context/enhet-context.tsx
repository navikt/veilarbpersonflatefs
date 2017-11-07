import * as React from 'react';
import { AlertStripeAdvarselSolid } from 'nav-frontend-alertstriper';
import { connect } from 'react-redux';
import EnhetContextListener, {
    EnhetConnectionState,
    EnhetContextEvent,
    EnhetContextEventNames
} from './enhet-context-listener';
import { FormattedMessage, IntlProvider, addLocaleData } from 'react-intl';
import * as nb from 'react-intl/locale-data/nb';
import ContextFeilmodal from './context-feilmodal';
import { erDev } from '../utils/utils';
import { hentAktivBruker, hentAktivEnhet, oppdaterAktivBruker } from './context-api';
import { hentFodselsnummerFraURL, sendEventOmPersonFraURL, settPersonIURL } from '../eventhandtering';
import NyBrukerModal from './ny-bruker-modal';
import {initialiserToppmeny} from '../utils/dekorator-utils';
import {enhetFinnesIUrl, leggEnhetIUrl} from '../utils/url-utils';
import { tekster } from './context-tekster';
import { fetchToJson } from '../utils/rest-utils';

import './enhet-context.less';

addLocaleData(nb);

interface EnhetContextState {
    brukerModalSynlig: boolean;
    feilmodalSynlig: boolean;
    tilkoblingState: EnhetConnectionState;
    lastBrukerPending: boolean;
    tekster: any;
    fnrContext: string;
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
            tekster: {}
        };

        this.enhetContextHandler = this.enhetContextHandler.bind(this);
    }

    componentDidMount() {
        window.addEventListener('popstate', () => {
            this.oppdaterAktivBrukHvisEndret();
        });

        const host = erDev() ? 'app-t4.adeo.no' : window.location.hostname;
        const uri = `wss://${host}/modiaeventdistribution/websocket`;
        this.contextListener = new EnhetContextListener(uri, this.enhetContextHandler);

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

    handterFeilet() {
        this.setState({
            lastBrukerPending: false,
            brukerModalSynlig: false,
            feilmodalSynlig: true
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
            }).catch(() => this.handterFeilet());
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
            }).catch(() => this.handterFeilet());
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
            }).catch(() => this.handterFeilet());
    }

    handleNyAktivEnhet() {
        hentAktivEnhet()
            .then((enhet) => {
                leggEnhetIUrl(enhet);
                initialiserToppmeny();
            }).catch(() => this.handterFeilet());
    }

    enhetContextHandler(event: EnhetContextEvent) {
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
        const alertIkkeTilkoblet = (
            <AlertStripeAdvarselSolid>
                <FormattedMessage {...tekster.wsfeilmelding} />
            </AlertStripeAdvarselSolid>
        );

        return (
            <IntlProvider locale="nb" defaultLocale="nb" messages={this.state.tekster}>
                <div>
                    { this.state.tilkoblingState === EnhetConnectionState.FAILED ? alertIkkeTilkoblet : null }

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
                    />
                </div>
            </IntlProvider>
        );
    }
}
