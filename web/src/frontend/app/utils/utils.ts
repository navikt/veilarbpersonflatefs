export function erDev() {
    const host: string = window.location.host;
    const devMode: boolean = window.location.search.includes('devmode');

    return host.includes('localhost') || host.includes('127.0.0.1') || devMode;
}
