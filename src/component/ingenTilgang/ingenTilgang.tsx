import {IngenTilgangTilBruker} from '../alertstriper/alertstriper';
import {getHarVeilederTilgangFlytteBrukerTilEgetKontor} from '../../api/veilarboppfolging';
import {useEffect, useState} from 'react';
import {BodyShort, Button, Link} from '@navikt/ds-react';
import './ingen-tilgang.less';
import {useModiaContext} from '../../store/modia-context-store';
import {settKontor} from '../../api/ao-oppfolgingskontor';
import {dispatchNavigateEvent} from "../../Router";

enum Steg {
    HAR_IKKE_ENDRET_KONTOR,
    ENDRER_KONTOR,
    HAR_ENDRET_KONTOR
}

export const IngenTilgang = () => {
    const [tilgangFlytteBrukerEgetKontor, setTilgangFlytteBrukerEgetKontor] = useState<boolean | undefined>()
    const {aktivBrukerFnr, aktivEnhetId} = useModiaContext();
    const [steg, setSteg] = useState<Steg>(Steg.HAR_IKKE_ENDRET_KONTOR);
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
        setSteg(Steg.ENDRER_KONTOR)
        const result = await settKontor(aktivBrukerFnr, aktivEnhetId)
        if (result) {
            setSteg(Steg.HAR_ENDRET_KONTOR)
        }
    }

    const skalViseTekstOgKnapp = steg === Steg.ENDRER_KONTOR || steg === Steg.HAR_IKKE_ENDRET_KONTOR;

    return (
        <div>
            <IngenTilgangTilBruker/>

            {tilgangFlytteBrukerEgetKontor && <div className="ingen-tilgang">
                {skalViseTekstOgKnapp &&
                    <div className="ingen-tilgang-innhold">
                        <BodyShort>Du har ikke tilgang til bruker, men kan flytte bruker til {aktivEnhetId}. Du vil da få
                            tilgang til bruker.</BodyShort>
                        <Button loading={steg === Steg.ENDRER_KONTOR} onClick={settKontorButtonClicked}>Flytt
                            bruker til ditt kontor</Button>
                    </div>
                }
                {steg === Steg.HAR_ENDRET_KONTOR &&
                    <Link
                        className="ingen-tilgang-link"
                        to="/aktivitetsplan"
                        onClick={() =>
                            dispatchNavigateEvent('/aktivitetsplan')
                        }
                    >
                        Gå til aktivitetsplanen
                    </Link>}
            </div>
            }
        </div>
    )
}
