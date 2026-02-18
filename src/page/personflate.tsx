import { useEffect } from 'react';
import { useFetchTilgangTilBruker } from '../api/api';
import { hasAnyFailed, isAnyLoading } from '../api/utils';
import {
	FeilUnderLastingAvData,
	FeilmeldingManglerFnr,
} from '../component/alertstriper/alertstriper';
import { InternflateDecorator } from '../component/internflate-decorator/internflate-decorator';
import PageSpinner from '../component/page-spinner/page-spinner';
import SideInnhold from '../component/side-innhold';
import { UtloptSesjonAdvarsel } from '../component/utlopt-sesjon-advarsel/utlopt-sesjon-advarsel';
import { SesjonStatus, useSesjonStatus } from '../hooks/use-sesjon-status';
import { useModiaContext } from '../store/modia-context-store';
import { IngenTilgang } from '../component/ingenTilgang/IngenTilgang';

export const PersonflatePage = () => {
	return (
		<>
			<InternflateDecorator />
			<Body />
		</>
	);
};

const Body = () => {
	const { aktivBrukerFnr } = useModiaContext();
	const { sesjonStatus } = useSesjonStatus();
	const fetchTilgangTilBruker = useFetchTilgangTilBruker(aktivBrukerFnr, { manual: true });

	useEffect(() => {
		if (aktivBrukerFnr) {
			fetchTilgangTilBruker.fetch();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [aktivBrukerFnr]);

	let innhold;

	if (!aktivBrukerFnr) {
		innhold = <FeilmeldingManglerFnr />;
	} else if (isAnyLoading(fetchTilgangTilBruker)) {
		innhold = <PageSpinner />;
	} else if (hasAnyFailed(fetchTilgangTilBruker)) {
		innhold = <FeilUnderLastingAvData />;
	} else if (!fetchTilgangTilBruker.data) {
		innhold = <IngenTilgang />;
	} else {
		innhold = <SideInnhold />;
	}
	return (
		<>
			{sesjonStatus === SesjonStatus.UTLOPT && <UtloptSesjonAdvarsel />}
			{innhold}
		</>
	);
};
