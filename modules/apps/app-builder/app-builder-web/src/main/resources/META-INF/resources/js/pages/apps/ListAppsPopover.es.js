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
import React, {useRef} from 'react';

import DropDown from '../../components/drop-down/DropDown.es';
import Popover from '../../components/popover/Popover.es';

const ListAppsPopover = ({
	alignElement,
	forwardRef,
	onCancel,
	onSubmit,
	visible,
}) => {
	const objectInputRef = useRef();

	const resetForm = () => {
		objectInputRef.current.value = '';
	};

	return (
		<Popover
			alignElement={alignElement}
			className="apps-popover mw-100"
			content={() => (
				<>
					<label>{Liferay.Language.get('object')}</label>
					<DropDown
						displayType="secondary"
						items={[{label: 'nome'}]}
						label={Liferay.Language.get('select-object')}
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
					<h4 className="mb-3">{Liferay.Language.get('new-app')}</h4>

					<span className="font-weight-light text-secondary">
						{Liferay.Language.get(
							'create-an-app-to-manage-the-data-of-an-object'
						)}
					</span>
				</>
			)}
			visible={visible}
		/>
	);
};

export default React.forwardRef((props, ref) => (
	<ListAppsPopover {...props} forwardRef={ref} />
));
