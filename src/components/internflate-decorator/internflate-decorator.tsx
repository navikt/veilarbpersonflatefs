import * as React from 'react';
import { Decorator } from '../spa';
import { lagDecoratorConfig } from './internflate-decorator-utils';

interface InternflateDecoratorProps {
    enhetId: string | undefined;
    fnr: string | undefined;
}

export function InternflateDecorator(props: InternflateDecoratorProps) {
    const config = lagDecoratorConfig(props.fnr, props.enhetId);
    return (
        <nav id="header">
            <Decorator {...config} />
        </nav>
    );
}
