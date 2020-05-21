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
import React, {useEffect, useRef, useState} from 'react';

import {request} from '../../../../utils/client.es';
import DropDownWithSearch from '../../DropDownWithSearch.es';

export default ({customObjectId, label, onSelect, selectedvalue}) => {
	const [fetchState, setFetchState] = useState({isLoading: true});
	const [items, setItems] = useState([]);

	const selectRef = useRef();

	const options = {
		endpoint: `/o/data-engine/v2.0/data-definitions/${customObjectId}/data-layouts`,
		params: {keywords: '', page: -1, pageSize: -1, sort: ''},
	};

	const doFetch = () => {
		setFetchState({
			hasError: null,
			isLoading: true,
		});

		request(options)
			.then((formViews) => {
				setItems(formViews.items);
				setFetchState({
					hasError: null,
					isLoading: false,
				});
			})
			.catch((hasError) => {
				setFetchState({
					hasError,
					isLoading: false,
				});
			});
	};

	useEffect(() => {
		doFetch();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleOnSelect = (event, newValue) => {
		event.stopPropagation();

		onSelect(newValue);
	};

	const stateProps = {
		emptyProps: {
			label: Liferay.Language.get('no-form-view-for-this-object-yet'),
		},
		errorProps: {
			children: (
				<ClayButton displayType="link" onClick={doFetch} small>
					{Liferay.Language.get('retry')}
				</ClayButton>
			),
			label: Liferay.Language.get('failed-to-retrieve-form-views'),
		},
		loadingProps: {
			label: Liferay.Language.get('retrieving-all-form-views'),
		},
	};

	return (
		<>
			<DropDownWithSearch
				{...fetchState}
				items={items}
				label={label}
				onSelect={handleOnSelect}
				stateProps={stateProps}
				trigger={
					<ClayButton
						className="clearfix w-100"
						displayType="secondary"
						ref={(element) => {
							selectRef.current = element;
						}}
					>
						<span className="float-left">
							{selectedvalue || label}
						</span>

						<ClayIcon
							className="float-right icon"
							symbol="caret-bottom"
						/>
					</ClayButton>
				}
			/>
		</>
	);
};
