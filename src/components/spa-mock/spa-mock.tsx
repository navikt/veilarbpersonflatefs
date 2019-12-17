import React from 'react';
import cls from 'classnames';
import NAVSPA from '../../utils/navspa';
import { SpaName } from '../spa';
import './spa-mock.less';

interface SpaMockProps {
	name: SpaName;
	tekst: string;
	className?: string;
}

interface SpaMockContentProps {
	tekst: string;
	className?: string;
}

export const SpaMock: React.FunctionComponent<SpaMockProps> = (props: SpaMockProps) => {
	const SpaMockComponent = NAVSPA.importer<SpaMockProps>(props.name);
	return <SpaMockComponent name={props.name} tekst={props.tekst} className={props.className} />;
};

export const SpaMockContent: React.FunctionComponent<SpaMockProps> = (props: SpaMockContentProps) => {
	return (
		<div className="spa-mock">
			<div className={cls('spa-mock__content', props.className)}>
				<h1>{props.tekst}</h1>
			</div>
		</div>
	);
};
