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

import {useResource} from '@clayui/data-provider';
import {usePrevious} from 'frontend-js-react-web';
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {withRouter} from 'react-router-dom';

import {AppContext} from '../../AppContext.es';
import useQuery from '../../hooks/useQuery.es';
import {getURL} from '../../utils/client.es';
import {isEqualObjects} from '../../utils/utils.es';
import ManagementToolbar from '../management-toolbar/ManagementToolbar.es';
import ManagementToolbarResultsBar, {
	getSelectedFilters,
} from '../management-toolbar/ManagementToolbarResultsBar.es';
import SearchContext, {reducer} from '../management-toolbar/SearchContext.es';
import TableWithPagination from '../table/TableWithPagination.es';

export default withRouter(
	({
		actions,
		addButton,
		children,
		columns,
		emptyState,
		endpoint,
		filterConfig = [],
		history,
		queryParams,
	}) => {
		const {defaultDelta = 20} = useContext(AppContext);
		const [query, setQuery] = useQuery(history, {
			filters: {},
			keywords: '',
			page: 1,
			pageSize: defaultDelta,
			sort: '',
			...queryParams,
		});

		const dispatch = useCallback(
			(action) => setQuery(reducer(query, action)),
			[query, setQuery]
		);

		const {filters = {}, ...params} = {...query, ...query.filters};
		const prevParams = usePrevious(params);

		const {refetch, resource} = useResource({
			fetchDelay: 0,
			fetchOptions: {
				credentials: 'same-origin',
				method: 'GET',
			},
			link: getURL(endpoint, params),
			onNetworkStatusChange: (status) => setLoading(status < 4),
		});

		let items = [];
		let totalCount = 0;
		let totalPages = 1;

		if (resource) {
			({items = [], totalCount, lastPage: totalPages} = resource);
		}

		useEffect(() => {
			if (query.page > totalPages) {
				dispatch({page: totalPages, type: 'CHANGE_PAGE'});
			}
		}, [dispatch, query.page, totalPages]);

		useEffect(() => {
			if (prevParams && !isEqualObjects(params, prevParams)) {
				refetch();
			}
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [params, prevParams]);

		let refetchOnActions;

		if (actions && actions.length > 0) {
			refetchOnActions = actions.map((action) => {
				if (!action.action) {
					return action;
				}

				return {
					...action,
					action: (item) => {
						action.action(item).then((isRefetch) => {
							if (!isRefetch) {
								return;
							}

							refetch();
						});
					},
				};
			});
		}

		const [isLoading, setLoading] = useState(true);

		const selectedFilters = getSelectedFilters(filterConfig, filters);
		const isEmpty = totalCount === 0;
		const isFiltered = selectedFilters.length > 0;

		return (
			<SearchContext.Provider value={[query, dispatch]}>
				<ManagementToolbar
					addButton={addButton}
					columns={columns}
					disabled={!isFiltered && !query.keywords && isEmpty}
					filterConfig={filterConfig}
					totalCount={totalCount}
				/>

				<ManagementToolbarResultsBar
					filterConfig={filterConfig}
					isLoading={isLoading}
					totalCount={totalCount}
				/>

				<TableWithPagination
					actions={refetchOnActions}
					columns={columns}
					emptyState={emptyState}
					isEmpty={isEmpty}
					isFiltered={isFiltered}
					isLoading={isLoading}
					items={items.map((item, index) => children(item, index))}
					keywords={query.keywords}
					totalCount={totalCount}
				/>
			</SearchContext.Provider>
		);
	}
);
