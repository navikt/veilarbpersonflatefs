import * as React from 'react';
import { AlertStripeAdvarselSolid } from 'nav-frontend-alertstriper';
import { connect } from 'react-redux';
import EnhetContextListener, {
    EnhetConnectionState,
    EnhetContextEvent,
    EnhetContextEventNames
} from './enhet-context-listener';
import ContextFeilmodal from './context-feilmodal';
import { erDev } from '../utils/utils';
import { hentAktivBruker, hentAktivEnhet, oppdaterAktivBruker } from './context-api';
import { hentFodselsnummerFraURL, sendEventOmPersonFraURL, settPersonIURL } from '../eventhandtering';
import NyBrukerModal from './ny-bruker-modal';
import {initialiserToppmeny} from '../utils/meny-utils';
import {enhetFinnesIUrl, leggEnhetIUrl} from '../utils/url-utils';

import './enhet-context.less';

interface EnhetContextState {
    brukerModalSynlig: boolean;
    feilmodalSynlig: boolean;
    tilkoblingState: EnhetConnectionState;
    lastBrukerPending: boolean;
}

export default class EnhetContext extends React.Component<{}, EnhetContextState> {
    contextListener: EnhetContextListener;

    constructor(props) {
        super(props);
        this.state = {
            brukerModalSynlig: false,
            feilmodalSynlig: false,
            lastBrukerPending: false,
            tilkoblingState: EnhetConnectionState.NOT_CONNECTED
        };

        this.enhetContextHandler = this.enhetContextHandler.bind(this);
    }

    componentDidMount() {
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
                if (nyBruker !== fnrFraUrl) {
                    oppdaterAktivBruker(fnrFraUrl);
                }
            }).catch(() => this.handterFeilet());
    }

    oppdaterSideMedNyAktivBruker() {
        hentAktivBruker()
            .then((bruker) => {
                const fnrFraUrl = hentFodselsnummerFraURL();
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
                Det er fare for at du kan ha forskjellige brukere i forskjellige flater/vinduer.
                Systemet feiler og klarer ikke oppfatte endringer du eventuelt har gjort i andre vinuer.
            </AlertStripeAdvarselSolid>
        );

        return (
            <div>
                { this.state.tilkoblingState === EnhetConnectionState.FAILED ? alertIkkeTilkoblet : null }

                <NyBrukerModal
                    isOpen={this.state.brukerModalSynlig === true}
                    isPending={this.state.lastBrukerPending}
                    doLastNyBruker={() => this.handleLastNyBruker()}
                    doFortsettSammeBruker={() => this.handleFortsettSammeBruker()}
                    fodselsnummer={hentFodselsnummerFraURL()}
                />

                <ContextFeilmodal
                    isOpen={this.state.feilmodalSynlig}
                    onClose={() => this.setState({ feilmodalSynlig: false })}
                />
            </div>
        );
    }
}
