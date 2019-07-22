import getWindow from './window';
import { useCallback, useEffect } from 'react';

export function erDev() {
    const host: string = getWindow().location.host;
    const devMode: boolean = getWindow().location.search.includes('devmode');

    return host.includes('localhost') || host.includes('127.0.0.1') || devMode;
}

export function hasStored(tagName: string) {
    return window.localStorage.getItem(tagName) !== null;
}

export function useEventListener(name: string, listener: () => void) {
    const callback = useCallback(listener, []);
    useEffect(() => {
        window.addEventListener(name, callback);
        return () => window.removeEventListener(name, callback);
    }, [callback, name]);
}
