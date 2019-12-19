import React, { useEffect, useState } from 'react';
import Datalaster from './components/datalaster';
import { Features, lagFeatureToggleUrl, VIS_NY_DIALOG } from './utils/feature-utils';
import { enhetFraUrl, hentFodselsnummerFraURL } from './utils/url-utils';
import { fetchToJson } from './utils/rest-utils';
import SideInnhold from './components/side-innhold';
import { Aktivitetsplan, Dialog, MAO, Vedtaksstotte, Visittkort } from './components/spa';
import getWindow from './utils/window';
import { initialiserToppmeny } from './utils/dekorator-utils';
import { FeilmeldingManglerFnr, IngenTilgangTilBruker } from './components/feilmeldinger/feilmeldinger';
import EnhetContext from './context/context';
import PageSpinner from './components/page-spinner/page-spinner';
import { useEventListener } from './utils/utils';

const App = () => {
	const fnr = hentFodselsnummerFraURL();

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
		fetchToJson(`/veilarbperson/api/person/${fnr}/tilgangTilBruker`)
			.then(value => setHarTilgang(!!value))
			.catch(() => setHarTilgang(false));
	}, [fnr]);

	useEventListener('rerenderAktivitetsplan', () => setAktivitetsplanKey((oldKey: number) => oldKey + 1));
	useEventListener('rerenderMao', () => setMaoKey((oldKey: number) => oldKey + 1));
	useEventListener('oppfolgingAvslutet', incrementAllKeys);

	const enhet = enhetFraUrl();
	const erDecoratorenIkkeLastet = !getWindow().renderDecoratorHead;

	if (erDecoratorenIkkeLastet) {
		return <div>500 feil: Mangler decoratøren</div>;
	}

	initialiserToppmeny();

	if (!fnr) {
		return <FeilmeldingManglerFnr />;
	}

	if (harTilgang === undefined) {
		return null;
	} else if (!harTilgang) {
		return <IngenTilgangTilBruker />;
	}

	const visittkort = (
		<Visittkort enhet={enhet} fnr={fnr} visVeilederVerktoy={true} tilbakeTilFlate="veilarbportefoljeflatefs" />
	);
	const mao = <MAO enhet={enhet} fnr={fnr} key={maoKey} />;
	const aktivitetsplan = <Aktivitetsplan key={aktivitetsplanKey} enhet={enhet} fnr={fnr} />;
	const vedtaksstotte = <Vedtaksstotte enhet={enhet} fnr={fnr} key={vedtakstotteKey} />;

	return (
		<>
			<EnhetContext />
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
