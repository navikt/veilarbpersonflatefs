import * as queryString from 'query-string';

export const leggEnhetIUrl = (enhet: string) => {
    const currentParams = queryString.parse(location.search);
    currentParams.enhet = enhet;
    const newParams = queryString.stringify(currentParams);
    const newUrl = location.origin + location.pathname + '?' + newParams;
    history.replaceState(history.state, '', newUrl);
};

export function enhetFraUrl() {
    return queryString.parse(window.location.search).enhet;
}

export function enhetFinnesIUrl() {
    return !!enhetFraUrl();
}
