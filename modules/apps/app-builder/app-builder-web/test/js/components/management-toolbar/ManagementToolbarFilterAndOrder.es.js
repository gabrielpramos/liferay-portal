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

import {cleanup, render} from '@testing-library/react';
import React from 'react';

import ManagementToolbarFilterAndOrder from '../../../../src/main/resources/META-INF/resources/js/components/management-toolbar/ManagementToolbarFilterAndOrder.es';
import SearchContextProviderWrapper from '../../SearchContextProviderWrapper.es';

describe('ManagementToolbarFilterAndOrder', () => {
	afterEach(cleanup);

	const columns = [
		{asc: false, key: 'field', sortable: true, value: 'field'},
		{key: 'field1', sortable: true, value: 'field1'},
	];

	it('renders empty', () => {
		const {container} = render(<ManagementToolbarFilterAndOrder />, {
			wrapper: SearchContextProviderWrapper,
		});

		expect(container.innerHTML).toBe('');
	});

	it('renders disabled', () => {
		const {container} = render(
			<ManagementToolbarFilterAndOrder columns={columns} disabled />,
			{wrapper: SearchContextProviderWrapper}
		);

		const filter = container.querySelector('#filter-and-order');
		const sort = container.querySelector(
			'ul .nav-item:nth-child(2) button'
		);

		expect(filter.disabled).toBeTruthy();
		expect(sort.disabled).toBeTruthy();
	});

	it('renders', () => {
		const {container, queryByLabelText} = render(
			<ManagementToolbarFilterAndOrder columns={columns} />,
			{
				wrapper: SearchContextProviderWrapper,
			}
		);

		const field = queryByLabelText('field');
		const field1 = queryByLabelText('field1');

		expect(field).toBeTruthy();
		expect(field1).toBeTruthy();
		expect(field.checked).toBeTruthy();
		expect(field1.checked).toBeFalsy();

		const sort = container.querySelector(
			'ul .nav-item:nth-child(2) button'
		);

		expect(sort.classList).toContain('order-arrow-down-active');

		sort.click();

		expect(sort.classList).toContain('order-arrow-up-active');
	});
});
