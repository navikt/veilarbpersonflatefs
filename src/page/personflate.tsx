import { useEffect } from 'react';
import { useFetchFeaturesFromOboUnleash, useFetchTilgangTilBruker } from '../api/api';
import { hasAnyFailed } from '../api/utils';
import {
	FeilUnderLastingAvData,
	FeilmeldingManglerFnr,
	IngenTilgangTilBruker
} from '../component/alertstriper/alertstriper';
import { InternflateDecorator } from '../component/internflate-decorator/internflate-decorator';
import SideInnhold from '../component/side-innhold';
import { UtloptSesjonAdvarsel } from '../component/utlopt-sesjon-advarsel/utlopt-sesjon-advarsel';
import { SesjonStatus, useSesjonStatus } from '../hooks/use-sesjon-status';
import { useModiaContext } from '../store/modia-context-store';
import { applications } from '../data/applications';
import { dispatchNavigateEvent } from '../Router';

export const PersonflatePage = () => {
	const { aktivBrukerFnr, aktivEnhetId, setAktivEnhetId, setAktivBrukerFnr, setRenderKey, renderKey } =
		useModiaContext();
	const { sesjonStatus } = useSesjonStatus();

	const fetchTilgangTilBruker = useFetchTilgangTilBruker(aktivBrukerFnr, { manual: true });
	const fetchOboUnleashFeatures = useFetchFeaturesFromOboUnleash();

	const onAktivBrukerChanged = (newFnr: string | null) => {
		if (!newFnr) return;
		setAktivBrukerFnr(newFnr);
		setRenderKey(renderKey + 1);
		const application = applications.find(app => window.location.pathname.startsWith(app.pathEntrypoint));
		if (application) {
			dispatchNavigateEvent(application.pathEntrypoint);
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

	let innhold;

	if (!aktivBrukerFnr) {
		innhold = <FeilmeldingManglerFnr />;
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
