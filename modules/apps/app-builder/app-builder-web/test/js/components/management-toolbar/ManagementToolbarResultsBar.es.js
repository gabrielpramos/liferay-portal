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

import {cleanup, fireEvent, render} from '@testing-library/react';
import React from 'react';

import ManagementToolbarResultsBar from '../../../../src/main/resources/META-INF/resources/js/components/management-toolbar/ManagementToolbarResultsBar.es';
import SearchContextProviderWrapper from '../../SearchContextProviderWrapper.es';

describe('ManagementToolbarResultsBar', () => {
	afterEach(cleanup);

	it('renders empty', () => {
		const {container} = render(<ManagementToolbarResultsBar />, {
			wrapper: SearchContextProviderWrapper,
		});

		expect(container.innerHTML).toBe('');
	});

	it('renders with selected filters', () => {
		const filterConfig = [
			{
				filterItems: [
					{label: 'multiple1', value: '1'},
					{label: 'multiple2', value: '2'},
					{label: 'multiple3', value: '3'},
				],
				filterKey: 'multiple',
				filterName: 'Multiple Filter',
				multiple: true,
			},
			{
				filterItems: [{label: 'single1', value: '1'}],
				filterKey: 'single',
				filterName: 'Single Filter',
			},
		];

		const query = {filters: {multiple: ['1', '2', '3'], single: '1'}};

		const {container, queryAllByText, queryByText} = render(
			<SearchContextProviderWrapper defaultQuery={query}>
				<ManagementToolbarResultsBar filterConfig={filterConfig} />
			</SearchContextProviderWrapper>
		);

		const clearBtn = queryByText('clear-all');
		let filterResults = queryAllByText(/filter:/i);
		const closeButtons = container.querySelectorAll('button.close');

		expect(clearBtn).toBeTruthy();
		expect(filterResults.length).toBe(2);

		expect(filterResults[0].textContent).toBe(
			'Multiple Filter: multiple1, multiple2 and multiple3'
		);
		expect(filterResults[1].textContent).toBe('Single Filter: single1');

		fireEvent.click(closeButtons[1]);

		filterResults = queryAllByText(/filter:/i);

		expect(filterResults.length).toBe(1);

		fireEvent.click(clearBtn);

		expect(container.innerHTML).toBe('');
	});
});
