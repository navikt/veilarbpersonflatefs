import React, { useEffect, useState } from 'react';
import Datalaster from './components/datalaster';
import { Features, lagFeatureToggleUrl, VIS_NY_DIALOG } from './utils/feature-utils';
import { hentEnhetIdFraUrl, hentFnrFraURL } from './utils/url-utils';
import SideInnhold from './components/side-innhold';
import { Aktivitetsplan, Dialog, MAO, Vedtaksstotte, Visittkort } from './components/spa';
import { FeilmeldingManglerFnr, IngenTilgangTilBruker } from './components/feilmeldinger/feilmeldinger';
import PageSpinner from './components/page-spinner/page-spinner';
import { useEventListener } from './utils/utils';
import { InternflateDecorator } from './components/internflate-decorator/internflate-decorator';
import { fetchTilgangTilBruker } from './utils/api';
import Spinner from './components/spinner/spinner';

interface AppInnholdProps {
	fnr: string;
	enhetId: string | undefined;
}

export const App = () => {
	const fnr = hentFnrFraURL();
	const enhetId = hentEnhetIdFraUrl();

	const [harTilgang, setHarTilgang] = useState<boolean | undefined>(undefined);

	useEffect(() => {
		fetchTilgangTilBruker(fnr).then(setHarTilgang);
	}, [fnr]);

	let innhold;

	if (!fnr) {
		innhold = <FeilmeldingManglerFnr />;
	} else if (harTilgang === undefined) {
		innhold = <Spinner />;
	} else if (!harTilgang) {
		innhold = <IngenTilgangTilBruker />;
	} else {
		innhold = <AppInnhold enhetId={enhetId} fnr={fnr} />;
	}

	return (
		<>
			<InternflateDecorator enhetId={enhetId} fnr={fnr} />
			{innhold}
		</>
	);
};

const AppInnhold = ({fnr, enhetId}: AppInnholdProps) => {
	const [aktivitetsplanKey, setAktivitetsplanKey] = useState(0);
	const [maoKey, setMaoKey] = useState(0);
	const [vedtakstotteKey, setVedtakstotteKey] = useState(0);

	function incrementAllKeys() {
		setAktivitetsplanKey((oldKey: number) => oldKey + 1);
		setMaoKey((oldKey: number) => oldKey + 1);
		setVedtakstotteKey((oldKey: number) => oldKey + 1);
	}

	useEventListener('rerenderAktivitetsplan', () => setAktivitetsplanKey((oldKey: number) => oldKey + 1));
	useEventListener('rerenderMao', () => setMaoKey((oldKey: number) => oldKey + 1));
	useEventListener('oppfolgingAvslutet', incrementAllKeys);

	const visittkort = (
		<Visittkort enhet={enhetId} fnr={fnr} visVeilederVerktoy={true} tilbakeTilFlate="veilarbportefoljeflatefs" />
	);
	const mao = <MAO enhet={enhetId} fnr={fnr} key={maoKey} />;
	const aktivitetsplan = <Aktivitetsplan key={aktivitetsplanKey} enhet={enhetId} fnr={fnr} />;
	const vedtaksstotte = <Vedtaksstotte enhet={enhetId} fnr={fnr} key={vedtakstotteKey} />;

	return (
		<>
			<Datalaster<Features> url={lagFeatureToggleUrl()} spinner={<PageSpinner />}>
				{(data: Features) => {
					const dialog = data[VIS_NY_DIALOG] ? <Dialog fnr={fnr} /> : undefined;
					return (
						<SideInnhold
							fnr={fnr}
							features={data}
							visittkort={visittkort}
							mao={mao}
							aktivitetsplan={aktivitetsplan}
							dialog={dialog}
							vedtaksstotte={vedtaksstotte}
						/>
					);
				}}
			</Datalaster>
		</>
	);
};
