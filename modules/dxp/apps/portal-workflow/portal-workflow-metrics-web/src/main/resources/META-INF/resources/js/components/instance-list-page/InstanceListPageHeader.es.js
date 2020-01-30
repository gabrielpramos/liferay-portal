/**
 * Copyright (c) 2000-present Liferay, Inc. All rights reserved.
 *
 * The contents of this file are subject to the terms of the Liferay Enterprise
 * Subscription License ("License"). You may not use this file except in
 * compliance with the License. You can obtain a copy of the License by
 * contacting Liferay, Inc. See the License for the specific language governing
 * permissions and limitations under the License, including but not limited to
 * distribution rights of the Software.
 */

import {ClayCheckbox} from '@clayui/form';
import ClayManagementToolbar from '@clayui/management-toolbar';
import React, {
	useContext,
	useState,
	useEffect,
	useCallback,
	useMemo
} from 'react';

import filterConstants from '../../shared/components/filter/util/filterConstants.es';
import QuickActionKebab from '../../shared/components/quick-action-kebab/QuickActionKebab.es';
import ResultsBar from '../../shared/components/results-bar/ResultsBar.es';
import {sub} from '../../shared/util/lang.es';
import AssigneeFilter from '../filter/AssigneeFilter.es';
import ProcessStatusFilter, {
	processStatusConstants
} from '../filter/ProcessStatusFilter.es';
import ProcessStepFilter from '../filter/ProcessStepFilter.es';
import SLAStatusFilter from '../filter/SLAStatusFilter.es';
import TimeRangeFilter from '../filter/TimeRangeFilter.es';
import {ModalContext} from './modal/ModalContext.es';
import {InstanceListContext} from './store/InstanceListPageStore.es';

const Header = ({
	dispatch,
	items,
	routeParams,
	selectedFilters,
	totalCount
}) => {
	const {
		selectAll,
		selectedItems,
		setSelectAll,
		setSelectedItems
	} = useContext(InstanceListContext);
	const {bulkModal, setBulkModal, setSingleModal} = useContext(ModalContext);

	const [toolbarOptions, setToolbarOptions] = useState({
		active: false,
		indeterminateCheckbox: false
	});

	const kebabItems = [
		{
			action: () => {
				if (
					selectedItems.length > 1 ||
					selectedItems[0].taskNames.length > 1
				) {
					setBulkModal({...bulkModal, visible: true});
				} else {
					setSingleModal({
						selectedItem: selectedItems[0],
						visible: true
					});
				}
			},
			icon: 'change',
			title: Liferay.Language.get('reassign-task')
		}
	];

	useEffect(() => {
		const active = selectedItems.length > 0;

		const label = selectAll ? Liferay.Language.get('all-selected') : '';

		const selectedOnPage = selectedItems.filter(item =>
			items.find(({id}) => id === item.id)
		);
		const allPageSelected = items && items.length === selectedOnPage.length;

		setSelectAll(totalCount > 0 && totalCount === selectedItems.length);

		setToolbarOptions({
			active,
			checked: items && items.length > 0 && allPageSelected,
			indeterminateCheckbox: !allPageSelected && !selectAll && active,
			label
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [items, selectedItems, selectAll]);

	const handleSelectAll = useCallback(
		checked => {
			let updatedItems;

			if (checked) {
				updatedItems = [
					...selectedItems,
					...items.filter(
						item => !selectedItems.find(({id}) => item.id === id)
					)
				];
			} else {
				updatedItems = selectedItems.filter(
					item => !items.find(({id}) => item.id === id)
				);
			}

			setSelectedItems(updatedItems);
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[items, selectedItems]
	);

	const statusesFilterItem = useMemo(
		() => selectedFilters.find(filter => filter.key === 'statuses'),
		[selectedFilters]
	);
	const {name} = statusesFilterItem ? statusesFilterItem.items[0] : {};
	const completedStatusSelected = useMemo(
		() =>
			selectedFilters.length > 0 && statusesFilterItem
				? name === processStatusConstants.completed
				: false,
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[name]
	);

	const selectedFilterItems = useMemo(
		() =>
			selectedFilters.filter(
				filter =>
					completedStatusSelected ||
					filter.key !== filterConstants.timeRange.key
			),
		[completedStatusSelected, selectedFilters]
	);

	const timeRangeStyle = completedStatusSelected
		? {display: 'inherit'}
		: {display: 'none'};

	return (
		<>
			<ClayManagementToolbar
				active={toolbarOptions.active}
				className="show-quick-actions-on-hover"
			>
				<ClayManagementToolbar.ItemList>
					<ClayManagementToolbar.Item
						className="ml-2"
						style={{padding: '1.2rem 0'}}
					>
						<ClayCheckbox
							checked={toolbarOptions.checked}
							data-testid="checkAllButton"
							indeterminate={toolbarOptions.indeterminateCheckbox}
							label={toolbarOptions.label}
							onChange={({target}) => {
								handleSelectAll(target.checked);
							}}
						/>
					</ClayManagementToolbar.Item>

					{!toolbarOptions.active ? (
						<>
							<ClayManagementToolbar.Item>
								<strong className="ml-0 mr-0 navbar-text">
									{Liferay.Language.get('filter-by')}
								</strong>
							</ClayManagementToolbar.Item>

							<SLAStatusFilter
								dispatch={dispatch}
								processId={routeParams.processId}
							/>

							<ProcessStatusFilter
								dispatch={dispatch}
								processId={routeParams.processId}
							/>

							<TimeRangeFilter
								dispatch={dispatch}
								options={{
									withSelectionTitle: false
								}}
								processId={routeParams.processId}
								style={timeRangeStyle}
							/>

							<ProcessStepFilter
								dispatch={dispatch}
								processId={routeParams.processId}
							/>

							<AssigneeFilter
								dispatch={dispatch}
								processId={routeParams.processId}
							/>
						</>
					) : (
						!selectAll && (
							<>
								<ClayManagementToolbar.Item>
									<span className="ml-0 mr-0 navbar-text">
										{sub(
											Liferay.Language.get(
												'x-of-x-items-selected'
											),
											[selectedItems.length, totalCount]
										)}
									</span>
								</ClayManagementToolbar.Item>

								<ClayManagementToolbar.Item>
									<button
										className="btn btn-link btn-sm font-weight-bold pl-0 text-primary"
										data-testid="selectRemainingButton"
										onClick={() => {
											handleSelectAll(true);
										}}
									>
										{Liferay.Language.get(
											'select-all-remaining-items'
										)}
									</button>
								</ClayManagementToolbar.Item>
							</>
						)
					)}
				</ClayManagementToolbar.ItemList>

				{toolbarOptions.active && (
					<ClayManagementToolbar.Item>
						<div
							className="autofit-col"
							data-testid="headerQuickAction"
						>
							<QuickActionKebab items={kebabItems} />
						</div>
					</ClayManagementToolbar.Item>
				)}
			</ClayManagementToolbar>

			{selectedFilterItems.length > 0 && (
				<ResultsBar>
					<ResultsBar.TotalCount
						search={routeParams.search}
						totalCount={totalCount}
					/>

					<ResultsBar.FilterItems
						filters={selectedFilterItems}
						{...routeParams}
					/>

					<ResultsBar.Clear
						filters={selectedFilters}
						{...routeParams}
					/>
				</ResultsBar>
			)}
		</>
	);
};

export {Header};
