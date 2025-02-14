import { Alert } from '@navikt/ds-react';
import { TilgangsType } from '../../api/api';

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

const ikkeTilgangFeilmelding: Record<TilgangsType, string> = {
	IKKE_TILGANG_FORTROLIG_ADRESSE: 'Du har ikke tilgang til bruker med fortrolig adresse',
	IKKE_TILGANG_EGNE_ANSATTE: 'Du har ikke tilgang til egne ansatte',
	IKKE_TILGANG_ENHET: 'Du har ikke tilgang til brukerens enhet',
	IKKE_TILGANG_MODIA: 'Du har ikke tilgang til Modia',
	IKKE_TILGANG_STRENGT_FORTROLIG_ADRESSE: 'Du har ikke tilgang til bruker med strengt fortrolig adresse',
	JA: 'Du har tilgang :)'
};

export function IngenTilgangTilBruker({ ikkeTilgangBegrunnelse }: { ikkeTilgangBegrunnelse: TilgangsType }) {
	return <PersonflateAlertStripe type="warning" tekst={ikkeTilgangFeilmelding[ikkeTilgangBegrunnelse]} />;
}

export function FeilUnderLastingAvData() {
	return <PersonflateAlertStripe type="error" tekst="Kunne ikke laste data, prøv på nytt ..." />;
}
