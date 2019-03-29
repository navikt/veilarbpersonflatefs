import getWindow from './window';

export function erDev() {
    const host: string = getWindow().location.host;
    const devMode: boolean = getWindow().location.search.includes('devmode');

    return host.includes('localhost') || host.includes('127.0.0.1') || devMode;
}

export function hasStored(tagName: string) {
    return window.localStorage.getItem(tagName) !== null;
}
