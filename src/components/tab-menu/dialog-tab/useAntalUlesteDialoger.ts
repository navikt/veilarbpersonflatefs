import {useEffect, useState} from "react";
import {fetchUlesteDialoger} from "../../../utils/api";
import {useEventListener} from "../../../utils/utils";
import {hentFnrFraUrl} from "../../../utils/url-utils";


const DIALOG_LEST_EVENT = 'aktivitetsplan.dialog.lest';

export default function useUlesteDialoger(): number | undefined {
    const [antallUleste, setAntallUleste] = useState<number | undefined>(undefined);
    const fnr = hentFnrFraUrl();

    useEffect(() => {
        if(fnr) {
            fetchUlesteDialoger(fnr)
                .then(a => setAntallUleste(a.antallUleste))
                .catch();
        }
    }, [fnr, setAntallUleste]);

    useEventListener(DIALOG_LEST_EVENT, () =>{
        if(antallUleste !== undefined && antallUleste > 0) {
            setAntallUleste(antallUleste -1)
        }
    });

    return antallUleste
}
