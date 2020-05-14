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
	dropDownStateProps: {
		empty: {emptyState},
		error: {errorLabel, retryHandler},
		loading: {loadingLabel},
	},
	fetchStatuses,
	items = [],
	onSelect,
	trigger,
	...restProps
}) => {
	const [active, setActive] = useState(false);
	const [hasError] = useState(false);
	const isLoading = fetchStatuses.some((status) => status < 4);
	const [query, setQuery] = useState('');

	const handleOnselect = (event, selectedValue) => {
		setActive(false);
		onSelect(event, selectedValue);
	};

	return (
		<DropDownContext.Provider value={{query, setQuery}}>
			<ClayDropDown
				{...restProps}
				active={active}
				alignmentPosition={Align.BottomLeft}
				menuElementAttrs={{
					className: 'select-dropdown-menu',
					onClick: (event) => {
						event.stopPropagation();
					},
				}}
				onActiveChange={setActive}
				trigger={trigger}
			>
				{children}
				{isLoading && <LoadingState loadingLabel={loadingLabel} />}

				{hasError && (
					<ErrorState
						errorLabel={errorLabel}
						handleOnCLick={() => retryHandler()}
					/>
				)}

				{!isLoading && !hasError && items.length === 0 && emptyState()}

				<Items items={items} onSelect={handleOnselect} query={query} />
			</ClayDropDown>
		</DropDownContext.Provider>
	);
};

const ErrorState = ({errorLabel, handleOnCLick}) => {
	return (
		<div className="error-state-dropdown-menu">
			<label className="font-weight-light text-secondary">
				{errorLabel}
			</label>

			<ClayButton displayType="link" onClick={handleOnCLick}>
				{Liferay.Language.get('retry')}
			</ClayButton>
		</div>
	);
};

const Items = ({items, onSelect, query}) => {
	const treatedQuery = query.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&');

	return (
		<ClayDropDown.ItemList>
			{items
				.filter(({name}) =>
					name[themeDisplay.getLanguageId()].match(treatedQuery)
				)
				.map(({id, name, ...otherProps}, index) => (
					<ClayDropDown.Item
						key={index}
						onClick={(event) =>
							onSelect(event, {
								id,
								name: name[themeDisplay.getLanguageId()],
							})
						}
						{...otherProps}
					>
						{name[themeDisplay.getLanguageId()]}
					</ClayDropDown.Item>
				))}
		</ClayDropDown.ItemList>
	);
};

const LoadingState = ({loadingLabel}) => (
	<div className="loading-state-dropdown-menu">
		<span aria-hidden="true" className="loading-animation" />

		<label className="font-weight-light text-secondary">
			{loadingLabel}
		</label>
	</div>
);

DropDown.Search = Search;

export {DropDownContext};

export default DropDown;
