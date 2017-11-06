import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import NavFrontendModal from 'nav-frontend-modal';
import { Innholdstittel } from 'nav-frontend-typografi';
import { Hovedknapp } from 'nav-frontend-knapper';
import { tekster } from './context-tekster';
import { AlertStripeAdvarselSolid } from 'nav-frontend-alertstriper';

interface ContextFeilmodalProps {
    isOpen: boolean;
    onClose: () => void;
}

class ContextFeilmodal extends React.Component<ContextFeilmodalProps> {
    render() {
        return (
            <NavFrontendModal
                contentLabel="ContextFeilmodal"
                shouldCloseOnOverlayClick={false}
                isOpen={this.props.isOpen}
                closeButton
                onRequestClose={this.props.onClose}
            >
                <div className="brukercontext__modal">
                    <Innholdstittel tag="h1" className="blokk-s">
                        <FormattedMessage {...tekster.wsfeilmelding} />
                    </Innholdstittel>
                    <div className="modal-content modal-test">
                        <AlertStripeAdvarselSolid className="blokk-s">
                            <FormattedMessage {...tekster.feilmodalTekst} />
                        </AlertStripeAdvarselSolid>
                    </div>
                    <div className="modal-footer" >
                        <Hovedknapp onClick={this.props.onClose}>
                            <FormattedMessage {...tekster.feilmodalBekreft} />
                        </Hovedknapp>
                    </div>
                </div>
            </NavFrontendModal>
        );
    }
}

export default ContextFeilmodal;
