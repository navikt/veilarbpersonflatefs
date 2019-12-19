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
	defaultSelectedTab?: TabId;
}

interface TabsState {
	selectedTabIdx: number;
	tabsSeen: number[];
}

class TabMenu extends React.Component<TabsProps, TabsState> {
	constructor(props: TabsProps) {
		super(props);
		const defaultSelectedTabIdx = this.getIndexOfTab(props.tabs, props.defaultSelectedTab);

		if (props.defaultSelectedTab) {
			document.title = props.tabs[defaultSelectedTabIdx].title;
		}

		this.state = {
			selectedTabIdx: defaultSelectedTabIdx,
			tabsSeen: [defaultSelectedTabIdx]
		};
	}

	getIndexOfTab = (tabs: Tab[], tag: TabId | undefined): number => {
		const idx = tabs.findIndex(tab => tab.id === tag);
		return idx >= 0 ? idx : 0;
	};

	createTabClickedHandler = (tab: number) => {
		return () => {
			const { tabs, fnr } = this.props;
			const clickedTab = tabs[tab];

			document.title = clickedTab.title;
			lagreSistBesokteTab({ fnr, tab: clickedTab.id });

			this.setState(state => {
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
					className={cls('tab', { 'tab--selected': isSelected(idx) })}
					onClick={this.createTabClickedHandler(idx)}
				>
					<Normaltekst className={cls('tab__title', { 'tab__title--selected': isSelected(idx) })}>
						{tab.title}
					</Normaltekst>
					<div className="tab__bar" />
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
					className={cls('tab-menu__tab-content', tab.className, { 'no-display': idx !== selectedTabIdx })}
					key={idx}
				>
					{tabs[idx].content}
				</div>
			);
		});
	};

	render() {
		const { tabs } = this.props;
		return (
			<div className="tab-menu">
				<div className="tab-menu__headers--wrapper">
					<div className="tab-menu__headers">
						<div>{this.mapTabTitlesToViews(tabs)}</div>
						<DialogTab />
					</div>
				</div>
				{this.createTabContents()}
			</div>
		);
	}
}

export default TabMenu;
