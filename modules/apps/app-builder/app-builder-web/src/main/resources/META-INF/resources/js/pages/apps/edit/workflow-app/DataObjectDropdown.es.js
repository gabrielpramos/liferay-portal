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

import ClayButton from '@clayui/button';
import ClayIcon from '@clayui/icon';
import React, {useContext, useEffect, useRef, useState} from 'react';

import {AppContext} from '../../../../AppContext.es';
import DropDown from '../../../../components/drop-down/DropDown.es';
import useResource from '../../../../hooks/useResource.es';
import isClickOutside from '../../../../utils/clickOutside.es';
import {addItem, getURL} from '../../../../utils/client.es';
import CustomObjectPopover from '../../../custom-object/CustomObjectPopover.es';
import FormViewDropdown from './FormViewDropdown.es';
import TableViewDropdown from './TableViewDropdown.es';

export default () => {
	const {basePortletURL} = useContext(AppContext);
	const customObjectButtonRef = useRef();
	const popoverRef = useRef();
	const [alignElement, setAlignElement] = useState(
		customObjectButtonRef.current
	);
	const [fetchStatuses, setFetchStatuses] = useState([]);
	const [isPopoverVisible, setPopoverVisible] = useState(false);
	const [items, setItems] = useState([]);

	const [selectedValue, setSelectedValue] = useState({
		id: undefined,
		name: undefined,
	});
	const {id: customObjectId, name: customObjectName} = selectedValue;

	const ENDPOINT_APP_BUILDER =
		'/o/data-engine/v2.0/data-definitions/by-content-type/app-builder';
	const ENDPOINT_NATIVE_OBJECTS =
		'/o/data-engine/v2.0/data-definitions/by-content-type/native-object';

	const variables = {keywords: '', page: -1, pageSize: -1, sort: ''};

	const {
		refetch: refetchAppBuilder,
		resource: appBuilderResource = {items: []},
	} = useResource({
		fetchDelay: 0,
		fetchOptions: {
			credentials: 'same-origin',
			method: 'GET',
		},
		link: getURL(ENDPOINT_APP_BUILDER),
		onNetworkStatusChange: (status) =>
			setFetchStatuses(
				fetchStatuses[0] ? fetchStatuses.splice(0, 1, status) : [status]
			),
		variables,
	});

	const {
		refetch: refetchNative,
		resource: nativeObjectsResource = {items: []},
	} = useResource({
		fetchDelay: 0,
		fetchOptions: {
			credentials: 'same-origin',
			method: 'GET',
		},
		link: getURL(ENDPOINT_NATIVE_OBJECTS),
		onNetworkStatusChange: (status) =>
			setFetchStatuses(
				fetchStatuses[1]
					? fetchStatuses.splice(1, 1, status)
					: [...fetchStatuses, status]
			),
		variables,
	});

	const refetch = () => {
		refetchAppBuilder();
		refetchNative();
	};

	useEffect(() => {
		if (appBuilderResource && nativeObjectsResource) {
			setItems(
				[
					...appBuilderResource.items,
					...nativeObjectsResource.items,
				].sort((a, b) => a - b)
			);
		}
	}, [appBuilderResource, nativeObjectsResource]);

	const handleOnSelect = (event, selectedValue) => {
		event.stopPropagation();

		setSelectedValue(selectedValue);
	};

	const handleOnSubmit = ({isAddFormView, name}) => {
		const addURL = `/o/data-engine/v2.0/data-definitions/by-content-type/app-builder`;

		addItem(addURL, {
			availableLanguageIds: ['en_US'],
			dataDefinitionFields: [],
			name: {
				value: name,
			},
		}).then(({id}) => {
			if (isAddFormView) {
				Liferay.Util.navigate(
					Liferay.Util.PortletURL.createRenderURL(basePortletURL, {
						dataDefinitionId: id,
						isAppsPortlet: true,
						mvcRenderCommandName: '/edit_form_view',
						newCustomObject: true,
					})
				);
			}
		});
	};

	const EmptyState = ({customObjectButtonRef, handleOnClick}) => {
		return (
			<div className="empty-state-dropdown-menu">
				<label className="font-weight-light text-secondary">
					{Liferay.Language.get(
						'no-objects-yet-create-your-first-object'
					)}
				</label>

				<ClayButton
					className="emptyButton"
					displayType="secondary"
					onClick={handleOnClick}
					ref={customObjectButtonRef}
				>
					{Liferay.Language.get('new-custom-object')}
				</ClayButton>
			</div>
		);
	};

	const emptyStateOnClick = ({currentTarget}) => {
		setAlignElement(currentTarget);

		if (isPopoverVisible && alignElement !== currentTarget) {
			return;
		}

		setPopoverVisible(!isPopoverVisible);
	};

	useEffect(() => {
		const handler = ({target}) => {
			const isOutside = isClickOutside(
				target,
				customObjectButtonRef.current,
				popoverRef.current
			);

			if (isOutside) {
				setPopoverVisible(false);
			}
		};

		window.addEventListener('click', handler);

		return () => window.removeEventListener('click', handler);
	}, [popoverRef]);

	return (
		<>
			<div className="custom-object-dropdown">
				<label>{Liferay.Language.get('main-data-object')}</label>
				<DropDown
					dropDownStateProps={{
						empty: {
							emptyState: () => (
								<EmptyState
									customObjectButtonRef={
										customObjectButtonRef
									}
									handleOnClick={emptyStateOnClick}
								/>
							),
						},
						error: {
							errorLabel: Liferay.Language.get(
								'failed-to-retrieve-objects'
							),

							retryHandler: refetch,
						},
						loading: {
							loadingLabel: Liferay.Language.get(
								'retrieving-all-objects'
							),
						},
					}}
					fetchStatuses={fetchStatuses}
					items={items}
					label={Liferay.Language.get('select-data-object')}
					onSelect={handleOnSelect}
					trigger={
						<ClayButton
							className="clearfix w-100"
							displayType="secondary"
						>
							<span className="float-left">
								{customObjectName ||
									Liferay.Language.get('select-data-object')}
							</span>

							<ClayIcon
								className="float-right icon"
								symbol="caret-bottom"
							/>
						</ClayButton>
					}
				>
					<DropDown.Search />
				</DropDown>
			</div>

			{customObjectName && (
				<>
					<span className="float-left">
						{Liferay.Language.get('gather-data')}
					</span>

					<FormViewDropdown customObjectId={customObjectId} />

					<span className="float-left">
						{Liferay.Language.get('display-data')}
					</span>

					<TableViewDropdown customObjectId={customObjectId} />
				</>
			)}

			<CustomObjectPopover
				alignElement={alignElement}
				onCancel={() => {
					setPopoverVisible(false);
				}}
				onSubmit={handleOnSubmit}
				ref={popoverRef}
				visible={isPopoverVisible}
			/>
		</>
	);
};
