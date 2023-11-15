import step1Bilde from './step-1.png';
import { TourModalConfig } from '../tour-modal';

import {TOUR_MODAL_LAST_NED_CV_TOGGLE} from "../../../api/stale-features";

export const lastNedCvModalConfig: TourModalConfig = {
	storageName: 'TOUR_MODAL-LAST_NED_CV',
	toggleName: TOUR_MODAL_LAST_NED_CV_TOGGLE,
	metricName: 'veilarbpersonflatefs.metrikker.tour_modal.last_ned_cv',
	modalName: 'Ny oppdatering',
	steps: [
		{
			tittel: 'Last ned og skriv ut CV',
			bilde: step1Bilde,
			bildeAlt: 'Skjermbilde av last ned CV lenke i detaljer',
			tekst: 'Du kan nå i Detaljer laste ned brukerens CV og få en bedre utskrift.'
		}
	]
};
