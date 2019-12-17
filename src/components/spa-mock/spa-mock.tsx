import React from 'react';
import cls from 'classnames';
import './spa-mock.less';

interface SpaMockProps {
	name: string;
	className?: string;
}

const SpaMock: React.FunctionComponent<SpaMockProps> = (props: SpaMockProps) => {
	return (
		<div className="spa-mock">
			<div className={cls('spa-mock__content', props.className)}>
				<h1>{props.name}</h1>
			</div>
		</div>
	);
};

export default SpaMock;
