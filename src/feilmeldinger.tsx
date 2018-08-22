import AlertStripeInfoSolid from 'nav-frontend-alertstriper/lib/info-solid-alertstripe';
import * as React from 'react';
import { FormattedMessage, IntlProvider } from 'react-intl';
import { tekster } from './context/context-tekster';

interface FeilProps {
    appNavn: string;
}

export function Feil({ appNavn }: FeilProps) {
    return <div className="applikasjonsfeil">Feil i {appNavn}</div>;
}

export function FeilmeldingManglerFnr() {
    return (
        <IntlProvider locale="nb" defaultLocale="nb" messages={tekster}>
            <div className="container hovedinnhold">
                <AlertStripeInfoSolid>
                    <FormattedMessage {...tekster.manglerFnr} />
                </AlertStripeInfoSolid>
            </div>
        </IntlProvider>
    );
}
