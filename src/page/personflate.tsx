import React, { useEffect, useState } from 'react';
import SideInnhold from '../component/side-innhold';
import { Aktivitetsplan, Arbeidsmarkedstiltak, Detaljer, Dialog, Vedtaksstotte, Visittkort } from '../component/spa';
import {
	FeilmeldingManglerFnr,
	FeilUnderLastingAvData,
	IngenTilgangTilBruker
} from '../component/alertstriper/alertstriper';
import PageSpinner from '../component/page-spinner/page-spinner';
import { useEventListener } from '../util/utils';
import { InternflateDecorator } from '../component/internflate-decorator/internflate-decorator';
import { useFetchAktivEnhet, useFetchFeatures, useFetchTilgangTilBruker } from '../api/api';
import { hasAnyFailed, isAnyLoading } from '../api/utils';
import { Features } from '../api/features';
import { useModiaContextStore } from '../store/modia-context-store';
import { UtloptSesjonAdvarsel } from '../component/utlopt-sesjon-advarsel/utlopt-sesjon-advarsel';
import { SesjonStatus, useSesjonStatus } from '../hooks/use-sesjon-status';

interface AppInnholdProps {
	fnr: string;
	enhetId: string | undefined;
	features: Features;
}

export const PersonflatePage = () => {
	const [appInnholdKey, setAppInnholdKey] = useState<number>(0);
	const { aktivBrukerFnr, aktivEnhetId, setAktivEnhetId, setAktivBrukerFnr } = useModiaContextStore();
	const { sesjonStatus } = useSesjonStatus();

	const fetchTilgangTilBruker = useFetchTilgangTilBruker(aktivBrukerFnr, { manual: true });
	const fetchFeature = useFetchFeatures();
	const fetchAktivEnhet = useFetchAktivEnhet();

	const onAktivBrukerChanged = (newFnr: string | null) => {
		if (newFnr && newFnr !== aktivBrukerFnr) {
			// window.location.href = `/${newFnr}${window.location.search}`;
			// TODO: When all micro frontends use a version of navspa that supports unmounting
			//  then we dont need to refresh the entire page, and can instead only update the micro frontends with new fnr
			window.history.pushState('', 'Personflate', `/veilarbpersonflatefs/${newFnr}`);
			setAktivBrukerFnr(newFnr);
			console.log("Setting fnr:" + newFnr)
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
		innhold = <PageSpinner />;
	} else if (hasAnyFailed(fetchTilgangTilBruker, fetchFeature)) {
		innhold = <FeilUnderLastingAvData />;
	} else if (!fetchTilgangTilBruker.data) {
		innhold = <IngenTilgangTilBruker />;
	} else {
		innhold = (
			<Innhold key={appInnholdKey} enhetId={aktivEnhetId} fnr={aktivBrukerFnr} features={fetchFeature.data} />
		);
	}

	useEffect(() => {
		setTimeout(() => {
			// onAktivBrukerChanged('12312312312321212')
		}, 8000)
	}, [])

	return (
		<>
			<InternflateDecorator
				enhetId={aktivEnhetId}
				fnr={aktivBrukerFnr}
				onEnhetChanged={onAktivEnhetChanged}
				onFnrChanged={onAktivBrukerChanged}
			/>
			{sesjonStatus === SesjonStatus.UTLOPT && <UtloptSesjonAdvarsel />}
			{innhold}
		</>
	);
};

function incrementKey(oldKey: number): number {
	return oldKey + 1;
}

const Innhold = ({ fnr, enhetId, features }: AppInnholdProps) => {
	const [aktivitetsplanKey, setAktivitetsplanKey] = useState(0);
	const [maoKey, setMaoKey] = useState(0);
	const [vedtakstotteKey, setVedtakstotteKey] = useState(0);
	const [dialogKey, setDialogKey] = useState(0);
	const [arbeidsmarkedstiltakKey, setArbeidsmarkedstiltakKey] = useState(0);

	function incrementAllKeys() {
		setAktivitetsplanKey(incrementKey);
		setMaoKey(incrementKey);
		setVedtakstotteKey(incrementKey);
		setDialogKey(incrementKey);
		setArbeidsmarkedstiltakKey(incrementKey);
	}

	useEventListener('eskaleringsVarselSendt', () => {
		setDialogKey(incrementKey);
		setAktivitetsplanKey(incrementKey);
	});
	useEventListener('rerenderMao', () => setMaoKey(incrementKey));
	useEventListener('oppfolgingAvslutet', incrementAllKeys);

	const visittkort = (
		<Visittkort enhet={enhetId} fnr={fnr} visVeilederVerktoy={true} tilbakeTilFlate="veilarbportefoljeflatefs" />
	);
	const mao = <Detaljer enhet={enhetId} fnr={fnr} key={maoKey} />;
	const aktivitetsplan = <Aktivitetsplan key={aktivitetsplanKey} enhet={enhetId} fnr={fnr} />;
	const vedtaksstotte = <Vedtaksstotte enhet={enhetId} fnr={fnr} key={vedtakstotteKey} />;
	const dialog = <Dialog key={dialogKey} fnr={fnr} enhet={enhetId} />;
	const arbeidsmarkedstiltak = <Arbeidsmarkedstiltak key={arbeidsmarkedstiltakKey} fnr={fnr} enhet={enhetId} />;

	return (
		<SideInnhold
			fnr={fnr}
			features={features}
			visittkort={visittkort}
			mao={mao}
			aktivitetsplan={aktivitetsplan}
			dialog={dialog}
			vedtaksstotte={vedtaksstotte}
			arbeidsmarkedstiltak={arbeidsmarkedstiltak}
		/>
	);
};
