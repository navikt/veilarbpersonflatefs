import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import NavFrontendModal from 'nav-frontend-modal';
import { Innholdstittel, Normaltekst } from 'nav-frontend-typografi';
import { AlertStripeAdvarselSolid } from 'nav-frontend-alertstriper';
import Knapp, { Hovedknapp } from 'nav-frontend-knapper';

interface NyBrukerModalProps {
    isOpen: boolean;
    isPending: boolean;
    doLastNyBruker: () => void;
    doFortsettSammeBruker: () => void;
    fodselsnummer: string;
}

class NyBrukerModal extends React.Component<NyBrukerModalProps> {
    render() {
        return (
            <NavFrontendModal
                contentLabel="Brukercontext"
                isOpen={this.props.isOpen}
                closeButton={false}
                onRequestClose={() => true}
            >
                <div className="brukercontext__modal">
                    <Innholdstittel tag="h1" className="blokk-s">
                        Du har endret bruker
                    </Innholdstittel>
                    <AlertStripeAdvarselSolid className="blokk-s">
                        Du har endret bruker i et annet vindu. Du kan ikke jobbe med 2 brukere samtidig.
                        Velger du avbryt mister du arbeidet du ikke har lagret.
                    </AlertStripeAdvarselSolid>
                    <Normaltekst className="blokk-s">
                        { `Vil du fortsette å jobbe med bruker som har fødselsnummer ${this.props.fodselsnummer}` }
                    </Normaltekst>
                    <div className="modal-footer" >
                        <Hovedknapp onClick={() => this.props.doFortsettSammeBruker()} spinner={this.props.isPending} autoDisableVedSpinner>
                            Bekreft
                        </Hovedknapp>
                        <Knapp disabled={this.props.isPending} type="standard" onClick={() => this.props.doLastNyBruker()}>
                            Avbryt
                        </Knapp>
                    </div>
                </div>
            </NavFrontendModal>
        );
    }
}

export default NyBrukerModal;
