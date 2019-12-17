import { logEvent } from '../../utils/frontend-logger';

interface Metrics {
	// timeSpentStep0, timeSpentStep1...
	totalTimeSpent: number; // sec
	canceledTour: boolean;
	finishedTour: boolean;
}

class TourModalMetrics {
	private timeSpent: number[];
	private timeStarted: number;
	private metricName: string;

	constructor(antallSteg: number, metricName: string) {
		this.timeSpent = Array(antallSteg).fill(0);
		this.timeStarted = Date.now();
		this.metricName = metricName;
	}

	public setTimeSpent = (currentStepIdx: number) => {
		const now = Date.now();
		this.timeSpent[currentStepIdx] += (now - this.timeStarted) / 1000;
		this.timeStarted = now;
	};

	public log = (finishedTour: boolean) => {
		const metrics = this.lagTourModalMetrikker(finishedTour);
		logEvent(this.metricName, metrics);
	};

	private lagTourModalMetrikker = (finishedTour: boolean): Metrics => {
		const metrics = {
			canceledTour: !finishedTour,
			finishedTour,
			totalTimeSpent: this.timeSpent.reduce((acc, timeSpent) => (acc += timeSpent))
		};

		this.timeSpent.forEach((timeSpent, idx) => {
			metrics[`timeSpentStep${idx}`] = timeSpent;
		});

		return metrics;
	};
}

export default TourModalMetrics;
