import * as React from 'react';
import { AlertStripeAdvarselSolid } from 'nav-frontend-alertstriper';
import { connect } from 'react-redux';
import EnhetContextListener, {
    EnhetConnectionState,
    EnhetContextEvent,
    EnhetContextEventNames
} from './enhet-context-listener';
import ContextFeilmodal from './context-feilmodal';
import {erDev} from '../utils/utils';
import {hentAktivBruker, hentAktivEnhet} from './context-api';

import './enhet-context.less';

interface EnhetContextState {
    enhetModalSynlig: boolean;
    brukerModalSynlig: boolean;
    feilmodalSynlig: boolean;
    tilkoblingState: EnhetConnectionState;
}

export default class EnhetContext extends React.Component<{}, EnhetContextState> {
    contextListener: EnhetContextListener;

    constructor(props) {
        super(props);
        this.state = {
            enhetModalSynlig: false,
            brukerModalSynlig: false,
            feilmodalSynlig: false,
            tilkoblingState: EnhetConnectionState.NOT_CONNECTED
        };

        this.enhetContextHandler = this.enhetContextHandler.bind(this);
    }

    componentDidMount() {
        const host = erDev() ? 'app-t4.adeo.no' : window.location.hostname;
        const uri = `wss://${host}/modiaeventdistribution/websocket`;
        this.contextListener = new EnhetContextListener(uri, this.enhetContextHandler);

        hentAktivEnhet().then(enhet => console.log("hentet aktiv enhet:", enhet));
        hentAktivBruker().then(bruker => console.log("hentet aktiv bruker:", bruker));
    }

    componentWillUnmount() {
        this.contextListener.close();
    }

    enhetContextHandler(event: EnhetContextEvent) {
        switch (event.type) {
            case EnhetContextEventNames.CONNECTION_STATE_CHANGED:
                this.setState({ tilkoblingState: event.state });
                break;
            case EnhetContextEventNames.NY_AKTIV_ENHET:
                console.log("NY AKTIV ENHET!");
                break;
            case EnhetContextEventNames.NY_AKTIV_BRUKER:
                console.log("NY AKTIV BRUKER!");
                break;
        }
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
                <ContextFeilmodal
                    isOpen={this.state.feilmodalSynlig}
                    onClose={() => this.setState({ feilmodalSynlig: false })}
                />
            </div>
        );
    }
}
