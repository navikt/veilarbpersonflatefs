import * as React from 'react';
import NavFrontendModal from 'nav-frontend-modal';
import { Innholdstittel, Normaltekst, Systemtittel } from 'nav-frontend-typografi';
import ChevronLenke, { Retning } from '../chevron-lenke/chevron-lenke';
import Stegviser from '../stegviser/stegviser';
import step1Bilde from './step-1.jpg';
import step2Bilde from './step-2.jpg';
import step3Bilde from './step-3.jpg';
import { logEvent } from '../../utils/frontend-logger';
import './tour-modal.less';

const modalName = 'TOUR_MODAL-NY_LAYOUT_ENDRING';

const steps: Step[] = [
    { tittel: 'Visittkort', bilde: step1Bilde, tekst: 'tekst1'},
    { tittel: 'Veilederverktøy', bilde: step2Bilde, tekst: 'tekst2'},
    { tittel: 'Fane', bilde: step3Bilde, tekst: 'tekst3'},
];

interface Step {
    tittel: string;
    tekst: string;
    bilde: string;
}

interface TourModalState {
    selectedStepIdx: number;
    modalOpen: boolean;
}

interface TourModalMetrics {
    timeSpentStep0: number; // sec
    timeSpentStep1: number; // sec
    timeSpentStep2: number; // sec
    totalTimeSpent: number; // sec
    canceledTour: boolean;
    finishedTour: boolean;
}

const LOG_TAG_TOUR_MODAL_METRICS = 'veilarbpersonflatefs.metrikker.tour_modal';

class TourModal extends React.Component<{}, TourModalState> {

    private timeSpent: number[];
    private timeStarted: number;

    constructor(props: {}) {
        super(props);
        this.timeStarted = Date.now();
        this.timeSpent = Array(steps.length).fill(0);
        this.state = {
            modalOpen: this.skalViseModal(),
            selectedStepIdx: 0
        };
    }

    skalViseModal = (): boolean => {
        return true;
        return window.localStorage.getItem(modalName) == null;
    };

    lagreIkkeVisModal = () => {
        window.localStorage.setItem(modalName, 'true');
    };

    lagTourModalMetrikker = (finishedTour: boolean): TourModalMetrics => {
        return {
            canceledTour: !finishedTour,
            finishedTour,
            timeSpentStep0: this.timeSpent[0],
            timeSpentStep1: this.timeSpent[1],
            timeSpentStep2: this.timeSpent[2],
            totalTimeSpent: this.timeSpent.reduce((acc, timeSpent) => acc += timeSpent)
        };
    };

    lukkModal = () => {
        this.setState({ modalOpen: false });
        this.lagreIkkeVisModal();
    };

    setTimeSpent = () => {
        const now = Date.now();
        this.timeSpent[this.state.selectedStepIdx] += ((now - this.timeStarted) / 1000);
        this.timeStarted = now;
    };

    handleOnRequestClose = () => {
        const metrics = this.lagTourModalMetrikker(false);
        logEvent(LOG_TAG_TOUR_MODAL_METRICS, metrics);
        this.lukkModal();
    };

    handlePreviousBtnClicked = () => {
        this.setState((state: TourModalState) => {
            return { selectedStepIdx: state.selectedStepIdx - 1 }
        });
    };

    handleNextBtnClicked = () => {
        this.setState((state: TourModalState) => {
            this.setTimeSpent();
            return { selectedStepIdx: state.selectedStepIdx + 1 }
        });
    };

    handleFinishBtnClicked = () => {
        this.setTimeSpent();
        const metrics = this.lagTourModalMetrikker(true);
        logEvent(LOG_TAG_TOUR_MODAL_METRICS, metrics);
        this.lukkModal();
    };

    render() {
        const { selectedStepIdx, modalOpen } = this.state;
        const step = steps[selectedStepIdx];
        const isFinalStep = selectedStepIdx === steps.length - 1;

        const hidePrevBtn = selectedStepIdx === 0;
        const nextBtnText = isFinalStep ? "Ferdig" : "Neste";
        const nextBtnHandleClick = isFinalStep ?
            this.handleFinishBtnClicked : this.handleNextBtnClicked;

        return (
            <NavFrontendModal
                className="tour-modal"
                contentLabel="TourModal"
                isOpen={modalOpen}
                closeButton={true}
                shouldCloseOnOverlayClick={false}
                onRequestClose={this.handleOnRequestClose}
            >
                <header className="tour-modal__header">
                    <Innholdstittel>Ny oppdatering</Innholdstittel>
                </header>
                <main className="tour-modal__main">
                    <div className="tour-modal__main--bilde-wrapper">
                        <img src={step.bilde} className="tour-modal__main--bilde"/>
                    </div>
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
