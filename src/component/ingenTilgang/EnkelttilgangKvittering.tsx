import { BodyShort, Heading } from '@navikt/ds-react';

export const EnkelttilgangKvittering = () => {
	return (
		<div className="ingen-tilgang-innhold">
			<Heading size="medium" className="ingen-tilgang-heading">
				Du har bedt om midlertidig tilgang til bruker
			</Heading>
			<BodyShort>Det kan ta noen minutter før tilgangen blir oppdatert. Du kan prøve å laste siden på nytt.</BodyShort>
		</div>
	);
};
