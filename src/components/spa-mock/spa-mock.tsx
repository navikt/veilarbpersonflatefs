import React from 'react';
import './spa-mock.less';

interface SpaMockProps {
    name: string;
    className?: string;
}

const SpaMock: React.FunctionComponent<SpaMockProps> = (props: SpaMockProps) => {
    return (
        <div className={"spa-mock " + props.className}>
            <h1>{props.name}</h1>
        </div>
    );
};

export default SpaMock;
