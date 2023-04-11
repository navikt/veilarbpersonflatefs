import React from 'react';
import cls from 'classnames';

import { ChevronLeftIcon, ChevronRightIcon } from '@navikt/aksel-icons';
import './chevron-lenke.less';

export enum Retning {
	HOYRE,
	VENSTRE
}

interface ChevronLenkeProps {
	retning: Retning;
	tekst: string;
	hide?: boolean;
	onClick?: () => void;
}

const ChevronLenke: React.FunctionComponent<ChevronLenkeProps> = (props: ChevronLenkeProps) => {
	const { retning, tekst, onClick, hide } = props;
	return (
		<button className={cls('chevron-lenke', { 'chevron-lenke--hide': hide })} onClick={onClick}>
			{retning === Retning.VENSTRE ? (
				<>
					<ChevronLeftIcon />
					<span className="chevron-lenke__tekst">{tekst}</span>
				</>
			) : (
				<>
					<span className="chevron-lenke__tekst">{tekst}</span>
					<ChevronRightIcon />
				</>
			)}
		</button>
	);
};

export default ChevronLenke;
