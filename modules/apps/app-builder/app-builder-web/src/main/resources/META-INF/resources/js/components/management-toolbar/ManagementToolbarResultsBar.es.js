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

import ClayLabel from '@clayui/label';
import {ClayResultsBar} from '@clayui/management-toolbar';
import React, {useCallback, useContext} from 'react';

import lang from '../../utils/lang.es';
import Button from '../button/Button.es';
import SearchContext from './SearchContext.es';

const FilterItem = ({filterKey, filterName, filterValue, remove}) => {
	return (
		<ClayResultsBar.Item>
			<ClayLabel
				className="tbar-label"
				closeButtonProps={{onClick: () => remove(filterKey)}}
				displayType="unstyled"
			>
				<span className="label-section">
					{`${filterName}: `}
					<span className="font-weight-normal">{filterValue}</span>
				</span>
			</ClayLabel>
		</ClayResultsBar.Item>
	);
};

export const getSelectedFilters = (filterConfig, filters) => {
	const selectedFilters = [];

	Object.keys(filters).forEach((key) => {
		const {filterItems, filterKey, filterName} = filterConfig.find(
			({filterKey}) => filterKey === key
		);

		const selectedItems = filterItems.filter(({value}) => {
			return Array.isArray(filters[key])
				? filters[key].includes(value)
				: filters[key] === value;
		});

		const filterValue = selectedItems
			.map(({label}) => label)
			.join(', ')
			.replace(/, ([^,]*)$/, ' and $1');

		selectedFilters.push({filterKey, filterName, filterValue});
	});

	return selectedFilters;
};

export default ({filterConfig = [], isLoading, totalCount}) => {
	const [{filters = {}, keywords}, dispatch] = useContext(SearchContext);

	const removeFilter = useCallback(
		(filterKey) => {
			delete filters[filterKey];

			dispatch({filters, type: 'FILTER'});
		},
		[dispatch, filters]
	);

	const selectedFilters = getSelectedFilters(filterConfig, filters);

	return (
		<>
			{(keywords || selectedFilters.length > 0) && !isLoading && (
				<ClayResultsBar>
					<ClayResultsBar.Item>
						<span className="component-text text-truncate-inline">
							<span className="text-truncate">
								{lang.sub(
									Liferay.Language.get('x-results-for-x'),
									[totalCount, keywords]
								)}
							</span>
						</span>
					</ClayResultsBar.Item>

					{selectedFilters.map((filter, key) => (
						<FilterItem
							key={key}
							{...filter}
							remove={removeFilter}
						/>
					))}

					<ClayResultsBar.Item expand>
						<div className="tbar-section text-right">
							<Button
								className="component-link tbar-link"
								displayType="unstyled"
								onClick={() => dispatch({type: 'CLEAR'})}
							>
								{Liferay.Language.get('clear-all')}
							</Button>
						</div>
					</ClayResultsBar.Item>
				</ClayResultsBar>
			)}
		</>
	);
};
