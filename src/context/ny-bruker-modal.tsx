import { AlertStripeInfoSolid } from 'nav-frontend-alertstriper';
import Knapp, { Hovedknapp } from 'nav-frontend-knapper';
import NavFrontendModal from 'nav-frontend-modal';
import { Innholdstittel, Normaltekst } from 'nav-frontend-typografi';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { tekster } from './context-tekster';

interface NyBrukerModalProps {
    isOpen: boolean;
    isPending: boolean;
    doLastNyBruker: () => void;
    doFortsettSammeBruker: () => void;
    fodselsnummer: string;
}

const doNothing = () => true;

NavFrontendModal.setAppElement(document.querySelector('#modal-a11y-wrapper'));

class NyBrukerModal extends React.Component<NyBrukerModalProps> {
    public render() {
        return (
            <NavFrontendModal
                contentLabel="Brukercontext"
                portalClassName="context-modal-portal"
                isOpen={this.props.isOpen}
                closeButton={false}
                onRequestClose={doNothing}
            >
                <div className="brukercontext__modal">
                    <Innholdstittel tag="h1" className="blokk-s">
                        <FormattedMessage {...tekster.modalOverskrift} />
                    </Innholdstittel>
                    <AlertStripeInfoSolid className="blokk-s">
                        <FormattedMessage {...tekster.modalAlert} />
                    </AlertStripeInfoSolid>
                    <Normaltekst className="blokk-s">
                        <FormattedMessage
                            {...tekster.modalTekst}
                            values={{ bruker: this.props.fodselsnummer }}
                        />
                    </Normaltekst>
                    <div className="modal-footer">
                        <Hovedknapp
                            disabled={this.props.isPending}
                            onClick={this.props.doLastNyBruker}
                        >
                            <FormattedMessage {...tekster.endre} />
                        </Hovedknapp>
                        <Knapp
                            type="standard"
                            onClick={this.props.doFortsettSammeBruker}
                            spinner={this.props.isPending}
                            autoDisableVedSpinner={true}
                        >
                            <FormattedMessage {...tekster.behold} />
                        </Knapp>
                    </div>
                </div>
            </NavFrontendModal>
        );
    }
}

export default NyBrukerModal;
