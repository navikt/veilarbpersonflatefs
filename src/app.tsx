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

const App = () => {
	const fnr = hentFnrFraURL();
	const enhetId = hentEnhetIdFraUrl();

	const [aktivitetsplanKey, setAktivitetsplanKey] = useState(0);
	const [maoKey, setMaoKey] = useState(0);
	const [vedtakstotteKey, setVedtakstotteKey] = useState(0);
	const [harTilgang, setHarTilgang] = useState<boolean | undefined>(undefined);

	function incrementAllKeys() {
		setAktivitetsplanKey((oldKey: number) => oldKey + 1);
		setMaoKey((oldKey: number) => oldKey + 1);
		setVedtakstotteKey((oldKey: number) => oldKey + 1);
	}

	useEffect(() => {
		fetchTilgangTilBruker(fnr).then(setHarTilgang);
	}, [fnr]);

	useEventListener('rerenderAktivitetsplan', () => setAktivitetsplanKey((oldKey: number) => oldKey + 1));
	useEventListener('rerenderMao', () => setMaoKey((oldKey: number) => oldKey + 1));
	useEventListener('oppfolgingAvslutet', incrementAllKeys);

	if (!fnr) {
		return <FeilmeldingManglerFnr />;
	}

	if (harTilgang === undefined) {
		return null;
	} else if (!harTilgang) {
		return <IngenTilgangTilBruker />;
	}

	const visittkort = (
		<Visittkort enhet={enhetId} fnr={fnr} visVeilederVerktoy={true} tilbakeTilFlate="veilarbportefoljeflatefs" />
	);
	const mao = <MAO enhet={enhetId} fnr={fnr} key={maoKey} />;
	const aktivitetsplan = <Aktivitetsplan key={aktivitetsplanKey} enhet={enhetId} fnr={fnr} />;
	const vedtaksstotte = <Vedtaksstotte enhet={enhetId} fnr={fnr} key={vedtakstotteKey} />;

	return (
		<>
			<InternflateDecorator enhetId={enhetId} fnr={fnr} />
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

export default App;
