import * as React from 'react';
import cls from 'classnames';
import { fetchUlesteDialoger, UlesteDialoger } from '../../../utils/api';
import dialogRegular from './dialog-regular.svg';
import dialogHover from './dialog-hover.svg';
import './dialog-tab.less';
import getWindow from '../../../utils/window';
import { hentFodselsnummerFraURL } from '../../../utils/url-utils';

interface DialogTabState {
    isHovering: boolean;
    antallUleste: number;
    nyligLest: number;
}

const DIALOG_LEST_EVENT = 'aktivitetsplan.dialog.lest';

class DialogTab extends React.Component<{}, DialogTabState> {

    state = {
        antallUleste: -1,
        isHovering: false,
        nyligLest: 0
    };

    componentDidMount() {
        const fnr = hentFodselsnummerFraURL();
        if (fnr) {
           fetchUlesteDialoger(fnr)
               .then(this.handleOnUlesteDialogerUpdated)
               .catch(); // Squelch errors

            window.addEventListener(DIALOG_LEST_EVENT, this.handleDialogLestEvent, false);
       }
    }

    componentWillUnmount() {
        window.removeEventListener(DIALOG_LEST_EVENT, this.handleDialogLestEvent);
    }

    hentAntallUleste = (): number => {
        const { antallUleste, nyligLest } = this.state;
        return Math.min((antallUleste - nyligLest), 99);
    };

    handleDialogLestEvent = () => {
        this.setState(prevState => ({ nyligLest: prevState.nyligLest + 1 }));
    };

    handleOnUlesteDialogerUpdated = (ulesteDialoger: UlesteDialoger): void => {
        this.setState({ antallUleste: ulesteDialoger.antallUleste });
    };

    handleOnMouseEnter = (): void => {
        this.setState({ isHovering: true });
    };

    handleOnMouseLeave = (): void => {
        this.setState({ isHovering: false });
    };

    handleOnClick = (): void => {
        const openDialog = getWindow().openDialog;
        if (openDialog) {
            openDialog();
        }
    };

    render() {
        const { isHovering } = this.state;
        const antallUleste = this.hentAntallUleste();
        const harUlesteMeldinger = antallUleste > 0;
        const harUlesteMeldingerToSiffer = antallUleste >= 10;
        return (
            <button
                className="tab"
                onMouseEnter={this.handleOnMouseEnter}
                onMouseLeave={this.handleOnMouseLeave}
                onClick={this.handleOnClick}
            >
                <span className={cls('dialog-tab__antall-meldinger--wrapper',
                    { 'dialog-tab__antall-meldinger--hide': !harUlesteMeldinger,
                    'dialog-tab__antall-meldinger--to-siffer': harUlesteMeldingerToSiffer})}
                >
                    <span aria-hidden={true} className="dialog-tab__antall-meldinger">
                        {antallUleste}
                    </span>
                </span>
                <img
                    src={isHovering ? dialogHover : dialogRegular}
                    className="dialog-tab__ikon"
                    alt="Dialog ikon"/>
            </button>
        );
    }
}

export default DialogTab;
