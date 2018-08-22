import { AlertStripeNavAnsatt } from 'nav-frontend-alertstriper';
import { Hovedknapp } from 'nav-frontend-knapper';
import NavFrontendModal from 'nav-frontend-modal';
import { Innholdstittel } from 'nav-frontend-typografi';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { tekster } from './context-tekster';

interface ContextFeilmodalProps {
    isOpen: boolean;
    onClose: () => void;
}

class ContextFeilmodal extends React.Component<ContextFeilmodalProps> {
    public render() {
        return (
            <NavFrontendModal
                contentLabel="ContextFeilmodal"
                shouldCloseOnOverlayClick={false}
                isOpen={this.props.isOpen}
                closeButton={true}
                onRequestClose={this.props.onClose}
            >
                <div className="brukercontext__modal">
                    <Innholdstittel tag="h1" className="blokk-s">
                        <FormattedMessage {...tekster.feilmodalOverskrift} />
                    </Innholdstittel>
                    <div className="modal-content modal-test">
                        <AlertStripeNavAnsatt className="blokk-s">
                            <FormattedMessage {...tekster.feilmodalTekst} />
                        </AlertStripeNavAnsatt>
                    </div>
                    <div className="modal-footer">
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
