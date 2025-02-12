import React from 'react';
import cls from 'classnames';
import { SpaName } from '../../util/utils';
import './spa-mock.less';

export interface SpaMockProps {
	name: SpaName;
	tekst: string;
	className?: string;
}

export const SpaMock: React.FunctionComponent<SpaMockProps> = (props: SpaMockProps) => {
	return (
		<div className="spa-mock">
			<div className={cls('spa-mock__content', props.className)}>
				<p className="spa-mock__title">{props.tekst}</p>
			</div>
		</div>
	);
};
