import * as React from 'react';
import NavFrontendModal from 'nav-frontend-modal';
import { Innholdstittel, Normaltekst, Systemtittel } from 'nav-frontend-typografi';
import ChevronLenke, { Retning } from '../chevron-lenke/chevron-lenke';
import './tour-modal.less';
import Stegviser from '../stegviser/stegviser';

export interface Step {
    tittel: string;
    tekst: string;
    bilde: string;
}

interface TourModalState {
    selectedStepIdx: number;
    modalOpen: boolean;
}

interface TourModalProps {
    open: boolean;
    steps: Step[];
}

class TourModal extends React.Component<TourModalProps, TourModalState> {

    constructor(props: TourModalProps) {
        super(props);
        this.state = {
            modalOpen: props.open,
            selectedStepIdx: 0
        };
    }

    componentWillReceiveProps(prevProps: TourModalProps) {
        console.log('will recieve'); // tslint:disable-line
        if (prevProps.open !== this.props.open) {
            this.setState({ modalOpen: this.props.open });
        }
    }

    handleOnRequestClose = () => {
        this.setState({ modalOpen: false });
    };

    handlePreviousBtnClicked = () => {
        this.setState((state: TourModalState) => {
            return { selectedStepIdx: state.selectedStepIdx - 1 }
        });
    };

    handleNextBtnClicked = () => {
        this.setState((state: TourModalState) => {
            return { selectedStepIdx: state.selectedStepIdx + 1 }
        });
    };

    handleFinishBtnClicked = () => {
        this.setState({ modalOpen: false });
    };

    render() {
        const { steps } = this.props;
        const { selectedStepIdx, modalOpen } = this.state;
        const step = steps[selectedStepIdx];
        const isFinalStep = selectedStepIdx === steps.length - 1;

        const hidePrevBtn = selectedStepIdx === 0;
        const nextBtnText = isFinalStep ? "Ferdig" : "Neste";
        const nextBtnHandleClick = isFinalStep ? this.handleFinishBtnClicked : this.handleNextBtnClicked;

        return (
            <NavFrontendModal
                className="tour-modal"
                contentLabel="TourModal"
                isOpen={modalOpen}
                closeButton={false}
                shouldCloseOnOverlayClick={true}
                onRequestClose={this.handleOnRequestClose}
            >
                <header className="tour-modal__header">
                    <Innholdstittel>Ny oppdatering</Innholdstittel>
                </header>
                <main className="tour-modal__main">
                    <img src={step.bilde} className="tour-modal__main--bilde"/>
                    <div className="tour-modal__main--beskrivelse">
                        <Systemtittel>{step.tittel}</Systemtittel>
                        <Normaltekst>{step.tekst}</Normaltekst>
                    </div>
                </main>
                <footer className="tour-modal__footer">
                    <ChevronLenke retning={Retning.VENSTRE} hide={hidePrevBtn} tekst="Forrige" onClick={this.handlePreviousBtnClicked}/>
                    <Stegviser antallSteg={steps.length} valgtSteg={selectedStepIdx}/>
                    <ChevronLenke retning={Retning.HOYRE} tekst={nextBtnText} onClick={nextBtnHandleClick}/>
                </footer>
            </NavFrontendModal>
        );
    }
}

export default TourModal;
