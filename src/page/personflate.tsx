import React, { useEffect, useState } from 'react';
import SideInnhold from '../component/side-innhold';
import { Aktivitetsplan, Dialog, MAO, Vedtaksstotte, Visittkort } from '../component/spa';
import { FeilmeldingManglerFnr, IngenTilgangTilBruker } from '../component/feilmeldinger/feilmeldinger';
import PageSpinner from '../component/page-spinner/page-spinner';
import { useEventListener } from '../util/utils';
import { InternflateDecorator } from '../component/internflate-decorator/internflate-decorator';
import {
	useFetchAktivEnhet,
	useFetchFeatures,
	useFetchTilgangTilBruker
} from '../api/api';
import { hasAnyFailed, isAnyLoading } from '../api/utils';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import { Features } from '../api/features';
import { useModiaContextStore } from '../store/modia-context-store';

interface AppInnholdProps {
	fnr: string;
	enhetId: string | undefined;
	features: Features;
}

export const PersonflatePage = () => {
	const [appInnholdKey, setAppInnholdKey] = useState<number>(0);
	const { aktivBrukerFnr, setAktivBrukerFnr, aktivEnhetId, setAktivEnhetId } = useModiaContextStore();

	const fetchTilgangTilBruker = useFetchTilgangTilBruker(aktivBrukerFnr, { manual: true });
	const fetchFeature = useFetchFeatures();
	const fetchAktivEnhet = useFetchAktivEnhet();

	const onAktivBrukerChanged = (newFnr: string | null) => {
		if (newFnr && newFnr !== aktivBrukerFnr) {
			window.history.pushState('', '', `/veilarabpersonflatefs/${newFnr}`);
			setAktivBrukerFnr(newFnr);
			setAppInnholdKey(key => key + 1); // Forces all the micro frontends to be remounted so that their state is reset
		}
	};

	const onAktivEnhetChanged = (newEnhetId: string | null) => {
		if (newEnhetId && newEnhetId !== aktivEnhetId) {
			setAktivEnhetId(newEnhetId);
		}
	};

	useEffect(() => {
		if (aktivBrukerFnr) {
			fetchTilgangTilBruker.fetch();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [aktivBrukerFnr]);

	useEffect(() => {
		if (fetchAktivEnhet.data && fetchAktivEnhet.data.aktivEnhet) {
			setAktivEnhetId(fetchAktivEnhet.data.aktivEnhet);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [fetchAktivEnhet]);

	let innhold;

	if (!aktivBrukerFnr) {
		innhold = <FeilmeldingManglerFnr />;
	} else if (isAnyLoading(fetchTilgangTilBruker, fetchFeature, fetchAktivEnhet)) {
		innhold = <PageSpinner />
	} else if (hasAnyFailed(fetchTilgangTilBruker, fetchFeature)) {
		innhold = <AlertStripeAdvarsel>Kunne ikke laste data, prøv på nytt ...</AlertStripeAdvarsel>
	} else if (!fetchTilgangTilBruker.data) {
		innhold = <IngenTilgangTilBruker />;
	} else {
		innhold = <Innhold key={appInnholdKey} enhetId={aktivEnhetId} fnr={aktivBrukerFnr} features={fetchFeature.data} />;
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

const Innhold = ({fnr, enhetId, features}: AppInnholdProps) => {
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
