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

import {render} from '@testing-library/react';
import React, {useCallback} from 'react';

import SLAListCardContext from '../../../src/main/resources/META-INF/resources/js/components/sla/SLAListCardContext.es';
import SLAListTable from '../../../src/main/resources/META-INF/resources/js/components/sla/SLAListTable.es';
import {MockRouter as Router} from '../../mock/MockRouter.es';

import '@testing-library/jest-dom/extend-expect';

const items = [
	{
		calendarKey: '',
		dateModified: '2020-03-12T11:37:20Z',
		description: 'Test Description',
		duration: 60000,
		id: 37916,
		name: 'Test',
		processId: 37250,
		startNodeKeys: {
			nodeKeys: [
				{
					executionType: 'begin',
					id: '37254',
				},
			],
			status: 0,
		},
		status: 2,
		stopNodeKeys: {
			nodeKeys: [
				{
					executionType: 'end',
					id: '37252',
				},
			],
			status: 0,
		},
	},
	{
		calendarKey: '',
		dateModified: '2020-03-12T11:37:20Z',
		description: '',
		duration: 60000,
		id: 37916,
		name: 'Test',
		processId: 37250,
		startNodeKeys: {
			nodeKeys: [
				{
					executionType: 'begin',
					id: '37254',
				},
			],
			status: 0,
		},
		status: 0,
		stopNodeKeys: {
			nodeKeys: [
				{
					executionType: 'end',
					id: '37252',
				},
			],
			status: 0,
		},
	},
];

const ContainerMock = ({children}) => {
	const setConfirmDialogVisibility = useCallback(jest.fn(), []);
	const removeItem = useCallback(jest.fn(), []);

	const slaContextState = {
		hideConfirmDialog: () => setConfirmDialogVisibility(null, false),
		removeItem,
		showConfirmDialog: (id, callback) =>
			setConfirmDialogVisibility(id, true, callback),
	};

	return (
		<Router>
			<SLAListCardContext.Provider value={slaContextState}>
				{children}
			</SLAListCardContext.Provider>
		</Router>
	);
};

describe('', () => {
	let getAllByTestId;

	beforeAll(() => {
		const component = render(<SLAListTable items={items} />, {
			wrapper: ContainerMock,
		});

		getAllByTestId = component.getAllByTestId;
	});

	test('Should render components Table and Item filled with data on items', () => {
		const SLAName = getAllByTestId('SLAName');
		const SLADescription = getAllByTestId('SLADescription');
		const SLADuration = getAllByTestId('SLADuration');
		const SLADateModified = getAllByTestId('SLADateModified');

		expect(SLAName[0]).toHaveTextContent('Test');
		expect(SLADescription[0]).toHaveTextContent('Test Description');
		expect(SLADuration[0]).toHaveTextContent('1m');
		expect(SLADateModified[0]).toHaveTextContent('Mar 12');
	});
});
