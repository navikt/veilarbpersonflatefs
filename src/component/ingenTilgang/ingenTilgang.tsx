import {IngenTilgangTilBruker} from '../alertstriper/alertstriper';
import {getHarVeilederTilgangFlytteBrukerTilEgetKontor} from '../../api/veilarboppfolging';
import {useEffect, useState} from 'react';
import {BodyShort, Button} from '@navikt/ds-react';
import './ingen-tilgang.less';
import {useModiaContext} from '../../store/modia-context-store';
import { settKontor } from '../../api/ao-oppfolgingskontor';

export const IngenTilgang = () => {
    const [tilgangFlytteBrukerEgetKontor, setTilgangFlytteBrukerEgetKontor] = useState<boolean | undefined>()
    const {aktivBrukerFnr, aktivEnhetId} = useModiaContext();
    if (!aktivEnhetId) return;
    // TODO: lenke til inngar
    // TODO: bare gjøre  kallet til veilarboppfolging en gang

    useEffect(() => {
        if (tilgangFlytteBrukerEgetKontor !== undefined) return;

        getHarVeilederTilgangFlytteBrukerTilEgetKontor(aktivBrukerFnr).then((response) => {
            if (response.ok) {
                setTilgangFlytteBrukerEgetKontor(response.data.data.veilederTilgang.harVeilederTilgangFlytteBrukerTilEgetKontor);
            } else {
                throw Error('Kunne ikke hente oppfølgingstatus');
            }
        })
    }, []);

	const settKontorButtonClicked = async () => {
		const result = await settKontor(aktivBrukerFnr, aktivEnhetId)
		console.log("Resultat av settKontor: ", result)
	}

    return (
        <div>
            <IngenTilgangTilBruker/>

            {tilgangFlytteBrukerEgetKontor && <div className="ingen-tilgang">
                <BodyShort>Du har ikke tilgang til bruker, men kan flytte bruker til ditt kontor. Du vil da få tilgang
                    til bruker. Bruker er nå på SETT-INN-KONTOR</BodyShort>
                <Button onClick={settKontorButtonClicked}>Flytt bruker</Button>
            </div>}
        </div>
    )
}
