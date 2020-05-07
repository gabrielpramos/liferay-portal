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
import ClayIcon from '@clayui/icon';
import React, {createContext, useState} from 'react';

import {Search} from './Search.es';

const DropDownContext = createContext();

const DropDown = ({
	children,
	displayType,
	emptyProps: {emptyButtonOnClick, emptyStateButton, emptyStateLabel},
	errorProps: {errorButtonOnClick, errorStateButton, errorStateLabel},
	items,
	label,
	loadingProps: {loadingStateIcon, loadingStateLabel},
	...restProps
}) => {
	const [active, setActive] = useState(false);
	const [query, setQuery] = useState('');

	return (
		<DropDownContext.Provider value={{query, setQuery}}>
			<ClayDropDown
				{...restProps}
				active={active}
				alignmentPosition={Align.BottomLeft}
				menuElementAttrs={{className: 'select-dropdown-menu'}}
				onActiveChange={setActive}
				trigger={
					<ClayButton
						className="clearfix w-100"
						displayType={displayType}
					>
						<span className="float-left">{label}</span>

						<ClayIcon
							className="float-right icon"
							symbol="caret-bottom"
						/>
					</ClayButton>
				}
			>
				{children}
				{items.length > 0 ? (
					<Items items={items} query={query} />
				) : (
					<div className="empty-state-dropdown-menu">
						<label className="font-weight-light text-secondary">
							{emptyStateLabel}
						</label>

						<ClayButton
							className="button"
							displayType="secondary"
							onClick={emptyButtonOnClick}
						>
							{emptyStateButton}
						</ClayButton>
					</div>
				)}
			</ClayDropDown>
		</DropDownContext.Provider>
	);
};

const Items = ({items, query}) => {
	return (
		<ClayDropDown.ItemList>
			{items
				.filter(({label}) => label.match(query))
				.map(({label, ...otherProps}, index) => (
					<ClayDropDown.Item key={index} {...otherProps}>
						{label}
					</ClayDropDown.Item>
				))}
		</ClayDropDown.ItemList>
	);
};

DropDown.Search = Search;

export {DropDownContext};

export default DropDown;
