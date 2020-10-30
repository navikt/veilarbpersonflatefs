import React from 'react';
import { SpaMock } from './components/spa-mock/spa-mock';
import SideInnhold from './components/side-innhold';
import PageSpinner from './components/page-spinner/page-spinner';
import { SpaName, spaWrapperTabContentClassName } from './components/spa';
import { useFetchFeatures } from './api/api';
import { hasAnyFailed, isAnyLoading } from './api/utils';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';
import { Features } from './api/features';
import { testBrukerFnr } from './mocks/data';

const AppMock: React.FunctionComponent = () => {
	const fetchFeature = useFetchFeatures();

	if (isAnyLoading(fetchFeature)) {
		return <PageSpinner/>;
	} else if (hasAnyFailed(fetchFeature)) {
		return <AlertStripeFeil>Klarte ikke å laste inn data, prøv igjen senere</AlertStripeFeil>;
	}

	const visittkort = (
		<SpaMock
			name={SpaName.VEILARBVISITTKORTFS}
			tekst="Visittkort"
			className="spa-mock__content--visittkort"
		/>
	);

	const mao = (
		<SpaMock
			name={SpaName.VEILARBMAOFS}
			tekst="MAO"
			wrapperClassName={spaWrapperTabContentClassName}
			className="spa-mock__content--mao"
		/>
	);

	const aktivitetsplan = (
		<SpaMock
			name={SpaName.AKTIVITETSPLAN}
			tekst="Aktivitetsplan"
			wrapperClassName={spaWrapperTabContentClassName}
			className="spa-mock__content--aktivitetsplan"
		/>
	);

	const dialog = (
		<SpaMock
			name={SpaName.DIALOG}
			tekst="Dialog"
			wrapperClassName={spaWrapperTabContentClassName}
			className="spa-mock__content--dialog"
		/>
	);

	const vedtaksstotte = (
		<SpaMock
			name={SpaName.VEILARBVEDTAKSSTOTTEFS}
			tekst="Vedtaksstøtte"
			wrapperClassName={spaWrapperTabContentClassName}
			className="spa-mock__content--vedtaksstotte"
		/>
	);

	return (
		<>
	        <SpaMock
		        name={SpaName.INTERNARBEIDSFLATEFS_DECORATOR}
		        tekst="Dekoratør"
		        className="spa-mock__content--internflatedecorator"
	        />
			<SideInnhold
				fnr={testBrukerFnr}
				features={fetchFeature.data as Features}
				visittkort={visittkort}
				mao={mao}
				aktivitetsplan={aktivitetsplan}
				dialog={dialog}
				vedtaksstotte={vedtaksstotte}
			/>
		</>
	);
};

export default AppMock;
