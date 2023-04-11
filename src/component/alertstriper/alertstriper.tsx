import { Alert } from '@navikt/ds-react';

function PersonflateAlertStripe(props: { tekst: string; type: 'error' | 'warning' | 'info' | 'success' }) {
	return (
		<Alert variant={props.type} className="veilarbpersonflatefs-alertstripe">
			{props.tekst}
		</Alert>
	);
}

export function FeilmeldingManglerFnr() {
	return <PersonflateAlertStripe type="info" tekst="Du må søke opp en person for å vise aktivitetsplanen" />;
}

export function IngenTilgangTilBruker() {
	return <PersonflateAlertStripe type="warning" tekst="Du har ikke tilgang til å se aktivitetsplanen" />;
}

export function FeilUnderLastingAvData() {
	return <PersonflateAlertStripe type="error" tekst="Kunne ikke laste data, prøv på nytt ..." />;
}
