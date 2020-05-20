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
import React, {useState} from 'react';

import DropDown from '../../../../components/drop-down/DropDown.es';
import {useRequest} from '../../../../hooks/index.es';

export default ({customObjectId}) => {
	const [selectedValue, setSelectedValue] = useState({
		id: undefined,
		name: undefined,
	});
	const {id: formViewId, name: formViewName} = selectedValue;

	const ENDPOINT_FORM_VIEWS = `/o/data-engine/v2.0/data-definitions/${customObjectId}/data-layouts`;

	const {
		response: {items = []},
	} = useRequest(ENDPOINT_FORM_VIEWS);

	const handleOnSelect = (event, selectedValue) => {
		event.stopPropagation();

		setSelectedValue(selectedValue);
	};

	return (
		<div className="custom-object-dropdown">
			<label>{Liferay.Language.get('form-view')}</label>
			<DropDown
				items={items}
				label={Liferay.Language.get('select-form-view')}
				onSelect={handleOnSelect}
				trigger={
					<ClayButton
						className="clearfix w-100"
						displayType="secondary"
					>
						<span className="float-left">
							{formViewName ||
								Liferay.Language.get('select-form-view')}
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
	);
};
