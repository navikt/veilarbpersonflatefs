import React from 'react';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import './feilmeldinger.less';

function Feilmelding(props: { tekst: string }) {
	return <AlertStripeInfo className="veilarbpersonflatefs-feilmelding">{props.tekst}</AlertStripeInfo>;
}

export function FeilmeldingManglerFnr() {
	return <Feilmelding tekst="Du må søke opp en person for å vise aktivitetsplanen" />;
}

export function IngenTilgangTilBruker() {
	return <Feilmelding tekst="Du har ikke tilgang til å se aktivitetsplanen" />;
}
