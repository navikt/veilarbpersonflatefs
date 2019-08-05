import React from 'react';
import cls from 'classnames';
import { Normaltekst } from 'nav-frontend-typografi';
import { TAG_DETALJER, TAG_VEDTAKSSTOTTE } from '../side-innhold';
import DialogTab from './dialog-tab/dialog-tab';
import './tab-menu.less';
import { lagreSistBesokteTab } from './siste-tab';

export interface Tab {
    title: string;
    tag: string;
    content: React.ReactElement;
    className?: string;
}

interface TabsProps {
    fnr: string;
    tabs: Tab[];
    defaultSelectedTab?: string; // tag
}

interface TabsState {
    selectedTabIdx: number;
}

class TabMenu extends React.Component<TabsProps, TabsState> {

    constructor(props: TabsProps) {
        super(props);
        this.state = {
            selectedTabIdx: props.defaultSelectedTab ? this.getIndexOfTab(props.tabs, props.defaultSelectedTab) : 0
        };
        this.setBackground();
    }

    setBackground = (): void => {
        const { tabs } = this.props;
        const { selectedTabIdx } = this.state;
        const selectedTabTag = tabs[selectedTabIdx].tag;
        const showGreyBackground = (selectedTabTag === TAG_DETALJER) || (selectedTabTag === TAG_VEDTAKSSTOTTE);

        const appElem = document.getElementsByClassName('veilarbpersonflatefs')[0];

        if (!appElem) {
            return;
        }

        const greyBackground = 'grey-background';
        const hasGreyBackground = appElem.classList.contains(greyBackground);

        if (showGreyBackground && !hasGreyBackground) {
            appElem.classList.add(greyBackground);
        } else if (!showGreyBackground && hasGreyBackground) {
            appElem.classList.remove(greyBackground);
        }

    }

    getIndexOfTab = (tabs: Tab[], tag: string): number => {
        const idx = tabs.findIndex(tab => tab.tag === tag);
        return idx >= 0 ? idx : 0;
    };

    createTabClickedHandler = (tab: number) => {
        return () => {
            const { tabs, fnr } = this.props;
            lagreSistBesokteTab({ fnr, tab: tabs[tab].tag});
            this.setState({ selectedTabIdx: tab });
        };
    };

    mapTabTitlesToViews = (tabs: Tab[]) => {
        const { selectedTabIdx } = this.state;
        const isSelected = (idx: number) => idx === selectedTabIdx;
        return tabs.map((tab, idx) => {
            return (
                <button
                    key={idx}
                    className={cls("tab", {"tab--selected": isSelected(idx)})}
                    onClick={this.createTabClickedHandler(idx)}
                >
                    <Normaltekst className={cls("tab__title", {"tab__title--selected": isSelected(idx)})}>
                        {tab.title}
                    </Normaltekst>
                    <div className="tab__bar"/>
                </button>
            );
        });
    };

    createTabContents = () => {
        const { tabs } = this.props;
        const { selectedTabIdx } = this.state;

        return tabs.map((tab, idx) => {
            return (
                <div
                    className={cls("tab-menu__tab-content", tab.className,
                    { "no-display": (idx !== selectedTabIdx)})}
                    key={idx}
                >
                    {tabs[idx].content}
                </div>
            );
        });
    };


    componentDidUpdate() {
        this.setBackground();
    }

    render() {
        const { tabs } = this.props;
        return (
            <div className="tab-menu">
                <div className="tab-menu__headers--wrapper">
                    <div className="tab-menu__headers">
                        <div>
                            {this.mapTabTitlesToViews(tabs)}
                        </div>
                        <DialogTab/>
                    </div>
                </div>
                {this.createTabContents()}
            </div>
        );
    }

}

export default TabMenu;
