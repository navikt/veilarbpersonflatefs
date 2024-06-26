import { useEffect, useState } from 'react';
import { useFetchFeaturesFromOboUnleash, useFetchTilgangTilBruker } from '../api/api';
import { hasAnyFailed, isAnyLoading } from '../api/utils';
import {
	FeilUnderLastingAvData,
	FeilmeldingManglerFnr,
	IngenTilgangTilBruker
} from '../component/alertstriper/alertstriper';
import { InternflateDecorator } from '../component/internflate-decorator/internflate-decorator';
import PageSpinner from '../component/page-spinner/page-spinner';
import SideInnhold from '../component/side-innhold';
import { UtloptSesjonAdvarsel } from '../component/utlopt-sesjon-advarsel/utlopt-sesjon-advarsel';
import { SesjonStatus, useSesjonStatus } from '../hooks/use-sesjon-status';
import { useModiaContext } from '../store/modia-context-store';

export const PersonflatePage = () => {
	const { aktivBrukerFnr, aktivEnhetId, setAktivEnhetId, setAktivBrukerFnr, setRenderKey, renderKey } =
		useModiaContext();
	const { sesjonStatus } = useSesjonStatus();

	const fetchTilgangTilBruker = useFetchTilgangTilBruker(aktivBrukerFnr, { manual: true });
	const fetchOboUnleashFeatures = useFetchFeaturesFromOboUnleash();

	// Hack used because internflatedecorator does not update onFnrChanged function so comparison on fnr can not
	// be done inside that function because it alwaus closes the first value
	const [nextFnr, setNextFnr] = useState<null | string>(aktivBrukerFnr);
	useEffect(() => {
		if (nextFnr && nextFnr !== aktivBrukerFnr) {
			setAktivBrukerFnr(nextFnr);
			setRenderKey(renderKey + 1); // Forces all the micro frontends to be remounted so that their state is reset
		}
	}, [nextFnr]);

	const onAktivBrukerChanged = (newFnr: string | null) => setNextFnr(newFnr);

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

	let innhold;

	if (!aktivBrukerFnr) {
		innhold = <FeilmeldingManglerFnr />;
	} else if (isAnyLoading(fetchTilgangTilBruker, fetchOboUnleashFeatures)) {
		innhold = <PageSpinner />;
	} else if (hasAnyFailed(fetchTilgangTilBruker, fetchOboUnleashFeatures)) {
		innhold = <FeilUnderLastingAvData />;
	} else if (!fetchTilgangTilBruker.data) {
		innhold = <IngenTilgangTilBruker />;
	} else {
		innhold = <Innhold />;
	}

	return (
		<>
			<InternflateDecorator
				enhetId={aktivEnhetId}
				fnr={aktivBrukerFnr ?? null}
				onEnhetChanged={onAktivEnhetChanged}
				onFnrChanged={onAktivBrukerChanged}
			/>
			{sesjonStatus === SesjonStatus.UTLOPT && <UtloptSesjonAdvarsel />}
			{innhold}
		</>
	);
};

const Innhold = () => {
	return <SideInnhold />;
};
