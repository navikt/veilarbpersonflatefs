import { IngenTilgangTilBruker } from '../alertstriper/alertstriper';
import { getHarVeilederTilgangFlytteBrukerTilEgetKontor } from '../../api/veilarboppfolging';
import { FunctionComponent, useEffect, useState } from 'react';
import {BodyShort, Button} from '@navikt/ds-react';
import './ingen-tilgang.less';


type Props = {
	fnr: string
}

export const IngenTilgang: FunctionComponent<Props> = ({fnr}) => {
	const [tilgangFlytteBrukerEgetKontor, setTilgangFlytteBrukerEgetKontor] = useState<boolean | undefined>()
	// TODO: lenke til inngar
	// TODO: bare gjøre  kallet til veilarboppfolging en gang

	useEffect(() => {
		if (tilgangFlytteBrukerEgetKontor !== undefined) return;

		getHarVeilederTilgangFlytteBrukerTilEgetKontor(fnr).then((response) => {
			if (response.ok) {
				setTilgangFlytteBrukerEgetKontor(response.data.data.veilederTilgang.harVeilederTilgangFlytteBrukerTilEgetKontor);
			} else {
				throw Error('Kunne ikke hente oppfølgingstatus');
			}
		})
	}, []);



	return (
		<div>
			<IngenTilgangTilBruker />

			{tilgangFlytteBrukerEgetKontor && <div className="ingen-tilgang">
				<BodyShort>Du har ikke tilgang til bruker, men kan flytte bruker til ditt kontor. Du vil da få tilgang til bruker.</BodyShort>
				<Button>Flytt bruker</Button>
			</div>}
		</div>
	)
}

