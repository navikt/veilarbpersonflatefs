import { AsyncNavspa, AsyncSpaConfig } from '@navikt/navspa';
import { useModiaContext } from '../store/modia-context-store';
import { SpaProps } from '../component/spa';
import { SpaName } from '../util/utils';
import { utledOboCdnUrl } from '../util/url-utils';
import Spinner from '../component/spinner/spinner';

const vedtaksstotteAsyncConfig: AsyncSpaConfig = {
	appName: SpaName.VEILARBVEDTAKSSTOTTEFS,
	appBaseUrl: utledOboCdnUrl('veilarbvedtaksstottefs/build'),
	loader: <Spinner />,
	config: {
		wrapperClassName: 'veilarbvedtaksstottefs-wrapper'
	}
};

const Vedtaksstotte: React.ComponentType<SpaProps> = AsyncNavspa.importer<SpaProps>(vedtaksstotteAsyncConfig);

const OppfolgingsvedtakPage = () => {
	const { aktivBrukerFnr, aktivEnhetId } = useModiaContext();

	return <Vedtaksstotte fnr={aktivBrukerFnr} enhet={aktivEnhetId ?? undefined} />;
};

export default OppfolgingsvedtakPage;
