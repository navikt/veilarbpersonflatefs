import React, {useEffect, useState} from 'react';
import cls from 'classnames';
import {Normaltekst} from 'nav-frontend-typografi';
import {TabId} from '../side-innhold';
import DialogTab from './dialog-tab/dialog-tab';
import {lagreSistBesokteTab} from './siste-tab';
import './tab-menu.less';
import {useEventListener} from "../../utils/utils";

export interface Tab {
    id: TabId;
    title: string;
    content: React.ReactElement;
    className?: string;
}

interface TabsProps {
    fnr: string;
    tabs: Tab[];
    defaultSelectedTab?: TabId;
}

const getIndexOfTab = (tabs: Tab[], tag?: TabId): number => {
    const idx = tabs.findIndex(tab => tab.id === tag);
    return idx >= 0 ? idx : 0;
};

interface MenuProps {
    tabs: Tab[],
    selectedTabIdx: number,
    createTabClickedHandler: (index: number, id: TabId) => () => void
}

interface MenuButtonProps {
    title: string,
    isSelected: boolean,
    onClick: () => void
}

const MenuButton = (props: MenuButtonProps) => {

    const {title, isSelected, onClick} = props;

    return (<button
        className={cls('tab', {'tab--selected': isSelected})}
        onClick={onClick}
    >
        <Normaltekst className={cls('tab__title', {'tab__title--selected': isSelected})}>
            {title}
        </Normaltekst>
        <div className="tab__bar"/>
    </button>);
};

const Menu = (props: MenuProps) => {
    const {tabs, selectedTabIdx, createTabClickedHandler} = props;
    const isSelected = (idx: number) => idx === selectedTabIdx;
    const buttons = tabs.map((tab, idx) => (
        <MenuButton title={tab.title} isSelected={isSelected(idx)} onClick={createTabClickedHandler(idx, tab.id)}/>));

    return (
        <div className="tab-menu__headers--wrapper">
            <div className="tab-menu__headers">
                <div>{buttons}</div>
                <DialogTab/>
            </div>
        </div>
    )
};

interface ContetnProps {
    selectedTabIdx: number,
    tabsSeen: number[],
    tabs: Tab[]
}

const Content = (props: ContetnProps) => {
    const {selectedTabIdx, tabsSeen, tabs} = props;

    const content = tabs.map((tab, idx) => {
        // If the tab has been seen before, then it should still be rendered, but not displayed
        if (tabsSeen.findIndex(t => t === idx) === -1) {
            return null;
        }

        return (
            <div
                className={cls('tab-menu__tab-content', tab.className, {'no-display': idx !== selectedTabIdx})}
                key={idx}
            >
                {tabs[idx].content}
            </div>
        );
    });

    return <> {content} </>
};

function TabMenu(props: TabsProps) {
    const {fnr, tabs, defaultSelectedTab} = props;

    const [selectedTabIdx, setSelectedTabIdx] = useState(getIndexOfTab(tabs, defaultSelectedTab));
    const [tabsSeen, setTabsSeen] = useState([selectedTabIdx]);

    useEffect(() => {
        document.title = tabs[selectedTabIdx].title;
    }, [selectedTabIdx, tabs]);

    const setCurrentTab = (index: number) => {
        setSelectedTabIdx(index);
        if (!tabsSeen.includes(index)) {
            tabsSeen.push(index);
            setTabsSeen(tabsSeen);
        }
    };

    const findTabIndex = (id: TabId) => tabs.findIndex(tab => tab.id === id);

    useEventListener('visAktivitetsplan', () => setCurrentTab(findTabIndex(TabId.AKTIVITETSPLAN)));
    useEventListener('visDialog', () => setCurrentTab(findTabIndex(TabId.DIALOG)));

    const createTabClickedHandler = (index: number, id: TabId) => () => {
        lagreSistBesokteTab({fnr, tab: id});
        setCurrentTab(index)
    };

    return (
        <div className="tab-menu">
            <Menu tabs={tabs} selectedTabIdx={selectedTabIdx} createTabClickedHandler={createTabClickedHandler}/>
            <Content selectedTabIdx={selectedTabIdx} tabsSeen={tabsSeen} tabs={tabs}/>
        </div>

    );
}

export default TabMenu;
