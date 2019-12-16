import React from 'react';
import cls from 'classnames';
import { Normaltekst } from 'nav-frontend-typografi';
import { TabId } from '../side-innhold';
import DialogTab from './dialog-tab/dialog-tab';
import { lagreSistBesokteTab } from './siste-tab';
import './tab-menu.less';

export interface Tab {
    id: TabId;
    title: string;
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
    tabsSeen: number[];
}

class TabMenu extends React.Component<TabsProps, TabsState> {

    constructor(props: TabsProps) {
        super(props);
        const selectedTabIdx = props.defaultSelectedTab ? this.getIndexOfTab(props.tabs, props.defaultSelectedTab) : 0;
        this.state = {
            selectedTabIdx,
            tabsSeen: [selectedTabIdx]
        };
        this.setBackground();
    }

    setBackground = (): void => {
        const { tabs } = this.props;
        const { selectedTabIdx } = this.state;
        const selectedTabTag = tabs[selectedTabIdx].id;
        const showGreyBackground = (selectedTabTag === TabId.DETALJER) || (selectedTabTag === TabId.VEDTAKSSTOTTE);

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

    };

    getIndexOfTab = (tabs: Tab[], tag: string): number => {
        const idx = tabs.findIndex(tab => tab.id === tag);
        return idx >= 0 ? idx : 0;
    };

    createTabClickedHandler = (tab: number) => {
        return () => {
            const { tabs, fnr } = this.props;
            lagreSistBesokteTab({ fnr, tab: tabs[tab].id});
            this.setState((state) => {
                const tabsSeen = state.tabsSeen.filter(t => t !== tab).concat(tab);
                return { selectedTabIdx: tab, tabsSeen };
            });
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
        const { selectedTabIdx, tabsSeen } = this.state;

        return tabs.map((tab, idx) => {
            // If the tab has been seen before, then it should still be rendered, but not displayed
            if (tabsSeen.findIndex(t => t === idx) === -1) {
                return null;
            }

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
