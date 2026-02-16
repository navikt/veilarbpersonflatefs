import { IngenTilgangTilBruker } from './alertstriper/alertstriper';
import { getOppfolgingStatus, GraphqlSuccessResponse } from '../api/veilarboppfolging';
import { FunctionComponent, useEffect, useState } from 'react';


type Props = {
	fnr: string
}

export const IngenTilgang: FunctionComponent<Props> = ({fnr}) => {
	const [oppfolgingStatus, setOppfolgingStatus] = useState<GraphqlSuccessResponse | undefined>()

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
			<div>Men...</div>
		</div>
	)
}

