import React, { useEffect, useState } from 'react';
import { hentFnrFraUrl } from './utils/url-utils';
import SideInnhold from './components/side-innhold';
import { Aktivitetsplan, Dialog, MAO, Vedtaksstotte, Visittkort } from './components/spa';
import { FeilmeldingManglerFnr, IngenTilgangTilBruker } from './components/feilmeldinger/feilmeldinger';
import PageSpinner from './components/page-spinner/page-spinner';
import { useEventListener } from './utils/utils';
import { InternflateDecorator } from './components/internflate-decorator/internflate-decorator';
import { useFetchAktivEnhet, useFetchFeatures, useFetchTilgangTilBruker } from './api/api';
import { hasAnyFailed, isAnyLoading } from './api/utils';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import { Features } from './api/features';

interface AppInnholdProps {
	fnr: string;
	enhetId: string | undefined;
	features: Features;
}

export const App = () => {
	const [aktivBrukerFnr, setAktivBrukerFnr] = useState<string | undefined>(hentFnrFraUrl);
	const [aktivEnhetId, setAktivEnhetId] = useState<string | undefined>();

	const fetchTilgangTilBruker = useFetchTilgangTilBruker(aktivBrukerFnr || '');
	const fetchFeature = useFetchFeatures();
	const fetchAktivEnhet = useFetchAktivEnhet();

	const onAktivBrukerChanged = (newFnr: string | null) => {
		if (newFnr) {
			window.history.pushState('', '', `/veilarabpersonflatefs/${newFnr}`);
		}
		setAktivBrukerFnr(newFnr || undefined);
	};

	const onAktivEnhetChanged = (newEnhetId: string | null) => {
		setAktivEnhetId(newEnhetId || undefined);
	};

	useEffect(() => {
		if (fetchAktivEnhet.data) {
			setAktivEnhetId(fetchAktivEnhet.data.aktivEnhet || undefined);
		}
	}, [fetchAktivEnhet]);

	let innhold;

	if (!aktivBrukerFnr) {
		innhold = <FeilmeldingManglerFnr />;
	} else if (isAnyLoading([fetchTilgangTilBruker, fetchFeature, fetchAktivEnhet])) {
		innhold = <PageSpinner />
	} else if (hasAnyFailed([fetchTilgangTilBruker, fetchFeature])) {
		innhold = <AlertStripeAdvarsel>Kunne ikke laste data, prøv på nytt ...</AlertStripeAdvarsel>
	} else if (!fetchTilgangTilBruker.data) {
		innhold = <IngenTilgangTilBruker />;
	} else {
		innhold = <AppInnhold enhetId={aktivEnhetId} fnr={aktivBrukerFnr} features={fetchFeature.data as Features} />;
	}

	return (
		<>
			<InternflateDecorator
				enhetId={aktivEnhetId}
				fnr={aktivBrukerFnr}
				onEnhetChanged={onAktivEnhetChanged}
				onFnrChanged={onAktivBrukerChanged}
			/>
			{innhold}
		</>
	);
};

const AppInnhold = ({fnr, enhetId, features}: AppInnholdProps) => {
	const [aktivitetsplanKey, setAktivitetsplanKey] = useState(0);
	const [maoKey, setMaoKey] = useState(0);
	const [vedtakstotteKey, setVedtakstotteKey] = useState(0);
	const [dialogKey, setDialogKey] = useState(0);

	function incrementAllKeys() {
		setAktivitetsplanKey((oldKey: number) => oldKey + 1);
		setMaoKey((oldKey: number) => oldKey + 1);
		setVedtakstotteKey((oldKey: number) => oldKey + 1);
		setDialogKey((oldKey: number) => oldKey + 1);
	}

	useEventListener('eskaleringsVarselSendt', () => setDialogKey((oldKey: number) => oldKey + 1));
	useEventListener('rerenderMao', () => setMaoKey((oldKey: number) => oldKey + 1));
	useEventListener('oppfolgingAvslutet', incrementAllKeys);

	const visittkort = <Visittkort enhet={enhetId} fnr={fnr} visVeilederVerktoy={true} tilbakeTilFlate="veilarbportefoljeflatefs" />;
	const mao = <MAO enhet={enhetId} fnr={fnr} key={maoKey} />;
	const aktivitetsplan = <Aktivitetsplan key={aktivitetsplanKey} enhet={enhetId} fnr={fnr} />;
	const vedtaksstotte = <Vedtaksstotte enhet={enhetId} fnr={fnr} key={vedtakstotteKey} />;
	const dialog = <Dialog key={dialogKey} fnr={fnr} enhet={enhetId}/>;

	return (
		<SideInnhold
			fnr={fnr}
			features={features}
			visittkort={visittkort}
			mao={mao}
			aktivitetsplan={aktivitetsplan}
			dialog={dialog}
			vedtaksstotte={vedtaksstotte}
		/>
	);
};
