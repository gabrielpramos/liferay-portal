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
import {useResource} from '@clayui/data-provider';
import ClayIcon from '@clayui/icon';
import React, {useContext, useRef, useState} from 'react';

import {AppContext} from '../../AppContext.es';
import DropDown from '../../components/drop-down/DropDown.es';
import Popover from '../../components/popover/Popover.es';
import {addItem} from '../../utils/client.es';
import CustomObjectPopover from '../custom-object/CustomObjectPopover.es';

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

const ListAppsPopover = ({
	alignElement,
	forwardRef,
	onCancel,
	onContinue,
	visible,
}) => {
	const {basePortletURL} = useContext(AppContext);
	const customObjectButtonRef = useRef();
	const popoverRef = useRef();

	const [emptyAlignElement, setEmptyAlignElement] = useState(
		customObjectButtonRef.current
	);
	const [fetchStatus] = useState();
	const [isPopoverVisible, setPopoverVisible] = useState(false);
	const [dropDownValue, setDropDownValue] = useState('');

	const ENDPOINT_APP_BUILDER =
		'/o/data-engine/v2.0/data-definitions/by-content-type/app-builder';
	const ENDPOINT_NATIVE_OBJECTS =
		'/o/data-engine/v2.0/data-definitions/by-content-type/native-object';

	const {refetch, resource: resourceAppBuilder} = useResource({
		fetchDelay: 0,
		fetchOptions: {
			credentials: 'same-origin',
			method: 'GET',
		},
		link: getURL(ENDPOINT_APP_BUILDER),
		onNetworkStatusChange: (status) => setFetchStatus(status),
	});

	const {refetch, resource: resourceNativeObjects} = useResource({
		fetchDelay: 0,
		fetchOptions: {
			credentials: 'same-origin',
			method: 'GET',
		},
		link: getURL(ENDPOINT_NATIVE_OBJECTS),
		onNetworkStatusChange: (status) => setFetchStatus(status),
	});

	useEffect(() => {}, [resourceAppBuilder]);

	const handleOnSelect = (event) => {
		event.stopPropagation();

		setDropDownValue(event.currentTarget.textContent);
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
						mvcRenderCommandName: '/edit_form_view',
						newCustomObject: true,
					})
				);
			} else {
				history.push(`/custom-object/${id}/form-views/`);
			}
		});
	};

	const emptyStateOnClick = (event) => {
		setEmptyAlignElement(event.currentTarget);

		if (emptyAlignElement === event.currentTarget) {
			setPopoverVisible(!isPopoverVisible);
		}
	};

	return (
		<>
			<Popover
				alignElement={alignElement}
				className="apps-popover mw-100"
				content={() => (
					<>
						<label>{Liferay.Language.get('object')}</label>
						<DropDown
							emptyState={() => (
								<EmptyState
									customObjectButtonRef={
										customObjectButtonRef
									}
									handleOnClick={emptyStateOnClick}
								/>
							)}
							fetchStatus={fetchStatus}
							label={Liferay.Language.get('select-object')}
							onSelect={handleOnSelect}
							trigger={
								<ClayButton
									className="clearfix w-100"
									displayType="secondary"
								>
									<span className="float-left">
										{dropDownValue ||
											Liferay.Language.get(
												'select-object'
											)}
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
					</>
				)}
				footer={() => (
					<div className="border-top mt-3 p-3" style={{width: 450}}>
						<div className="d-flex justify-content-end">
							<ClayButton
								className="mr-3"
								displayType="secondary"
								onClick={() => {
									setDropDownValue('');

									onCancel();
								}}
								small
							>
								{Liferay.Language.get('cancel')}
							</ClayButton>

							<ClayButton
								disabled={!dropDownValue}
								onClick={() => {
									onContinue(dropDownValue);
								}}
								small
							>
								{Liferay.Language.get('continue')}
							</ClayButton>
						</div>
					</div>
				)}
				ref={forwardRef}
				showArrow={false}
				title={() => (
					<>
						<h4 className="mb-3">
							{Liferay.Language.get('new-app')}
						</h4>

						<span className="font-weight-light text-secondary">
							{Liferay.Language.get(
								'create-an-app-to-manage-the-data-of-an-object'
							)}
						</span>
					</>
				)}
				visible={visible}
			/>

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

export default React.forwardRef((props, ref) => (
	<ListAppsPopover {...props} forwardRef={ref} />
));
