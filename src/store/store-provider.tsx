import React from 'react';
import { ModiaContextStore } from './modia-context-store';

interface StoreProviderProps {
	fnr: string;
	children: React.ReactNode;
}

const StoreProvider = (props: StoreProviderProps) => {
	return <ModiaContextStore fnr={props.fnr}>{props.children}</ModiaContextStore>;
};

export default StoreProvider;
