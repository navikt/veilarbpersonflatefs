import './sesjonNotifikasjon.less';

import React, { useEffect, useRef, useState } from 'react';

import { hentResterendeSekunder } from '../api/api';
import { loginUrl } from '../util/url-utils';
import Lenke from 'nav-frontend-lenker';
import { AlertStripeAdvarsel, AlertStripeFeil } from 'nav-frontend-alertstriper';

enum SesjonStatus {
    UTLOPER_SNART,
    TVUNGEN_UTLOGGING_SNART
}

export const SesjonNotifikasjon = (): React.ReactElement | null => {
    const [sesjonStatus, setSesjonStatus] = useState<SesjonStatus>();
    const [utlopAlertOmMs, setUtlopAlertOmMs] = useState<number>();
    const [utloggingAlertOmMs, setUtloggingAlertOmMs] = useState<number>();
    const [tvungenUtloggingOmMs, setTvungenUtloggingOmMs] = useState<number>();
    const [expirationTimeMs, setExpirationTimeMs] = useState<number | undefined>(undefined);
    useEffect(() => {
        hentResterendeSekunder().then(remainingSeconds => setExpirationTimeMs(remainingSeconds * 1000));
    }, [setExpirationTimeMs]);

    const tvungenUtloggingTimeoutRef = useRef<number>();
    const tvungenUtloggingAlertTimeoutRef = useRef<number>();
    const utloperSnartAlertTimeoutRef = useRef<number>();

    const visTvungen = sesjonStatus === SesjonStatus.TVUNGEN_UTLOGGING_SNART;
    const visUtloper = sesjonStatus === SesjonStatus.UTLOPER_SNART;

    useEffect(() => {
        if (!expirationTimeMs) return;
        const sixtyMin = 60 * 60 * 1000;
        const fiveMin = 60 * 5 * 1000;
        const oneMin = 60 * 1000;
        const tenS = 10 * 1000;

        const refreshTokenWorkAround  = expirationTimeMs - sixtyMin;

        const msTilUtloperSnartAlert = expirationTimeMs - fiveMin;
        const msTilUtloggingAlert = expirationTimeMs - oneMin;
        const msTilUtlogging = expirationTimeMs - tenS;

        if(refreshTokenWorkAround < 0) {
            window.location.href = loginUrl();
        }

        setUtlopAlertOmMs(Math.max(msTilUtloperSnartAlert, 0));
        setUtloggingAlertOmMs(Math.max(msTilUtloggingAlert, 0));
        setTvungenUtloggingOmMs(Math.max(msTilUtlogging, 0));
    }, [expirationTimeMs]);

    useEffect(() => {
        if (utlopAlertOmMs === undefined) return;

        utloperSnartAlertTimeoutRef.current = setTimeout(() => {
            setSesjonStatus(SesjonStatus.UTLOPER_SNART);
        }, utlopAlertOmMs) as unknown as number;

        return () => clearTimeout(utloperSnartAlertTimeoutRef.current);
    }, [utlopAlertOmMs]);

    useEffect(() => {
        if (utloggingAlertOmMs === undefined) return;

        tvungenUtloggingAlertTimeoutRef.current = setTimeout(() => {
            setSesjonStatus(SesjonStatus.TVUNGEN_UTLOGGING_SNART);
        }, utloggingAlertOmMs) as unknown as number;

        return () => clearTimeout(tvungenUtloggingAlertTimeoutRef.current);
    }, [utloggingAlertOmMs]);

    useEffect(() => {
        if (sesjonStatus !== SesjonStatus.TVUNGEN_UTLOGGING_SNART) return;
        if (tvungenUtloggingTimeoutRef.current) return;
        if (!tvungenUtloggingOmMs) return;

        tvungenUtloggingTimeoutRef.current = setTimeout(() => {
            window.location.href = loginUrl();
        }, tvungenUtloggingOmMs) as unknown as number;

        return () => clearTimeout(tvungenUtloggingTimeoutRef.current);
    }, [sesjonStatus, tvungenUtloggingOmMs]);

    if (sesjonStatus === undefined) return null;

    const LoginLenke = () => (
        <Lenke href={loginUrl()} className="wonderwallLoginLenke">
            Forleng innloggingen
        </Lenke>
    );

    return (
        <div className="sesjonNotifikasjonWraper">
            {visTvungen && (
                <AlertStripeFeil>
                    Du blir straks logget ut, og må forlenge innloggingen.
                    <LoginLenke/>
                </AlertStripeFeil>
            )}
            {visUtloper && (
                <AlertStripeAdvarsel>
                    Du blir snart logget ut. Forleng innloggingen for å unngå å miste pågående arbeid.
                    <LoginLenke/>
                </AlertStripeAdvarsel>
            )}
        </div>
    );
};
