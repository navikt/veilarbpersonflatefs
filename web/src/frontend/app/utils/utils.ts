export function erDev() {
    const host: string = window.location.host;
    return host.includes('localhost') || host.includes('127.0.0.1');
}