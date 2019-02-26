import React from 'react';
import cls from 'classnames';
import './tab-menu.less';
import { Normaltekst } from 'nav-frontend-typografi';

export interface Tab {
    title: string;
    content: React.ReactElement;
}

interface TabsProps {
    tabs: Tab[];
    defaultSelectedTab?: number;
}

interface TabsState {
    selectedTab: number;
}

class TabMenu extends React.Component<TabsProps, TabsState> {

    constructor(props: TabsProps) {
        super(props);
        this.state = {
            selectedTab: props.defaultSelectedTab ? props.defaultSelectedTab : 0
        };
    }

    createTabClickedHandler = (tab: number) => {
        return () => {
            this.setState({ selectedTab: tab });
        };
    };

    mapTabTitlesToViews = (tabs: Tab[]) => {
        const { selectedTab } = this.state;
        const isSelected = (idx: number) => idx === selectedTab;
        return tabs.map((tab, idx) => {
            return (
                <div
                    key={idx}
                    className={cls("tab", {"tab--selected": isSelected(idx)})}
                    onClick={this.createTabClickedHandler(idx)}
                >
                    <Normaltekst className={cls("tab__title", {"tab__title--selected": isSelected(idx)})}>
                        {tab.title}
                    </Normaltekst>
                    <div className="tab__bar"/>
                </div>
            );
        });
    };

    render() {
        const { tabs } = this.props;
        const { selectedTab } = this.state;
        return (
            <div className="tab-menu">
                <div className="tab-menu__headers--wrapper">
                    <div className="tab-menu__headers">
                        {this.mapTabTitlesToViews(tabs)}
                    </div>
                </div>
                <div className="tab-menu__tab-content">
                    {tabs[selectedTab].content}
                </div>
            </div>
        );
    }
}

export default TabMenu;
