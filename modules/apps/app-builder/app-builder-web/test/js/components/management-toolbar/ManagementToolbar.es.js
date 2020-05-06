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

import ManagementToolbar from '../../../../src/main/resources/META-INF/resources/js/components/management-toolbar/ManagementToolbar.es';
import SearchContextProviderWrapper from '../../SearchContextProviderWrapper.es';

const addButton = (onClick) => <button onClick={onClick}>add</button>;

describe('ManagementToolbar', () => {
	afterEach(cleanup);

	it('renders disabled', () => {
		const onClickButtonCallback = jest.fn();

		const {queryByPlaceholderText, queryByText} = render(
			<SearchContextProviderWrapper defaultQuery={{sort: 'field1:asc'}}>
				<ManagementToolbar
					addButton={() => addButton(onClickButtonCallback)}
					columns={[
						{key: 'field', sortable: true},
						{asc: true, key: 'field1', sortable: true},
					]}
					disabled
				/>
			</SearchContextProviderWrapper>
		);

		const addBtn = queryByText('add');
		const filterAndOrder = queryByText('filter-and-order');
		const searchField = queryByPlaceholderText('search...');

		expect(addBtn.disabled).toBeFalsy();
		expect(filterAndOrder.parentElement.disabled).toBeTruthy();
		expect(searchField.disabled).toBeTruthy();

		fireEvent.click(addBtn);

		expect(onClickButtonCallback).toHaveBeenCalled();
	});

	it('renders without filter and order', () => {
		const {queryByPlaceholderText, queryByText} = render(
			<ManagementToolbar addButton={addButton} columns={[]} />,
			{wrapper: SearchContextProviderWrapper}
		);

		const addBtn = queryByText('add');
		const filterAndOrder = queryByText('filter-and-order');
		const searchField = queryByPlaceholderText('search...');

		expect(addBtn).toBeTruthy();
		expect(filterAndOrder).toBeFalsy();
		expect(searchField).toBeTruthy();
	});

	it('renders with filter config and without addButton', () => {
		const dispatch = jest.fn();

		const columns = [
			{
				key: 'field1',
			},
			{
				key: 'field2',
				sortable: true,
				value: 'field2',
			},
			{
				asc: true,
				key: 'field3',
				sortable: true,
				value: 'field3',
			},
		];

		const filterConfig = [
			{
				filterItems: [
					{label: 'multiple1', value: '1'},
					{label: 'multiple2', value: '2'},
					{label: 'multiple3', value: '3'},
				],
				filterKey: 'multiple',
				filterName: 'multiple',
				multiple: true,
			},
			{
				filterItems: [
					{label: 'single1', value: '1'},
					{label: 'single2', value: '2'},
				],
				filterKey: 'single',
				filterName: 'single',
			},
		];

		const query = {
			filters: {
				multiple: ['2'],
			},
			keywords: '',
		};

		const {
			container,
			queryAllByLabelText,
			queryByLabelText,
			queryByText,
		} = render(
			<SearchContextProviderWrapper
				defaultQuery={query}
				dispatch={dispatch}
			>
				<ManagementToolbar
					columns={columns}
					filterConfig={filterConfig}
				/>
			</SearchContextProviderWrapper>
		);

		const anyOption = queryByLabelText('any');
		const doneBtn = queryByText('done');
		const field1 = queryByLabelText('field1');
		const field2 = queryByLabelText('field2');
		const field3 = queryByLabelText('field3');
		const filterAndOrder = queryByText('filter-and-order');
		const multipleFilters = queryAllByLabelText(/multiple/i);
		const singleFilters = queryAllByLabelText(/single/i);

		expect(doneBtn).toBeTruthy();
		expect(field1).toBeFalsy();
		expect(field2).toBeTruthy();
		expect(field3).toBeTruthy();
		expect(field2.checked).toBeFalsy();
		expect(field3.checked).toBeTruthy();

		expect(filterAndOrder).toBeTruthy();
		expect(multipleFilters.length).toBe(3);
		expect(multipleFilters[0].checked).toBeFalsy();
		expect(multipleFilters[1].checked).toBeTruthy();
		expect(multipleFilters[2].checked).toBeFalsy();

		expect(singleFilters.length).toBe(2);
		expect(anyOption).toBeTruthy();
		expect(anyOption.checked).toBeTruthy();
		expect(singleFilters[0].checked).toBeFalsy();
		expect(singleFilters[1].checked).toBeFalsy();

		fireEvent.click(multipleFilters[0]);
		fireEvent.click(multipleFilters[1]);
		fireEvent.click(multipleFilters[2]);

		expect(multipleFilters[0].checked).toBeTruthy();
		expect(multipleFilters[1].checked).toBeFalsy();
		expect(multipleFilters[2].checked).toBeTruthy();

		fireEvent.click(singleFilters[0]);

		expect(anyOption.checked).toBeFalsy();
		expect(singleFilters[0].checked).toBeTruthy();
		expect(singleFilters[1].checked).toBeFalsy();

		fireEvent.click(field2);

		expect(field2.checked).toBeTruthy();
		expect(field3.checked).toBeFalsy();

		fireEvent.click(doneBtn);

		expect(dispatch.mock.calls.length).toBe(2);
		expect(dispatch.mock.calls[0][0]).toEqual({
			filters: {multiple: ['1', '3'], single: '1'},
			type: 'FILTER',
		});
		expect(dispatch.mock.calls[1][0]).toEqual({
			sort: 'field2:asc',
			type: 'SORT',
		});

		const sort = container.querySelector(
			'ul .nav-item:nth-child(2) button'
		);

		fireEvent.click(sort);

		expect(dispatch.mock.calls.length).toBe(3);
		expect(dispatch.mock.calls[2][0]).toEqual({
			sort: 'field2:desc',
			type: 'SORT',
		});

		const setMobile = container.querySelector(
			'.nav-item.navbar-breakpoint-d-none > button'
		);

		fireEvent.click(setMobile);
	});
});
