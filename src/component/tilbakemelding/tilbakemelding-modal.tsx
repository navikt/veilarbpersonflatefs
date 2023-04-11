import React from 'react';
import cls from 'classnames';
import TilfredshetValg from './valg/tilfredshet-valg';
import hjerteIkon from './ikon_hjerte.svg';
import './tilbakemelding-modal.less';
import { BodyShort, Button, Ingress, Link, Textarea } from '@navikt/ds-react';

export interface Tilbakemelding {
	tilfredshet: number;
	kommentar: string;
}

interface TilbakemeldingModalProps {
	open: boolean;
	onTilbakemeldingSendt: (tilbakemelding: Tilbakemelding) => void;
	onIkkeVisIgjen: () => void;
}

interface TilbakemeldingModalState {
	tilfredshet: number;
	kommentar: string;
	harSendt: boolean;
	harBlittVist: boolean;
	ikkeVisIgjen: boolean;
	showFadeOutAnimation: boolean;
}

class TilbakemeldingModal extends React.Component<TilbakemeldingModalProps, TilbakemeldingModalState> {
	KOMMENTAR_ROWS = 5;
	KOMMENTAR_MAX_CHAR = 750;

	constructor(props: TilbakemeldingModalProps) {
		super(props);

		this.state = {
			harBlittVist: false,
			harSendt: false,
			ikkeVisIgjen: false,
			kommentar: '',
			showFadeOutAnimation: false,
			tilfredshet: 0
		};
	}

	handleKommentarChanged = (e: any) => {
		const value = e.target.value;

		if (value.length <= this.KOMMENTAR_MAX_CHAR) {
			this.setState({ kommentar: value });
		}
	};

	handleFormSubmitted = (e: any) => {
		const { tilfredshet, kommentar } = this.state;

		e.preventDefault();
		this.setState({ showFadeOutAnimation: true });

		setTimeout(() => {
			this.setState({ harSendt: true });
			this.props.onTilbakemeldingSendt({ tilfredshet, kommentar });
		}, 200);
	};

	handleTilfredshetChanged = (tilfredshet: number) => {
		this.setState({ tilfredshet });
	};

	handleIkkeVisIgjenClicked = () => {
		this.setState({ harSendt: true, ikkeVisIgjen: true });
		this.props.onIkkeVisIgjen();
	};

	renderForm = () => {
		const { tilfredshet, kommentar, showFadeOutAnimation } = this.state;
		const harBesvartTilfredshet = tilfredshet > 0;

		return (
			<div className={cls({ 'tilbakemelding-modal__innhold-fade-out': showFadeOutAnimation })}>
				<Ingress className="blokk-xxs tilbakemelding-modal__tittel">Tilbakemelding</Ingress>
				<BodyShort className="tilbakemelding-modal__ingress">
					Vi har nå endret design i Modia arbeidsrettet oppfølging. Hvordan opplever du endringen? Svarene er
					anonyme.
				</BodyShort>
				<div className="tilbakemelding-modal__tilfredshet">
					<TilfredshetValg
						className="blokk-l"
						onTilfredshetChanged={this.handleTilfredshetChanged}
						defaultTilfredshet={tilfredshet}
					/>
					{!harBesvartTilfredshet && (
						<Link className="ikke-vis-igjen-lenke" href="" onClick={this.handleIkkeVisIgjenClicked}>
							Ikke vis dette igjen
						</Link>
					)}
				</div>
				{harBesvartTilfredshet && (
					<form className="tilbakemelding-modal__ekspander" onSubmit={this.handleFormSubmitted}>
						<div className="tilbakemelding-modal__kommentar">
							<Textarea
								className="tilbakemelding-modal__kommentar-felt"
								label="Fortell gjerne om din opplevelse."
								rows={this.KOMMENTAR_ROWS}
								maxLength={this.KOMMENTAR_MAX_CHAR}
								value={kommentar}
								onChange={this.handleKommentarChanged}
							/>
						</div>
						<Button type="submit">Send</Button>
					</form>
				)}
			</div>
		);
	};

	renderTakkMelding = () => {
		return (
			<div className="takk-melding__wrapper">
				<img src={hjerteIkon} alt="Hjerte" className="takk-melding__ikon" />
				<Ingress className="takk-melding__tekst">Takk for din tilbakemelding</Ingress>
			</div>
		);
	};

	componentDidUpdate(prevProps: TilbakemeldingModalProps) {
		if (prevProps.open && !this.state.harBlittVist) {
			this.setState({ harBlittVist: true });
		}
	}

	render() {
		const { open } = this.props;
		const { harSendt, harBlittVist, ikkeVisIgjen } = this.state;

		// Make sure that the animation will trigger when closing instead of returning null (no animation)
		if ((!open && !harBlittVist) || ikkeVisIgjen) {
			return null;
		}

		return (
			<div
				className={cls('tilbakemelding-modal', {
					'tilbakemelding-modal--slide-in': open,
					'tilbakemelding-modal--slide-out': !open && !harSendt,
					'tilbakemelding-modal--slide-out-takk': !open && harSendt,
					'tilbakemelding-modal--takk-posisjon': harSendt
				})}
			>
				<div
					className={cls('tilbakemelding-modal__innhold', {
						'tilbakemelding-modal__innhold--takk': harSendt
					})}
				>
					{harSendt ? this.renderTakkMelding() : this.renderForm()}
				</div>
			</div>
		);
	}
}

export default TilbakemeldingModal;
