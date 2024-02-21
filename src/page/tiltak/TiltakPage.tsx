import { createElement, Suspense, useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Alert, Button } from '@navikt/ds-react';
import { TabId } from '../../component/side-innhold';
import { useAppContext } from '../../AppContext';
import { useModiaContext } from '../../store/modia-context-store';
import { useParams } from 'react-router-dom';
import { useLoadDeltakerRegistreringApp } from './hooks/useLoadDeltakerRegistreringApp';

const TiltakPage = () => {
    const { setCurrentTabId } = useAppContext();

    useEffect(() => {
        setCurrentTabId(TabId.ARBEIDSMARKEDSTILTAK);
    }, [setCurrentTabId]);

    const getTiltaksgjennomforingIdFraUrl = () => {
        const { id } = useParams();
        if (!id) throw new Error('id ikke satt');

        return id?.includes('_')
            ? id?.replace('_', '.')
            : id;
    };

    const DeltakerRegistreringApp = () => {
        useLoadDeltakerRegistreringApp();

        const tiltaksgjennomforingId = getTiltaksgjennomforingIdFraUrl();

        const { aktivBrukerFnr, aktivEnhetId } = useModiaContext();

        return createElement('arbeidsmarkedstiltak-deltaker', {
            'data-personident': aktivBrukerFnr,
            'data-deltakerlisteId': tiltaksgjennomforingId,
            'data-enhetId': aktivEnhetId
        });
    };

    return (
        <Suspense fallback="Laster...">
            <ErrorBoundary
                FallbackComponent={({ resetErrorBoundary }) => {
                    return (
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '1rem'
                            }}
                        >
                            <Alert variant="error">Klarte ikke laste deltakerregistrering</Alert>
                            <Button onClick={resetErrorBoundary}>Prøv på nytt</Button>
                        </div>
                    );
                }}
            >
                <DeltakerRegistreringApp />
            </ErrorBoundary>
        </Suspense>
    )
        ;
};

export default TiltakPage;
