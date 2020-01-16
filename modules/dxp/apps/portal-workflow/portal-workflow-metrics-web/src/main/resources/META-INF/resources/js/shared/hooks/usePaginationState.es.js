/**
 * Copyright (c) 2000-present Liferay, Inc. All rights reserved.
 *
 * The contents of this file are subject to the terms of the Liferay Enterprise
 * Subscription License ("License"). You may not use this file except in
 * compliance with the License. You can obtain a copy of the License by
 * contacting Liferay, Inc. See the License for the specific language governing
 * permissions and limitations under the License, including but not limited to
 * distribution rights of the Software.
 */

import {useState, useMemo} from 'react';

import {paginateArray} from '../util/array.es';

const usePaginationState = ({
	initialPage = 1,
	initialPageSize = 10,
	items = false
}) => {
	const [page, setPage] = useState(initialPage);
	const [pageSize, setPageSize] = useState(initialPageSize);

	const pagination = useMemo(
		() => ({
			page,
			pageSize,
			setPage,
			setPageSize
		}),
		[page, pageSize]
	);

	const paginatedItems = useMemo(
		() => (items ? paginateArray(items, page, pageSize) : []),
		[page, pageSize, items]
	);

	return {
		page,
		pageSize,
		paginatedItems,
		pagination
	};
};

export {usePaginationState};
