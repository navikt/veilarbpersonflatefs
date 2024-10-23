import { AsyncNavspa, AsyncSpaConfig } from '@navikt/navspa';
import { useModiaContext } from '../store/modia-context-store';
import { SpaName, SpaProps } from '../component/spa';
import { erITestMiljo, utledSpaUrl } from '../util/url-utils';
import Spinner from '../component/spinner/spinner';

const vedtaksstotteAsyncConfig: AsyncSpaConfig = {
	appName: SpaName.VEILARBVEDTAKSSTOTTEFS,
	appBaseUrl: utledOppfolgingsvedtakCdnUrl('obo-veilarbvedtaksstottefs-dev'),
	loader: <Spinner />,
	config: {
		wrapperClassName: 'veilarbvedtaksstottefs-wrapper'
	}
};

function utledOppfolgingsvedtakCdnUrl(contextPath: string): string {
	const base = 'https://cdn.nav.no/obo';
	return erITestMiljo() ? `${base}/dev/${contextPath}` : `${base}/prod/${contextPath}`;
}

const Vedtaksstotte: React.ComponentType<SpaProps> = AsyncNavspa.importer<SpaProps>(vedtaksstotteAsyncConfig);

const OppfolgingsvedtakPage = () => {
	const { aktivBrukerFnr, aktivEnhetId } = useModiaContext();

	return <Vedtaksstotte fnr={aktivBrukerFnr} enhet={aktivEnhetId ?? undefined} />;
};

export default OppfolgingsvedtakPage;
