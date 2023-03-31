import React from 'react';
import cls from 'classnames';
import TilbakemeldingModal, { Tilbakemelding } from '../tilbakemelding-modal';
import { logEvent } from '../../../util/frontend-logger';
import lukkBilde from './lukk.svg';
import tilbakemeldingBilde from './tilbakemelding.svg';
import { Features, SPOR_OM_TILBAKEMELDING } from '../../../api/features';
import './tilbakemelding-fab.less';

// FAB = Floating Action Button

interface TilbakemeldingFabProps {
	features?: Features;
}

interface TilbakemeldingFabState {
	isModalOpen: boolean;
	ikkeVisIgjen: boolean;
	hideFab: boolean;
}

const APP_NAME = 'veilarbpersonflatefs';
const TILBAKEMELDING_PREFIX = 'har_sendt_tilbakemelding';
const TILBAKEMELDING_FEATURE_TAG = 'ny_layout'; // NB: Husk å endre for hver nye feature

class TilbakemeldingFab extends React.Component<TilbakemeldingFabProps, TilbakemeldingFabState> {
	state = {
		hideFab: false,
		ikkeVisIgjen: false,
		isModalOpen: false
	};

	wrapperRef?: HTMLElement | null;

	componentDidMount() {
		document.addEventListener('mousedown', this.handleClickOutside);
	}

	componentWillUnmount() {
		document.removeEventListener('mousedown', this.handleClickOutside);
	}

	handleClickOutside = (e: any) => {
		if (this.state.isModalOpen && this.wrapperRef && !this.wrapperRef.contains(e.target)) {
			this.setState({ isModalOpen: false });
		}
	};

	tilbakemeldingLocalStorageName = () => {
		return `${TILBAKEMELDING_PREFIX}__${TILBAKEMELDING_FEATURE_TAG}`;
	};

	harTidligereSendtTilbakemelding = () => {
		return window.localStorage.getItem(this.tilbakemeldingLocalStorageName()) != null;
	};

	handleFabClicked = () => {
		if (!this.state.isModalOpen) {
			logEvent(`${APP_NAME}.tilbakemelding_modal_apnet`);
		}

		this.setState((prevState: TilbakemeldingFabState) => {
			return { isModalOpen: !prevState.isModalOpen };
		});
	};

	handleTilbakemeldingSendt = (tilbakemelding: Tilbakemelding) => {
		this.startAutoClose();
		this.setState({ hideFab: true });
		window.localStorage.setItem(this.tilbakemeldingLocalStorageName(), 'true');
		logEvent(`${APP_NAME}.tilbakemelding`, { feature: TILBAKEMELDING_FEATURE_TAG, ...tilbakemelding });
	};

	handleIkkeVisIgjen = () => {
		window.localStorage.setItem(this.tilbakemeldingLocalStorageName(), 'true');
		logEvent(`${APP_NAME}.ikke_vis_tilbakemelding_igjen`);
		this.setState({ ikkeVisIgjen: true });
	};

	startAutoClose = () => {
		setTimeout(() => {
			this.setState({ isModalOpen: false });
		}, 1500);
	};

	render() {
		const { features } = this.props;
		const { isModalOpen, ikkeVisIgjen, hideFab } = this.state;
		const hide =
			ikkeVisIgjen || !features?.[SPOR_OM_TILBAKEMELDING] || this.harTidligereSendtTilbakemelding() || hideFab;

		return (
			<div
				ref={ref => {
					this.wrapperRef = ref;
				}}
			>
				{!hide && (
					<button
						aria-label="Åpne tilbakemeldingsmodal"
						className={cls('tilbakemelding-fab', { 'tilbakemelding-fab__trykket': isModalOpen })}
						onClick={this.handleFabClicked}
					>
						<img
							className={cls({
								'tilbakemelding-fab__ikon--apne': !isModalOpen,
								'tilbakemelding-fab__ikon--lukke': isModalOpen
							})}
							src={isModalOpen ? lukkBilde : tilbakemeldingBilde}
							alt=""
						/>
					</button>
				)}
				<TilbakemeldingModal
					open={isModalOpen}
					onTilbakemeldingSendt={this.handleTilbakemeldingSendt}
					onIkkeVisIgjen={this.handleIkkeVisIgjen}
				/>
			</div>
		);
	}
}
export default TilbakemeldingFab;
