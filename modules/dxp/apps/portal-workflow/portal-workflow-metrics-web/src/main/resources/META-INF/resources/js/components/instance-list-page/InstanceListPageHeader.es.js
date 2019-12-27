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
import React, {useContext, useState, useEffect} from 'react';

import FilterResultsBar from '../../shared/components/filter/FilterResultsBar.es';
import {filterKeys} from '../../shared/components/filter/util/filterConstants.es';
import {asFilterObject} from '../../shared/components/filter/util/filterUtil.es';
import QuickActionKebab from '../../shared/components/quick-action-kebab/QuickActionKebab.es';
import Request from '../../shared/components/request/Request.es';
import {sub} from '../../shared/util/lang.es';
import AssigneeFilter from '../process-metrics/filter/AssigneeFilter.es';
import ProcessStatusFilter from '../process-metrics/filter/ProcessStatusFilter.es';
import ProcessStepFilter from '../process-metrics/filter/ProcessStepFilter.es';
import SLAStatusFilter from '../process-metrics/filter/SLAStatusFilter.es';
import {TimeRangeFilter} from '../process-metrics/filter/TimeRangeFilter.es';
import {AssigneeContext} from '../process-metrics/filter/store/AssigneeStore.es';
import {ProcessStatusContext} from '../process-metrics/filter/store/ProcessStatusStore.es';
import {ProcessStepContext} from '../process-metrics/filter/store/ProcessStepStore.es';
import {SLAStatusContext} from '../process-metrics/filter/store/SLAStatusStore.es';
import {TimeRangeContext} from '../process-metrics/filter/store/TimeRangeStore.es';
import {BulkReassignModalContext} from './modal/bulk-reassign/BulkReassignModal.es';
import {SingleReassignModalContext} from './modal/single-reassign/SingleReassignModal.es';
import {InstanceListContext} from './store/InstanceListPageStore.es';

const Header = () => {
	const {
		items,
		selectAll,
		selectedItems,
		setSelectAll,
		setSelectedItems,
		totalCount
	} = useContext(InstanceListContext);
	const {assignees} = useContext(AssigneeContext);
	const {bulkReassignData, setBulkReassignData} = useContext(
		BulkReassignModalContext
	);
	const {isCompletedStatusSelected, processStatuses} = useContext(
		ProcessStatusContext
	);
	const {processSteps} = useContext(ProcessStepContext);
	const {setShowModal} = useContext(SingleReassignModalContext);
	const {slaStatuses} = useContext(SLAStatusContext);
	const {timeRanges} = useContext(TimeRangeContext);

	const [toolbarOptions, setToolbarOptions] = useState({
		active: false,
		indeterminateCheckbox: false
	});

	const completedStatusSelected = isCompletedStatusSelected();

	const kebabItems = [
		{
			action: () => {
				if (selectedItems.length > 1) {
					setBulkReassignData({...bulkReassignData, visible: true});
				} else {
					setShowModal({
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
		const selectedOnPage = selectedItems.filter(item =>
			items.find(({id}) => id === item.id)
		);
		const allPageSelected = items.length === selectedOnPage.length;

		setSelectAll(totalCount > 0 && totalCount === selectedItems.length);

		setToolbarOptions({
			active: selectedItems.length > 0,
			checked: items.length > 0 && allPageSelected,
			indeterminateCheckbox:
				!allPageSelected && !selectAll && selectedItems.length > 0
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [items, selectedItems, selectAll]);

	const getFilters = () => {
		const filters = [
			asFilterObject(
				slaStatuses,
				filterKeys.slaStatus,
				Liferay.Language.get('sla-status')
			),
			asFilterObject(
				processStatuses,
				filterKeys.processStatus,
				Liferay.Language.get('process-status')
			)
		];

		if (completedStatusSelected) {
			filters.push(
				asFilterObject(
					timeRanges,
					filterKeys.timeRange,
					Liferay.Language.get('completion-period'),
					true
				)
			);
		}

		filters.push(
			asFilterObject(
				processSteps,
				filterKeys.processStep,
				Liferay.Language.get('process-step')
			)
		);

		filters.push(
			asFilterObject(
				assignees,
				filterKeys.assignee,
				Liferay.Language.get('assignees')
			)
		);

		return filters;
	};

	const handleSelectAll = checked => {
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
	};

	return (
		<Request.Success>
			<ClayManagementToolbar
				active={toolbarOptions.active}
				className="show-quick-actions-on-hover"
			>
				<ClayManagementToolbar.ItemList>
					<ClayManagementToolbar.Item className="ml-2">
						<ClayCheckbox
							checked={toolbarOptions.checked}
							indeterminate={toolbarOptions.indeterminateCheckbox}
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

							<SLAStatusFilter />

							<ProcessStatusFilter />

							{completedStatusSelected && <TimeRangeFilter />}

							<ProcessStepFilter />

							<AssigneeFilter />
						</>
					) : (
						<>
							<ClayManagementToolbar.Item>
								<span className="ml-0 mr-0 navbar-text">
									{selectAll
										? Liferay.Language.get('all-selected')
										: sub(
												Liferay.Language.get(
													'x-of-x-items-selected'
												),
												[
													selectedItems.length,
													totalCount
												]
										  )}
								</span>
							</ClayManagementToolbar.Item>

							{!selectAll && (
								<ClayManagementToolbar.Item>
									<button
										className="btn btn-link btn-sm font-weight-bold pl-0 text-primary"
										onClick={() => {
											handleSelectAll(true);
										}}
									>
										{Liferay.Language.get(
											'select-all-remanining-items'
										)}
									</button>
								</ClayManagementToolbar.Item>
							)}
						</>
					)}
				</ClayManagementToolbar.ItemList>

				{toolbarOptions.active && (
					<ClayManagementToolbar.Item>
						<div className="autofit-col">
							<QuickActionKebab items={kebabItems} />
						</div>
					</ClayManagementToolbar.Item>
				)}
			</ClayManagementToolbar>

			<FilterResultsBar filters={getFilters()} totalCount={totalCount} />
		</Request.Success>
	);
};

export {Header};
