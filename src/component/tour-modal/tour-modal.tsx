import React from 'react';
import NavFrontendModal from 'nav-frontend-modal';
import { Normaltekst, Systemtittel, Undertittel } from 'nav-frontend-typografi';
import ChevronLenke, { Retning } from '../chevron-lenke/chevron-lenke';
import Stegviser from '../stegviser/stegviser';
import TourModalMetrics from './tour-modal-metrics';
import { hasStored } from '../../util/utils';
import './tour-modal.less';

export interface TourModalConfig {
	storageName: string;
	toggleName: string;
	metricName: string;
	modalName: string;
	steps: Step[];
}

export interface Step {
	tittel: string;
	tekst: string;
	bilde: string;
	bildeAlt: string;
}

interface TourModalProps {
	config: TourModalConfig;
}

interface TourModalState {
	selectedStepIdx: number;
	modalOpen: boolean;
}

class TourModal extends React.Component<TourModalProps, TourModalState> {
	private metrics: TourModalMetrics;

	constructor(props: TourModalProps) {
		super(props);

		const { steps, storageName, metricName } = props.config;
		this.metrics = new TourModalMetrics(steps.length, metricName);
		this.state = {
			modalOpen: !hasStored(storageName),
			selectedStepIdx: 0
		};
	}

	lagreIkkeVisModal = () => {
		window.localStorage.setItem(this.props.config.storageName, 'true');
	};

	lukkModal = (finishedTour: boolean) => {
		this.metrics.setTimeSpent(this.state.selectedStepIdx);
		this.metrics.log(finishedTour);

		this.setState({ modalOpen: false });
		this.lagreIkkeVisModal();
	};

	handleOnRequestClose = () => {
		this.lukkModal(false);
	};

	handlePreviousBtnClicked = () => {
		this.setState((state: TourModalState) => {
			return { selectedStepIdx: state.selectedStepIdx - 1 };
		});
	};

	handleNextBtnClicked = () => {
		this.setState((state: TourModalState) => {
			this.metrics.setTimeSpent(state.selectedStepIdx);
			return { selectedStepIdx: state.selectedStepIdx + 1 };
		});
	};

	handleFinishBtnClicked = () => {
		this.lukkModal(true);
	};

	render() {
		const { selectedStepIdx, modalOpen } = this.state;
		const { steps, modalName } = this.props.config;
		const step = steps[selectedStepIdx];
		const isFinalStep = selectedStepIdx === steps.length - 1;

		const hidePrevBtn = selectedStepIdx === 0;
		const nextBtnText = isFinalStep ? 'Ferdig' : 'Neste';
		const nextBtnHandleClick = isFinalStep ? this.handleFinishBtnClicked : this.handleNextBtnClicked;

		return (
			<NavFrontendModal
				className="tour-modal"
				contentLabel="TourModal"
				isOpen={modalOpen}
				closeButton={true}
				shouldCloseOnOverlayClick={false}
				onRequestClose={this.handleOnRequestClose}
			>
				<div className="tour-modal__header--wrapper">
					<header className="tour-modal__header">
						<Systemtittel>{modalName}</Systemtittel>
					</header>
				</div>
				<main className="tour-modal__main">
					<div className="tour-modal__main--bilde-wrapper">
						<img src={step.bilde} alt={step.bildeAlt} className="tour-modal__main--bilde" />
					</div>
					<div className="tour-modal__main--beskrivelse">
						<Undertittel className="blokk-xxxs">{step.tittel}</Undertittel>
						<Normaltekst className="tour-modal__main--tekst">{step.tekst}</Normaltekst>
					</div>
				</main>
				<footer className="tour-modal__footer">
					<ChevronLenke
						retning={Retning.VENSTRE}
						hide={hidePrevBtn}
						tekst="Forrige"
						onClick={this.handlePreviousBtnClicked}
					/>
					<Stegviser antallSteg={steps.length} valgtSteg={selectedStepIdx} />
					<ChevronLenke retning={Retning.HOYRE} tekst={nextBtnText} onClick={nextBtnHandleClick} />
				</footer>
			</NavFrontendModal>
		);
	}
}

export default TourModal;
