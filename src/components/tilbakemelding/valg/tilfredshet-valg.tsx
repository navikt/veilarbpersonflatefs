import React from 'react';
import cls from 'classnames';
import svaertDarligBilde from './svaert_darlig.svg';
import darligBilde from './darlig.svg';
import noytralBilde from './noytral.svg';
import braBilde from './bra.svg';
import svaertBraBilde from './svaert_bra.svg';
import './tilfredshet-valg.less';

interface TilfredshetValgProps {
	onTilfredshetChanged: (tilfredshet: number) => void;
	defaultTilfredshet?: number;
	className?: string;
}

interface TilfredshetValgState {
	tilfredshet: number;
}

class TilfredshetValg extends React.Component<TilfredshetValgProps, TilfredshetValgState> {
	constructor(props: TilfredshetValgProps) {
		super(props);
		this.state = { tilfredshet: props.defaultTilfredshet ? props.defaultTilfredshet : 0 };
	}

	handleTilfredshetChanged = (tilfredshet: number) => {
		this.setState({ tilfredshet });
		this.props.onTilfredshetChanged(tilfredshet);
	};

	hentKlasserForIkon = (ikonTilfredshet: number): any => {
		const { tilfredshet } = this.state;
		const erValgt = ikonTilfredshet === tilfredshet;
		const harValgt = tilfredshet > 0;
		return cls('tilfredshet-valg__ikon', {
			'tilfredshet-valg__ikon--ikke-valgt': harValgt && !erValgt,
			'tilfredshet-valg__ikon--valgt': erValgt
		});
	};

	lagValg = (bilde: string, tilfredshet: number) => {
		return (
			<button
				aria-label={'Velg tilfredshet ' + tilfredshet}
				className="tilfredshet-valg__ikon-btn"
				onClick={() => this.handleTilfredshetChanged(tilfredshet)}
			>
				<img className={this.hentKlasserForIkon(tilfredshet)} src={bilde} alt="" />
			</button>
		);
	};

	render() {
		const { className } = this.props;
		return (
			<div className={cls('tilfredshet-valg__wrapper', className)}>
				{this.lagValg(svaertDarligBilde, 1)}
				{this.lagValg(darligBilde, 2)}
				{this.lagValg(noytralBilde, 3)}
				{this.lagValg(braBilde, 4)}
				{this.lagValg(svaertBraBilde, 5)}
			</div>
		);
	}
}

export default TilfredshetValg;
