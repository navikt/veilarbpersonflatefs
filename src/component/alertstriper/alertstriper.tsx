import React from 'react';
import AlertStripe, { AlertStripeType } from 'nav-frontend-alertstriper';
import './alertstriper.less';

function PersonflateAlertStripe(props: { tekst: string, type: AlertStripeType }) {
	return <AlertStripe type={props.type} className="veilarbpersonflatefs-alertstripe">{props.tekst}</AlertStripe>;
}

export function FeilmeldingManglerFnr() {
	return <PersonflateAlertStripe type="info" tekst="Du må søke opp en person for å vise aktivitetsplanen" />;
}

export function IngenTilgangTilBruker() {
	return <PersonflateAlertStripe type="advarsel"  tekst="Du har ikke tilgang til å se aktivitetsplanen" />;
}

export function FeilUnderLastingAvData() {
	return <PersonflateAlertStripe type="feil" tekst="Kunne ikke laste data, prøv på nytt ..." />;
}
