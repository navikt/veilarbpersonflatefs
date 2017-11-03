import * as queryString from 'query-string';

export const leggEnhetIUrl = (enhet: string) => {
    const currentParams = queryString.parse(location.search);
    currentParams.enhet = enhet;
    const newParams = queryString.stringify(currentParams);
    const newUrl = location.origin + location.pathname + '?' + newParams;
    history.replaceState(history.state, '', newUrl);
};

function enhetFraUrl() {
    return queryString.parse(location.search).enhet;
}

export function enhetFinnesIUrl() {
    return !!enhetFraUrl();
}



