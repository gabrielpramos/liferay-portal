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

import {cleanup, render, findByTestId} from '@testing-library/react';
import React from 'react';

import TimeRangeFilter from '../../../src/main/resources/META-INF/resources/js/components/filter/TimeRangeFilter.es';
import {MockRouter} from '../../mock/MockRouter.es';

const query = '?filters.timeRange%5B0%5D=7';

const items = [
	{
		dateEnd: '2019-12-09T00:00:00Z',
		dateStart: '2019-12-03T00:00:00Z',
		defaultTimeRange: false,
		id: 7,
		name: 'Last 7 Days'
	},
	{
		dateEnd: '2019-12-09T00:00:00Z',
		dateStart: '2019-11-10T00:00:00Z',
		defaultTimeRange: true,
		id: 30,
		name: 'Last 30 Days'
	}
];

const clientMock = {
	get: jest.fn().mockResolvedValue({data: {items, totalCount: items.length}})
};

const wrapper = ({children}) => (
	<MockRouter client={clientMock} query={query}>
		{children}
	</MockRouter>
);

describe('The time range filter component should', () => {
	let getAllByTestId;

	afterEach(cleanup);

	beforeEach(() => {
		const renderResult = render(
			<TimeRangeFilter dispatch={() => {}} processId={12345} />,
			{wrapper}
		);

		getAllByTestId = renderResult.getAllByTestId;
	});

	test('Be rendered with filter item names', async () => {
		const filterItems = await getAllByTestId('filterItem');

		expect(filterItems[0].innerHTML).toContain('custom-range');
		expect(filterItems[1].innerHTML).toContain('Last 7 Days');
		expect(filterItems[2].innerHTML).toContain('Last 30 Days');
	});

	test('Be rendered with active option "Last 7 Days"', async () => {
		const filterItems = getAllByTestId('filterItem');

		const activeItem = filterItems.find(item =>
			item.className.includes('active')
		);
		const activeItemName = await findByTestId(activeItem, 'filterItemName');

		expect(activeItemName.innerHTML).toBe('Last 7 Days');
	});
});
