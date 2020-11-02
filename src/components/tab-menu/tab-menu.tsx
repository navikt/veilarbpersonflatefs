import React, { useEffect, useState } from 'react';
import cls from 'classnames';
import { Normaltekst } from 'nav-frontend-typografi';
import { TabId } from '../side-innhold';
import { lagreSistBesokteTab } from './siste-tab';
import { useEventListener } from '../../utils/utils';
import useUlesteDialoger from './dialog-tab/useAntalUlesteDialoger';
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
    defaultSelectedTab?: TabId;
    skulGammelDialog: boolean;
}

const getIndexOfTab = (tabs: Tab[], tag?: TabId): number => {
    const idx = tabs.findIndex(tab => tab.id === tag);
    return idx >= 0 ? idx : 0;
};

interface MenuProps {
    tabs: Tab[],
    selectedTabIdx: number,
    createTabClickedHandler: (id: TabId) => () => void
}

interface MenuButtonProps {
    title: string,
    tabId: TabId,
    isSelected: boolean,
    onClick: () => void
}

const UlesteDialoger = () => {
    const antallUleste = useUlesteDialoger();

    if (!antallUleste) {
        return null;
    }

    return (
        <span className="tab__title__notification">
            {antallUleste}
            <span className="sr-only"> uleste</span>
        </span>
    );
};

const MenuButton = (props: MenuButtonProps) => {

    const {title, isSelected, onClick, tabId} = props;

    return (<button
        className={cls('tab', {'tab--selected': isSelected})}
        onClick={onClick}
        aria-expanded={isSelected}
    >
        <Normaltekst className={cls('tab__title', {'tab__title--selected': isSelected})}>
            {title}
            {tabId === TabId.DIALOG && <UlesteDialoger />}
        </Normaltekst>
    </button>);
};

const Menu = (props: MenuProps) => {
    const {tabs, selectedTabIdx, createTabClickedHandler} = props;
    const isSelected = (idx: number) => idx === selectedTabIdx;
    const buttons = tabs.map((tab, idx) => (
        <MenuButton key={idx} title={tab.title} isSelected={isSelected(idx)} onClick={createTabClickedHandler(tab.id)} tabId={tab.id}/>));

    return (
        <div className="tab-menu__headers--wrapper">
            <div className="tab-menu__headers">
                <div className="tab-menu__headers--hoire">{buttons}</div>
            </div>
        </div>
    )
};

interface ContentProps {
    selectedTabIdx: number,
    tabsSeen: number[],
    tabs: Tab[]
}

const Content = (props: ContentProps) => {
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
        if (!tabsSeen.includes(index)) {
            setTabsSeen([...tabsSeen, index]);
        }
        setSelectedTabIdx(index);
    };

    const changeTab = (id: TabId, extraDetails?: Event) => {
        const index: number = tabs.findIndex(tab => tab.id === id);
        lagreSistBesokteTab({fnr, tab: id});
        setCurrentTab(index);

        const extra = !!extraDetails ? (extraDetails as CustomEvent).detail : {};
        window.dispatchEvent(new CustomEvent('veilarbpersonflatefs.tab-clicked', { detail: { tabId: id, ...extra } }));
    };

    const createTabClickedHandler = (id: TabId) => () => changeTab(id);

    useEventListener('visAktivitetsplan', () => changeTab(TabId.AKTIVITETSPLAN));
    useEventListener('visDialog', (event) => changeTab(TabId.DIALOG, event));

    return (
        <div className="tab-menu">
            <Menu tabs={tabs} selectedTabIdx={selectedTabIdx} createTabClickedHandler={createTabClickedHandler}/>
            <Content selectedTabIdx={selectedTabIdx} tabsSeen={tabsSeen} tabs={tabs}/>
        </div>
    );
}

export default TabMenu;
