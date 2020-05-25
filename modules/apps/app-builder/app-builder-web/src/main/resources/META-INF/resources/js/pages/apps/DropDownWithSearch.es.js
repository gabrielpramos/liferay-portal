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

import ClayDropDown, {Align} from '@clayui/drop-down';
import ClayLabel from '@clayui/label';
import React, {
	cloneElement,
	createContext,
	useContext,
	useEffect,
	useState,
} from 'react';

export const DropDownContext = createContext();

const DropDownWithSearch = ({
	hasError,
	dropDownWidth,
	items = [],
	isLoading,
	namePropertyKey = 'name',
	onSelect,
	setDropDownWidth,
	stateProps: {emptyProps, errorProps, loadingProps},
	trigger,
	...restProps
}) => {
	const [active, setActive] = useState(false);
	const [query, setQuery] = useState('');
	const [triggerElement, setTriggerElement] = useState(trigger);

	const handleOnSelect = (event, selectedValue) => {
		setActive(false);
		onSelect(event, selectedValue);
	};

	useEffect(() => {
		if (dropDownWidth) {
			setTriggerElement(
				cloneElement(trigger, {
					ref: (element) => {
						if (element) {
							setDropDownWidth(`${element.offsetWidth}px`);

							if (typeof trigger.ref === 'function') {
								trigger.ref(element);
							}
						}

						return trigger.ref;
					},
				})
			);
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [trigger]);

	return (
		<DropDownContext.Provider value={{query, setQuery}}>
			<ClayDropDown
				{...restProps}
				active={active}
				alignmentPosition={Align.BottomCenter}
				menuElementAttrs={{
					onClick: (event) => {
						event.stopPropagation();
					},
					style: {maxWidth: dropDownWidth, width: '100%'},
				}}
				onActiveChange={setActive}
				trigger={triggerElement}
			>
				{<Search />}

				{isLoading && <LoadingState {...loadingProps} />}

				{hasError && (
					<EmptyState
						className="error-state-dropdown-menu"
						{...errorProps}
					/>
				)}

				{!isLoading && !hasError && items.length === 0 && (
					<EmptyState
						className="empty-state-dropdown-menu"
						{...emptyProps}
					/>
				)}

				<Items
					items={items}
					namePropertyKey={namePropertyKey}
					onSelect={handleOnSelect}
					query={query}
				/>
			</ClayDropDown>
		</DropDownContext.Provider>
	);
};

const EmptyState = ({children, className, label}) => {
	return (
		<div className={className}>
			<label className="font-weight-light text-secondary">{label}</label>

			{children}
		</div>
	);
};

const Items = ({items, namePropertyKey, onSelect, query}) => {
	const treatedQuery = query.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&');

	const getTranslatedName = ({
		defaultLanguageId = themeDisplay.getLanguageId(),
		[namePropertyKey]: name,
	}) => {
		return typeof name === 'object'
			? name[themeDisplay.getLanguageId()] || name[defaultLanguageId]
			: name;
	};

	return (
		<ClayDropDown.ItemList>
			{items
				.filter((item) => getTranslatedName(item).match(treatedQuery))
				.map((item) => ({...item, name: getTranslatedName(item)}))
				.map(({id, name, ...otherProps}, index) => (
					<ClayDropDown.Item
						key={index}
						onClick={(event) =>
							onSelect(event, {
								id,
								name,
							})
						}
						{...otherProps}
					>
						{name}

						<ClayLabel className="float-right" displayType="success">Custom</ClayLabel>
					</ClayDropDown.Item>
				))}
		</ClayDropDown.ItemList>
	);
};

const LoadingState = ({label}) => (
	<div className="loading-state-dropdown-menu">
		<span aria-hidden="true" className="loading-animation" />

		<label className="font-weight-light text-secondary">{label}</label>
	</div>
);

const Search = () => {
	const {query, setQuery} = useContext(DropDownContext);

	return (
		<ClayDropDown.Search
			className="mb-2"
			formProps={{onSubmit: (e) => e.preventDefault()}}
			onChange={(event) => setQuery(event.target.value)}
			placeholder={Liferay.Language.get('search')}
			value={query}
		/>
	);
};

export default (props) => {
	return <DropDownWithSearch {...props} />;
};
