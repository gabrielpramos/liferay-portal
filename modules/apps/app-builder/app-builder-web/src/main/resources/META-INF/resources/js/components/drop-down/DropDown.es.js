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
import ClayDropDown, {Align} from '@clayui/drop-down';
import React, {createContext, useState} from 'react';

import {Search} from './Search.es';

const DropDownContext = createContext();

const DropDown = ({
	children,
	emptyState,
	fetchStatus,
	items = [],
	onSelect,
	trigger,
	...restProps
}) => {
	const [active, setActive] = useState(false);
	const [hasError] = useState(false);
	const isLoading = fetchStatus < 4;
	const [query, setQuery] = useState('');
	const [retry, setRetry] = useState(0);

	const handleOnselect = (event) => {
		setActive(false);
		onSelect(event);
	};

	return (
		<DropDownContext.Provider value={{query, setQuery}}>
			<ClayDropDown
				{...restProps}
				active={active}
				alignmentPosition={Align.BottomLeft}
				menuElementAttrs={{className: 'select-dropdown-menu'}}
				onActiveChange={setActive}
				trigger={trigger}
			>
				{children}
				{isLoading && <LoadingState />}

				{hasError && <ErrorState handleOnCLick={setRetry(retry + 1)} />}

				{!isLoading && !hasError && items.length === 0 && emptyState}

				<Items items={items} onSelect={handleOnselect} query={query} />
			</ClayDropDown>
		</DropDownContext.Provider>
	);
};

const ErrorState = ({handleOnCLick}) => {
	return (
		<div className="error-state-dropdown-menu">
			<label className="font-weight-light text-secondary">
				{Liferay.Language.get('failed-to-retrieve-objects')}
			</label>

			<ClayButton displayType="link" onClick={handleOnCLick}>
				{Liferay.Language.get('retry')}
			</ClayButton>
		</div>
	);
};

const Items = ({items, onSelect, query}) => {
	return (
		<ClayDropDown.ItemList>
			{items
				.filter(({label}) => label.match(query))
				.map(({label, ...otherProps}, index) => (
					<ClayDropDown.Item
						key={index}
						onClick={onSelect}
						{...otherProps}
					>
						{label}
					</ClayDropDown.Item>
				))}
		</ClayDropDown.ItemList>
	);
};

const LoadingState = () => (
	<div className="loading-state-dropdown-menu">
		<span aria-hidden="true" className="loading-animation" />

		<label className="font-weight-light text-secondary">
			{Liferay.Language.get('retrieving-all-objects')}
		</label>
	</div>
);

DropDown.Search = Search;

export {DropDownContext};

export default DropDown;
