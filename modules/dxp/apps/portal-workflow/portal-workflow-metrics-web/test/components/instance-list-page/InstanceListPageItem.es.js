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

import {cleanup, fireEvent, render} from '@testing-library/react';
import React from 'react';

import {Table} from '../../../src/main/resources/META-INF/resources/js/components/instance-list-page/InstanceListPageTable.es';
import {SingleReassignModalContext} from '../../../src/main/resources/META-INF/resources/js/components/instance-list-page/modal/single-reassign/SingleReassignModal.es';
import {InstanceListContext} from '../../../src/main/resources/META-INF/resources/js/components/instance-list-page/store/InstanceListPageStore.es';

const instance = {
	assetTitle: 'New Post',
	assetType: 'Blog',
	assigneeUsers: [{id: 20124, name: 'Test Test'}],
	creatorUser: {
		name: 'User 1'
	},
	dateCreated: new Date('2019-01-01'),
	id: 1,
	taskNames: ['Review', 'Update']
};

describe('The instance list item should', () => {
	afterEach(cleanup);

	test('Be rendered with "User 1", "Jan 01, 2019, 12:00 AM", and "Review, Update" columns', () => {
		const {getByTestId} = render(
			<InstanceListContext.Provider value={{setInstanceId: jest.fn()}}>
				<SingleReassignModalContext.Provider
					value={{setShowModal: () => {}, showModal: false}}
				>
					<Table.Item {...instance} />
				</SingleReassignModalContext.Provider>
			</InstanceListContext.Provider>
		);

		const creatorUserCell = getByTestId('creatorUserCell');
		const dateCreatedCell = getByTestId('dateCreatedCell');
		const taskNamesCell = getByTestId('taskNamesCell');

		expect(creatorUserCell.innerHTML).toBe('User 1');
		expect(dateCreatedCell.innerHTML).toBe('Jan 01, 2019, 12:00 AM');
		expect(taskNamesCell.innerHTML).toBe('Review, Update');
	});

	test('Be rendered with check icon when the slaStatus is "OnTime"', () => {
		const {getByTestId} = render(
			<InstanceListContext.Provider value={{setInstanceId: jest.fn()}}>
				<SingleReassignModalContext.Provider
					value={{setShowModal: () => {}, showModal: false}}
				>
					<Table.Item {...instance} slaStatus="OnTime" />
				</SingleReassignModalContext.Provider>
			</InstanceListContext.Provider>
		);

		const instanceStatusIcon = getByTestId('icon');

		expect([...instanceStatusIcon.classList]).toContain(
			'lexicon-icon-check-circle'
		);
	});

	test('Be rendered with exclamation icon when the slaStatus is "Overdue"', () => {
		const {getByTestId} = render(
			<InstanceListContext.Provider value={{setInstanceId: jest.fn()}}>
				<SingleReassignModalContext.Provider
					value={{setShowModal: () => {}, showModal: false}}
				>
					<Table.Item {...instance} slaStatus="Overdue" />
				</SingleReassignModalContext.Provider>
			</InstanceListContext.Provider>
		);

		const instanceStatusIcon = getByTestId('icon');

		expect([...instanceStatusIcon.classList]).toContain(
			'lexicon-icon-exclamation-circle'
		);
	});

	test('Be rendered with hr icon when the slaStatus is "Untracked"', () => {
		const {getByTestId} = render(
			<InstanceListContext.Provider value={{setInstanceId: jest.fn()}}>
				<SingleReassignModalContext.Provider
					value={{setShowModal: () => {}, showModal: false}}
				>
					<Table.Item {...instance} slaStatus="Untracked" />
				</SingleReassignModalContext.Provider>
			</InstanceListContext.Provider>
		);

		const instanceStatusIcon = getByTestId('icon');

		expect([...instanceStatusIcon.classList]).toContain('lexicon-icon-hr');
	});

	test('Call setInstanceId with "1" as instance id param', () => {
		const contextMock = {setInstanceId: jest.fn()};
		instance.status = 'Completed';

		const {getByTestId} = render(
			<InstanceListContext.Provider value={contextMock}>
				<SingleReassignModalContext.Provider
					value={{setShowModal: () => {}, showModal: false}}
				>
					<Table.Item {...instance} />
				</SingleReassignModalContext.Provider>
			</InstanceListContext.Provider>
		);

		const instanceIdLink = getByTestId('instanceIdLink');

		fireEvent.click(instanceIdLink);

		expect(contextMock.setInstanceId).toBeCalledWith(1);
	});
});

describe('The InstanceListPageItem quick action menu should', () => {
	afterEach(cleanup);

	const instance = {
		assetTitle: 'New Post',
		assetType: 'Blog',
		dateCreated: new Date('2019-01-01'),
		id: 1
	};

	const setShowModal = jest.fn();

	test('set modal visualization by clicking the reassign task button', () => {
		const {getByTestId} = render(
			<InstanceListContext.Provider value={{setInstanceId: jest.fn()}}>
				<SingleReassignModalContext.Provider
					value={{setShowModal, showModal: false}}
				>
					<Table.Item {...instance} />
				</SingleReassignModalContext.Provider>
			</InstanceListContext.Provider>
		);

		const reassignTaskButton = getByTestId('dropDownItem');

		fireEvent.click(reassignTaskButton);
		expect(setShowModal).toHaveBeenCalledTimes(1);
	});
});
