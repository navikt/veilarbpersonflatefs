import { logEvent } from '../../utils/frontend-logger';

interface Metrics {
    // timeSpentStep0, timeSpentStep1...
    totalTimeSpent: number; // sec
    canceledTour: boolean;
    finishedTour: boolean;
}

const LOG_TAG_TOUR_MODAL_METRICS = 'veilarbpersonflatefs.metrikker.tour_modal';

class TourModalMetrics {

    private timeSpent: number[];
    private timeStarted: number;

    constructor(antallSteg: number) {
        this.timeSpent = Array(antallSteg).fill(0);
        this.timeStarted = Date.now();
    }

    public setTimeSpent = (currentStepIdx: number) => {
        const now = Date.now();
        this.timeSpent[currentStepIdx] += ((now - this.timeStarted) / 1000);
        this.timeStarted = now;
    };

    public log = (finishedTour: boolean) => {
        const metrics = this.lagTourModalMetrikker(finishedTour);
        logEvent(LOG_TAG_TOUR_MODAL_METRICS, metrics);
    };

    private lagTourModalMetrikker = (finishedTour: boolean): Metrics => {
        const metrics = {
            canceledTour: !finishedTour,
            finishedTour,
            totalTimeSpent: this.timeSpent.reduce((acc, timeSpent) => acc += timeSpent)
        };

        this.timeSpent.forEach((timeSpent, idx) => {
            metrics[`timeSpentStep${idx}`] = timeSpent;
        });

        return metrics;
    };

}

export default TourModalMetrics;
