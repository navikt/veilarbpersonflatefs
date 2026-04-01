import { hasAnyFailed, isAnyLoading } from '../api/utils';
import {
	FeilUnderLastingAvDataAlertStripe,
	FeilmeldingManglerFnrAlertStripe
} from '../component/alertstriper/alertstriper';
import { InternflateDecorator } from '../component/internflate-decorator/internflate-decorator';
import PageSpinner from '../component/page-spinner/page-spinner';
import SideInnhold from '../component/side-innhold';
import { UtloptSesjonAdvarsel } from '../component/utlopt-sesjon-advarsel/utlopt-sesjon-advarsel';
import { SesjonStatus, useSesjonStatus } from '../hooks/use-sesjon-status';
import { useModiaContext } from '../store/modia-context-store';
import { IngenTilgangTilBruker } from '../component/ingenTilgang/IngenTilgangTilBruker';
import { useSlettUtlopteInnslagAvFlyttetBrukerTilEgetKontorOnMount } from '../store/flyttet-bruker-store';
import { useFetchTilgangTilBruker } from '../api/veilarbperson';

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
	const fetchTilgangTilBruker = useFetchTilgangTilBruker(aktivBrukerFnr);
	useSlettUtlopteInnslagAvFlyttetBrukerTilEgetKontorOnMount();

	let innhold;

	if (!aktivBrukerFnr) {
		innhold = <FeilmeldingManglerFnrAlertStripe />;
	} else if (isAnyLoading(fetchTilgangTilBruker)) {
		innhold = <PageSpinner />;
	} else if (hasAnyFailed(fetchTilgangTilBruker)) {
		innhold = <FeilUnderLastingAvDataAlertStripe />;
	} else if (!fetchTilgangTilBruker.data) {
		innhold = <IngenTilgangTilBruker />;
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
