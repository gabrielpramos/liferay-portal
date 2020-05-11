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
	emptyProps: {
		customObjectButtonRef,
		emptyButtonOnClick,
		emptyStateButton,
		emptyStateLabel,
	},
	errorProps: {errorButtonOnClick, errorStateButton, errorStateLabel},
	items,
	loadingProps: {loadingStateLabel},
	onSelect,
	trigger,
	...restProps
}) => {
	const [active, setActive] = useState(false);
	const [query, setQuery] = useState('');
	const loading = false;
	const error = true;

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
				{loading && (
					<div className="loading-state-dropdown-menu">
						<span
							aria-hidden="true"
							className="loading-animation"
						/>

						<label className="font-weight-light text-secondary">
							{loadingStateLabel}
						</label>
					</div>
				)}

				{error && (
					<div className="error-state-dropdown-menu">
						<label className="font-weight-light text-secondary">
							{errorStateLabel}
						</label>

						<ClayButton
							displayType="link"
							onClick={errorButtonOnClick}
						>
							{errorStateButton}
						</ClayButton>
					</div>
				)}

				{!loading && !error && items.length === 0 && (
					<div className="empty-state-dropdown-menu">
						<label className="font-weight-light text-secondary">
							{emptyStateLabel}
						</label>

						<ClayButton
							className="emptyButton"
							displayType="secondary"
							onClick={emptyButtonOnClick}
							ref={customObjectButtonRef}
						>
							{emptyStateButton}
						</ClayButton>
					</div>
				)}

				<Items items={items} onSelect={handleOnselect} query={query} />
			</ClayDropDown>
		</DropDownContext.Provider>
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

DropDown.Search = Search;

export {DropDownContext};

export default DropDown;
