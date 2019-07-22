import React from 'react';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import Knapp, { Hovedknapp } from 'nav-frontend-knapper';
import NavFrontendModal from 'nav-frontend-modal';
import { Innholdstittel, Normaltekst } from 'nav-frontend-typografi';
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

const NyBrukerModal = (props: NyBrukerModalProps) => {
    return (
        <NavFrontendModal
            contentLabel="Brukercontext"
            portalClassName="context-modal-portal"
            isOpen={props.isOpen}
            closeButton={false}
            onRequestClose={doNothing}
        >
            <div className="brukercontext__modal">
                <Innholdstittel tag="h1" className="blokk-s">
                    <FormattedMessage {...tekster.modalOverskrift} />
                </Innholdstittel>
                <AlertStripeInfo className="blokk-s">
                    <FormattedMessage {...tekster.modalAlert} />
                </AlertStripeInfo>
                <Normaltekst className="blokk-s">
                    <FormattedMessage
                        {...tekster.modalTekst}
                        values={{ bruker: props.fodselsnummer }}
                    />
                </Normaltekst>
                <div className="modal-footer">
                    <Hovedknapp
                        disabled={props.isPending}
                        onClick={props.doLastNyBruker}
                    >
                        <FormattedMessage {...tekster.endre} />
                    </Hovedknapp>
                    <Knapp
                        type="standard"
                        onClick={props.doFortsettSammeBruker}
                        spinner={props.isPending}
                        autoDisableVedSpinner={true}
                    >
                        <FormattedMessage {...tekster.behold} />
                    </Knapp>
                </div>
            </div>
        </NavFrontendModal>
    );
};

export default NyBrukerModal;
