import * as React from 'react';
import cls from 'classnames';
import { Hovedknapp } from 'nav-frontend-knapper';
import { Textarea } from 'nav-frontend-skjema';
import { Element, Innholdstittel, Normaltekst } from 'nav-frontend-typografi';
import TilfredshetValg from './valg/tilfredshet-valg';
import Lenke from 'nav-frontend-lenker';
import svaertBraBilde from './valg/svaert_bra.svg';
import './tilbakemelding-modal.less';

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
}

class TilbakemeldingModal extends React.Component<TilbakemeldingModalProps, TilbakemeldingModalState> {

    private readonly KOMMENTAR_ROWS = 5;
    private readonly KOMMENTAR_MAX_CHAR = 750;

    constructor(props: TilbakemeldingModalProps) {
        super(props);

        this.state = {
            harBlittVist: false,
            harSendt: false,
            ikkeVisIgjen: false,
            kommentar: '',
            tilfredshet: 0
        };
    }

    handleKommentarChanged = (e: any) => {

        const value = e.target.value;

        if (value.length <= this.KOMMENTAR_MAX_CHAR) {
            this.setState({ kommentar: value });
        }

    };

    handleFormSubmitted = () => {
        const { tilfredshet, kommentar } = this.state;
        this.setState({ harSendt: true });
        this.props.onTilbakemeldingSendt({ tilfredshet, kommentar });
    };

    handleTilfredshetChanged = (tilfredshet: number) => {
        this.setState({ tilfredshet });
    }

    handleIkkeVisIgjenClicked = () => {
        this.setState({ harSendt: true, ikkeVisIgjen: true });
        this.props.onIkkeVisIgjen();
    }

    renderForm = () => {

        const { tilfredshet, kommentar } = this.state;
        const harBesvartTilfredshet = tilfredshet > 0;

        return (
            <div>
                <Innholdstittel className="blokk-xxs tilbakemelding-modal__tittel">
                    Tilbakemelding
                </Innholdstittel>
                <Normaltekst className="tilbakemelding-modal__ingress">
                    Vi har nå endret design i modia arbeidsrettet oppfølging. Hvordan opplever du endringen? Svarene er anonyme.
                </Normaltekst>
                <div className="tilbakemelding-modal__tilfredshet">
                    <TilfredshetValg
                        className="blokk-xs"
                        onTilfredshetChanged={this.handleTilfredshetChanged}
                        defaultTilfredshet={tilfredshet}
                    />
                    {!harBesvartTilfredshet && <Lenke href="" onClick={this.handleIkkeVisIgjenClicked}>Ikke vis dette igjen</Lenke>}
                </div>
                {harBesvartTilfredshet && (
                    <form className="tilbakemelding-modal__ekspander"  onSubmit={this.handleFormSubmitted}>
                        <div className="tilbakemelding-modal__kommentar">
                            <Textarea
                                className="tilbakemelding-modal__kommentar-felt"
                                label="Si gjerne litt mer om opplevelsen av endringen."
                                rows={this.KOMMENTAR_ROWS}
                                maxLength={this.KOMMENTAR_MAX_CHAR}
                                value={kommentar}
                                onChange={this.handleKommentarChanged}
                            />
                        </div>
                        <Hovedknapp role="submit" className="knapp--hoved">
                            Send
                        </Hovedknapp>
                    </form>
                )}
            </div>
        );
    }

    renderTakkMelding = () => {
        return (
            <div className="tilbakemelding-modal__takk-melding">
                <img
                    className="tilbakemelding-modal__takk-ikon"
                    src={svaertBraBilde}
                />
                <Element>
                    Takk for at du tok deg tid til å gi tilbakemelding.
                    Vi bruker innspillene til å forbedre løsningen.
                </Element>
            </div>
        );
    }

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
            <div className={cls('tilbakemelding-modal',
                { 'tilbakemelding-modal--slide-in': open },
                { 'tilbakemelding-modal--slide-out': !open })}
            >
                <div className={cls('tilbakemelding-modal__innhold',
                    { 'tilbakemelding-modal__innhold--takk': harSendt})}>
                    {harSendt ? this.renderTakkMelding() : this.renderForm()}
                </div>
            </div>
        );
    }
}

export default TilbakemeldingModal;
