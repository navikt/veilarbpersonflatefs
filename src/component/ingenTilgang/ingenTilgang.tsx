import { IngenTilgangTilBruker } from '../alertstriper/alertstriper';
import { getOppfolgingStatus, GraphqlSuccessResponse } from '../../api/veilarboppfolging';
import { FunctionComponent, useEffect, useState } from 'react';
import {BodyShort, Button} from '@navikt/ds-react';
import './ingen-tilgang.less';


type Props = {
	fnr: string
}

export const IngenTilgang: FunctionComponent<Props> = ({fnr}) => {
	const [oppfolgingStatus, setOppfolgingStatus] = useState<GraphqlSuccessResponse | undefined>()

	const skalViseFlyttBrukerKnapp = oppfolgingStatus?.data.oppfolging.erUnderOppfolging && oppfolgingStatus?.data.oppfolging.kanStarteOppfolging === 'IKKE_TILGANG_ENHET'
	// TODO: lenke til inngar

	// TODO: bare gjøre  kallet til veilarboppfolging en gang

	useEffect(() => {
		if (oppfolgingStatus) return;

		getOppfolgingStatus(fnr, 'FIK_TOKEN').then((response) => {
			if (response.ok) {
				setOppfolgingStatus(response.data)
			} else {
				throw Error('Kunne ikke hente oppfølgingstatus');
			}
		})
	}, []);



	return (
		<div>
			<IngenTilgangTilBruker />

			{skalViseFlyttBrukerKnapp && <div className="ingen-tilgang">
				<BodyShort>Du har ikke tilgang til bruker, men kan flytte bruker til ditt kontor. Du vil da få tilgang til bruker.</BodyShort>
				<Button>Flytt bruker</Button>
			</div>}
		</div>
	)
}

