import {useEffect, useState} from "react";
import {fetchSistOppdatert, fetchUlesteDialoger} from "../../../utils/api";
import {useEventListener} from "../../../utils/utils";
import {hentFnrFraUrl} from "../../../utils/url-utils";

export enum UpdateTypes {
    Dialog = 'DIALOG',
}

interface UpdateEventType {
    uppdate: string;
    avsender?: string;
}

const eventName = 'uppdate';

export function widowEvent(update: UpdateTypes) {
    window.dispatchEvent(
        new CustomEvent<UpdateEventType>(eventName, { detail: { uppdate: update, avsender: 'veilarbpersonflatefs' } })
    );
}

const DIALOG_LEST_EVENT = 'aktivitetsplan.dialog.lest';

export default function useUlesteDialoger(): number | undefined {
    const [antallUleste, setAntallUleste] = useState<number | undefined>(undefined);
    const fnr = hentFnrFraUrl();
    const [localSistOppdatert, setLocalSistOppdatert] = useState(new Date());

    useEffect(() => {
        if(fnr) {
            fetchUlesteDialoger(fnr)
                .then(a => setAntallUleste(a.antallUleste))
                .catch();
        }
    }, [fnr, setAntallUleste]);

    useEffect(() => {
        if(fnr){
            let interval: number;
            const pollForChanges = () => fetchSistOppdatert(fnr)
                .then(data => {
                    if(!!data.sistOppdatert){
                        const remoteSistOppdatert = new Date(data.sistOppdatert);
                        if (remoteSistOppdatert > localSistOppdatert){
                            widowEvent(UpdateTypes.Dialog);

                            fetchUlesteDialoger(fnr)
                                .then(a => setAntallUleste(a.antallUleste))
                                .catch();

                            setLocalSistOppdatert(new Date());
                        }
                    }
                });

            interval = setInterval(pollForChanges, 10000);
            return () => clearInterval(interval);
        }
        return () => {};

    }, [fnr, localSistOppdatert, setLocalSistOppdatert, setAntallUleste]);


    useEventListener(DIALOG_LEST_EVENT, () =>{
        setAntallUleste(prevState => prevState? prevState - 1 : 0);
    });

    return antallUleste
}
