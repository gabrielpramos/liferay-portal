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

import Button from '@clayui/button';
import React, {useContext, useRef, useState} from 'react';

import {AppContext} from '../../AppContext.es';
import DropDown from '../../components/drop-down/DropDown.es';
import Popover from '../../components/popover/Popover.es';
import {addItem} from '../../utils/client.es';
import CustomObjectPopover from '../custom-object/CustomObjectPopover.es';

const ListAppsPopover = ({
	alignElement,
	forwardRef,
	onCancel,
	onSubmit,
	visible,
}) => {
	const {basePortletURL} = useContext(AppContext);
	const objectInputRef = useRef();
	const customObjectButtonRef = useRef();
	const popoverRef = useRef();

	const [emptyAlignElement, setEmptyAlignElement] = useState(
		customObjectButtonRef.current
	);
	const [isPopoverVisible, setPopoverVisible] = useState(false);

	const resetForm = () => {
		objectInputRef.current.value = '';
	};

	const EMPTY_PROPS = {
		customObjectButtonRef,
		emptyButtonOnClick: ({currentTarget}) => {
			setEmptyAlignElement(currentTarget);

			if (isPopoverVisible && emptyAlignElement !== currentTarget) {
				return;
			}

			setPopoverVisible(!isPopoverVisible);
		},
		emptyStateButton: Liferay.Language.get('new-custom-object'),
		emptyStateLabel: Liferay.Language.get(
			'no-objects-yet-create-your-first-object'
		),
	};

	const ERROR_PROPS = {
		errorButtonOnClick: {
			//retry
		},
		errorStateButton: Liferay.Language.get('retry'),
		errorStateLabel: Liferay.Language.get('failed-to-retrieve-objects'),
	};

	const LOADING_PROPS = {
		loadingStateLabel: Liferay.Language.get('retrieving-all-objects'),
	};

	const handleOnCancel = () => setPopoverVisible(false);

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

	return (
		<>
			<Popover
				alignElement={alignElement}
				className="apps-popover mw-100"
				content={() => (
					<>
						<label>{Liferay.Language.get('object')}</label>
						<DropDown
							displayType="secondary"
							emptyProps={EMPTY_PROPS}
							errorProps={ERROR_PROPS}
							items={[]}
							label={Liferay.Language.get('select-object')}
							loadingProps={LOADING_PROPS}
						>
							<DropDown.Search />
						</DropDown>
					</>
				)}
				footer={() => (
					<div className="border-top mt-3 p-3" style={{width: 450}}>
						<div className="d-flex justify-content-end">
							<Button
								className="mr-3"
								displayType="secondary"
								onClick={() => {
									resetForm();

									onCancel();
								}}
								small
							>
								{Liferay.Language.get('cancel')}
							</Button>

							<Button
								onClick={() => {
									onSubmit(objectInputRef.current.value);
								}}
								small
							>
								{Liferay.Language.get('continue')}
							</Button>
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
				onCancel={handleOnCancel}
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
