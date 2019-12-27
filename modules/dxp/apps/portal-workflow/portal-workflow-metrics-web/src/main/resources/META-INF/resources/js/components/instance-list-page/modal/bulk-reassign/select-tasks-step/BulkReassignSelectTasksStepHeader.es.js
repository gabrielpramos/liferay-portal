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
import React, {useEffect, useState, useContext, useCallback} from 'react';

import PromisesResolver from '../../../../../shared/components/request/PromisesResolver.es';
import {sub} from '../../../../../shared/util/lang.es';
import {BulkReassignModalContext} from '../BulkReassignModal.es';

const Header = ({items}) => {
	const {bulkReassignData, setBulkReassignData} = useContext(
		BulkReassignModalContext
	);

	const [selectAll, setSelectAll] = useState(false);
	const [toolbarOptions, setToolbarOptions] = useState({
		active: false,
		indeterminateCheckbox: false
	});

	const {selectedTasks} = bulkReassignData;

	useEffect(() => {
		const selected = selectedTasks.length > 0;
		const active = selectAll || selected;
		const label = !active ? Liferay.Language.get('select-all') : '';
		setSelectAll(items.length > 0 && items.length === selectedTasks.length);
		setToolbarOptions({
			active: selectAll || selected,
			indeterminateCheckbox: !selectAll && selected,
			label: selectAll ? Liferay.Language.get('all-selected') : label
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [items, selectedTasks, selectAll]);

	const handleSelectAll = useCallback(
		all => {
			setSelectAll(all);
			setBulkReassignData({
				...bulkReassignData,
				selectedTasks: all ? items : []
			});
		},
		[bulkReassignData, items, setBulkReassignData]
	);

	return (
		<PromisesResolver.Resolved>
			<ClayManagementToolbar
				active={toolbarOptions.active}
				className={`${
					!toolbarOptions.active ? 'border-bottom' : ''
				} mb-0`}
			>
				<ClayManagementToolbar.ItemList>
					<ClayManagementToolbar.Item
						className="ml-3"
						style={{padding: '1.2rem 0'}}
					>
						<ClayCheckbox
							checked={toolbarOptions.active}
							indeterminate={toolbarOptions.indeterminateCheckbox}
							label={toolbarOptions.label}
							onChange={({target}) =>
								handleSelectAll(target.checked)
							}
						/>
					</ClayManagementToolbar.Item>

					{toolbarOptions.active && !selectAll && (
						<>
							<ClayManagementToolbar.Item>
								<span className="ml-0 mr-0 navbar-text">
									{sub(
										Liferay.Language.get(
											'x-of-x-items-selected'
										),
										[selectedTasks.length, items.length]
									)}
								</span>
							</ClayManagementToolbar.Item>

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
						</>
					)}
				</ClayManagementToolbar.ItemList>
			</ClayManagementToolbar>
		</PromisesResolver.Resolved>
	);
};

export {Header};
