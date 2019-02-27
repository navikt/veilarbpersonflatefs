import AlertStripeInfoSolid from 'nav-frontend-alertstriper/lib/info-solid-alertstripe';
import * as React from 'react';
import { FormattedMessage, IntlProvider } from 'react-intl';
import { Tekst, tekster } from '../context/context-tekster';

interface FeilProps {
    appNavn: string;
}

export function Feil({ appNavn }: FeilProps) {
    return <div className="applikasjonsfeil">Feil i {appNavn}</div>;
}

export function FeilmeldingMedAlertStripe(props: { tekst: Tekst }) {
    return (
        <IntlProvider locale="nb" defaultLocale="nb" messages={tekster}>
            <div className="container hovedinnhold">
                <AlertStripeInfoSolid>
                    <FormattedMessage {...props.tekst} />
                </AlertStripeInfoSolid>
            </div>
        </IntlProvider>
    );
}

export function FeilmeldingManglerFnr() {
    return <FeilmeldingMedAlertStripe tekst={tekster.manglerFnr} />
}

export function IngenTilgangTilBruker() {
    return <FeilmeldingMedAlertStripe tekst={tekster.ingenTilgangBruker} />
}
