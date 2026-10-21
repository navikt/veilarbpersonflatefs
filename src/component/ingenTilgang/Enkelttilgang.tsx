import { useState } from 'react';
import { BodyShort, Button, Heading } from '@navikt/ds-react';
import { EnkelttilgangSkjema } from './EnkelttilgangSkjema';
import { EnkelttilgangKvittering } from './EnkelttilgangKvittering';

interface EnkelttilgangProps {
	aktivBrukerFnr: string;
}

export const Enkelttilgang = ({ aktivBrukerFnr }: EnkelttilgangProps) => {
	const [skjemaApent, setSkjemaApent] = useState(false);
	const [erSendt, setErSendt] = useState(false);

	if (erSendt) {
		return <EnkelttilgangKvittering />;
	}

	return (
		<div className="ingen-tilgang-innhold">
			<Heading size="medium" className="ingen-tilgang-heading">
				Ikke tilgang til bruker
			</Heading>
			<BodyShort>
				Du har ikke tilgang til brukers geografiske område eller oppfølgingsenhet, men du kan gi deg selv
				midlertidig tilgang til bruker.
			</BodyShort>
			<Button
				className={'ingen-tilgang-knapp'}
				variant="primary"
				size="small"
				onClick={() => setSkjemaApent(true)}
			>
				Be om tilgang
			</Button>
			<EnkelttilgangSkjema
				open={skjemaApent}
				onClose={() => setSkjemaApent(false)}
				onSendt={() => setErSendt(true)}
				aktivBrukerFnr={aktivBrukerFnr}
			/>
		</div>
	);
};
