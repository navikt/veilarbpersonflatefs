import {useModiaContext} from "../../../store/modia-context-store";
import useUlesteDialoger from "./useAntallUlesteDialoger";
import './uleste-dialoger.less';

export const UlesteDialoger = () => {
	const { aktivBrukerFnr } = useModiaContext();
	const antallUleste = useUlesteDialoger(aktivBrukerFnr);

	if (!antallUleste) {
		return null;
	}

	return (
		<span className="uleste-dialoger-notification">
            {antallUleste}
            <span className="sr-only"> uleste</span>
        </span>
	);
};
