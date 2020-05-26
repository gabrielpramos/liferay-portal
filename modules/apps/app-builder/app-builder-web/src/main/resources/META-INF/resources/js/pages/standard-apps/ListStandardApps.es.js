/**
 * Copyright (c) 2000-present Liferay, Inc. All rights reserved.
 *
 * This library is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Lesser General Public License as published by the Free
 * Software Foundation; either version 2.1 of the License, or (at your option)
 * any later version.
 *
 * This library is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more
 * details.
 */

import ClayPopover from '@clayui/popover';
import React, {useContext, useEffect, useRef, useState} from 'react';

import {AppContext} from '../../AppContext.es';
import Button from '../../components/button/Button.es';
import isClickOutside from '../../utils/clickOutside.es';
import ListApps from '../apps/ListApps.es';
import {COLUMNS, FILTERS} from '../apps/constants.es';
import NewAppPopover from './NewAppPopover.es';

export default ({scope, ...restProps}) => {
	const {userId} = useContext(AppContext);
	const popoverRef = useRef();

	const [alignElement, setAlignElement] = useState();
	const [isPopoverVisible, setPopoverVisible] = useState(false);
	const [showTooltip, setShowTooltip] = useState(false);

	const onClickAddButton = (event) => {
		event.stopPropagation();

		setAlignElement(event.target);
		setPopoverVisible(!isPopoverVisible);
		setShowTooltip(false);
	};

	const onHoverAddButton = (withTooltip) => ({target}) => {
		setShowTooltip(withTooltip);

		if (!isPopoverVisible) {
			setAlignElement(target);
		}
	};

	useEffect(() => {
		const handler = ({target}) => {
			if (isClickOutside(target, popoverRef.current)) {
				setPopoverVisible(false);
			}
		};

		window.addEventListener('click', handler);

		return () => window.removeEventListener('click', handler);
	}, [popoverRef]);

	const [firstColumn, ...otherColumns] = COLUMNS;

	const columns = [
		firstColumn,
		{
			key: 'dataDefinitionName',
			value: Liferay.Language.get('object'),
		},
		...otherColumns,
	];

	const emptyState = {
		button: () => (
			<Button
				displayType="secondary"
				onClick={onClickAddButton}
				onMouseOver={onHoverAddButton()}
				tooltip={Liferay.Language.get(
					'create-an-app-to-manage-the-data-of-an-object'
				)}
			>
				{Liferay.Language.get('create-new-app')}
			</Button>
		),
		description: Liferay.Language.get(
			'standard-are-apps-to-managed-the-data-of-an-object'
		),
		title: Liferay.Language.get('no-standard-apps-yet'),
	};

	const filters = [
		...FILTERS,
		{
			items: [
				{
					label: Liferay.Language.get('me'),
					value: userId,
				},
			],
			key: 'userIds',
			multiple: true,
			name: 'author',
		},
	];

	return (
		<>
			<ListApps
				listViewProps={{
					addButton: () => (
						<ClayPopover
							alignPosition="bottom-right"
							header={Liferay.Language.get('standard-app')}
							show={showTooltip && !isPopoverVisible}
							trigger={
								<Button
									className="nav-btn nav-btn-monospaced"
									onClick={onClickAddButton}
									onMouseOut={() => setShowTooltip(false)}
									onMouseOver={onHoverAddButton(true)}
									symbol="plus"
								/>
							}
						>
							{Liferay.Language.get(
								'create-an-app-to-manage-the-data-of-an-object'
							)}
						</ClayPopover>
					),
					columns,
					emptyState,
					endpoint: `/o/app-builder/v1.0/apps?scope=${scope}`,
					filters,
				}}
				{...restProps}
			/>

			<NewAppPopover
				alignElement={alignElement}
				onCancel={() => setPopoverVisible(false)}
				ref={popoverRef}
				setVisible={setPopoverVisible}
				visible={isPopoverVisible}
				{...restProps}
			/>
		</>
	);
};
