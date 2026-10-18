import { Alert } from '@navikt/ds-react';
import { TilgangResultat } from '../../api/veilarboppfolging';

function PersonflateAlertStripe(props: { tekst: string; type: 'error' | 'warning' | 'info' | 'success' }) {
	return (
		<Alert variant={props.type} className="veilarbpersonflatefs-alertstripe">
			{props.tekst}
		</Alert>
	);
}

export function FeilmeldingManglerFnrAlertStripe() {
	return <PersonflateAlertStripe type="info" tekst="Du må søke opp en person for å vise aktivitetsplanen" />;
}

function ikkeTilgangTekst(tilgangResultat: TilgangResultat | undefined): string {
	switch (tilgangResultat) {
		case 'IKKE_TILGANG_STRENGT_FORTROLIG_ADRESSE':
			return 'Du har ikke tilgang til å se aktivitetsplanen fordi bruker har strengt fortrolig adresse (kode 6)';
		case 'IKKE_TILGANG_FORTROLIG_ADRESSE':
			return 'Du har ikke tilgang til å se aktivitetsplanen fordi bruker har fortrolig adresse (kode 7)';
		case 'IKKE_TILGANG_EGNE_ANSATTE':
			return 'Du har ikke tilgang til å se aktivitetsplanen fordi bruker er skjermet';
		default:
			return 'Du har ikke tilgang til å se aktivitetsplanen';
	}
}

export function IngenTilgangTilBrukerAlertStripe(props: { tilgangResultat: TilgangResultat | undefined }) {
	return <PersonflateAlertStripe type="warning" tekst={ikkeTilgangTekst(props.tilgangResultat)} />;
}

export function FeilUnderLastingAvDataAlertStripe() {
	return <PersonflateAlertStripe type="error" tekst="Kunne ikke laste data, prøv på nytt ..." />;
}
