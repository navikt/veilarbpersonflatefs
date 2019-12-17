import React from 'react';
import { SpaMock } from './components/spa-mock/spa-mock';
import SideInnhold from './components/side-innhold';
import { Features, lagFeatureToggleUrl } from './utils/feature-utils';
import Datalaster from './components/datalaster';
import PageSpinner from './components/page-spinner/page-spinner';
import brukerFnr from './mock/bruker-fnr';
import { SpaName, tabContentSpaAppWrapperClassName } from './components/spa';

const AppMock: React.FunctionComponent = () => {
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
			wrapperClassName={tabContentSpaAppWrapperClassName}
			className="spa-mock__content--mao"
		/>
	);

	const aktivitetsplan = (
		<SpaMock
			name={SpaName.AKTIVITETSPLAN}
			tekst="Aktivitetsplan"
			wrapperClassName={tabContentSpaAppWrapperClassName}
			className="spa-mock__content--aktivitetsplan"
		/>
	);

	const dialog = (
		<SpaMock
			name={SpaName.DIALOG}
			tekst="Dialog"
			wrapperClassName={tabContentSpaAppWrapperClassName}
			className="spa-mock__content--dialog"
		/>
	);

	const vedtaksstotte = (
		<SpaMock
			name={SpaName.VEILARBVEDTAKSSTOTTEFS}
			tekst="Vedtaksstøtte"
			wrapperClassName={tabContentSpaAppWrapperClassName}
			className="spa-mock__content--vedtaksstotte"
		/>
	);

	return (
		<Datalaster<Features> url={lagFeatureToggleUrl()} spinner={<PageSpinner />}>
			{(data: Features) => (
				<SideInnhold
					fnr={brukerFnr}
					features={data}
					visittkort={visittkort}
					mao={mao}
					aktivitetsplan={aktivitetsplan}
					dialog={dialog}
					vedtaksstotte={vedtaksstotte}
				/>
			)}
		</Datalaster>
	);
};

export default AppMock;
