import { useCallback, useEffect, useState } from 'react';
import { fetchSistOppdatert, fetchUlesteDialoger, SistOppdatertData } from '../../../api/api';
import { useEventListener } from '../../../util/utils';

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
        new CustomEvent<UpdateEventType>(eventName, {detail: {uppdate: update, avsender: 'veilarbpersonflatefs'}})
    );
}

const DIALOG_LEST_EVENT = 'aktivitetsplan.dialog.lest';

export default function useUlesteDialoger(fnr: string): number | undefined {
    const [antallUleste, setAntallUleste] = useState<number | undefined>(undefined);
    const [localSistOppdatert, setLocalSistOppdatert] = useState(new Date());

    const fetchAntallUlesteDialoger = useCallback(() => {
            if (fnr) {
                fetchUlesteDialoger(fnr)
                    .then(res => setAntallUleste(res.data.antallUleste))
                    .catch()
            }
        },
        [fnr, setAntallUleste]);

    useEffect(() => {
        fetchAntallUlesteDialoger();
    }, [fetchAntallUlesteDialoger]);

    const oppdaterDialogDataHvisNyere = useCallback((data: SistOppdatertData) => {
        if (!!data.sistOppdatert) {
            const remoteSistOppdatert = new Date(data.sistOppdatert);
            if (remoteSistOppdatert > localSistOppdatert) {
                widowEvent(UpdateTypes.Dialog);
                fetchAntallUlesteDialoger();
                setLocalSistOppdatert(new Date());
            }
        }
    }, [localSistOppdatert, setLocalSistOppdatert, fetchAntallUlesteDialoger]);

    useEffect(() => {
        if (fnr) {
            let interval: NodeJS.Timeout;
            const pollForChanges = () => {
                return fetchSistOppdatert(fnr)
                    .then(res => oppdaterDialogDataHvisNyere(res.data))
                    .catch();
            };

            interval = setInterval(pollForChanges, 10000);
            return () => clearInterval(interval);
        }

        // tslint:disable-next-line:no-empty
        return () => {};
    }, [fnr, oppdaterDialogDataHvisNyere]);


    useEventListener(DIALOG_LEST_EVENT, () => {
        setAntallUleste(prevState => prevState ? prevState - 1 : 0);
    });

    return antallUleste
}
