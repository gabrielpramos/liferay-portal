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

import '@testing-library/jest-dom/extend-expect';
import {waitForElementToBeRemoved} from '@testing-library/dom';
import {cleanup, fireEvent, render} from '@testing-library/react';
import React from 'react';

import EditApp from '../../../../src/main/resources/META-INF/resources/js/pages/apps/edit/EditApp.es';
import AppContextProviderWrapper from '../../../AppContextProviderWrapper.es';

const customObjectItems = {
	items: [
		{
			availableLanguageIds: ['en_US'],
			contentType: 'app-builder',
			dataDefinitionKey: '37496',
			dateCreated: '2020-06-05T13:43:16Z',
			dateModified: '2020-06-05T13:44:08Z',
			defaultLanguageId: 'en_US',
			id: 37497,
			name: {
				en_US: 'Object 01',
			},
		},
	],
};

const formViewItems = {
	items: [
		{
			dataDefinitionId: 37497,
			dataLayoutKey: '37626',
			dataLayoutPages: [
				{
					dataLayoutRows: [
						{
							dataLayoutColumns: [
								{
									columnSize: 12,
									fieldNames: ['Text1'],
								},
							],
						},
					],
					description: {
						en_US: '',
					},
					title: {
						en_US: '',
					},
				},
			],
			dataRules: [],
			dateCreated: '2020-06-08T12:12:23Z',
			dateModified: '2020-06-08T12:12:23Z',
			description: {},
			id: 37625,
			name: {
				en_US: 'Form 01',
			},
			paginationMode: 'wizard',
			siteId: 20124,
			userId: 20126,
		},
		{
			dataDefinitionId: 37497,
			dataLayoutKey: '37627',
			dataLayoutPages: [
				{
					dataLayoutRows: [
						{
							dataLayoutColumns: [
								{
									columnSize: 12,
									fieldNames: ['Text2'],
								},
							],
						},
					],
					description: {
						en_US: '',
					},
					title: {
						en_US: '',
					},
				},
			],
			dataRules: [],
			dateCreated: '2020-06-09T12:12:23Z',
			dateModified: '2020-06-09T12:12:23Z',
			description: {},
			id: 37626,
			name: {
				en_US: 'Form 02',
			},
			paginationMode: 'wizard',
			siteId: 20124,
			userId: 20126,
		},
	],
};

const history = {
	push: jest.fn(),
};

const nativeObjectItems = {items: []};

const roleItems = {
	items: [
		{
			availableLanguages: ['en-US'],
			dateCreated: '2020-07-01T13:25:25Z',
			dateModified: '2020-07-01T13:25:25Z',
			description:
				'Account Managers who belong to an organization can administer all accounts associated to that organization.',
			id: 37238,
			name: 'Account Manager',
			roleType: 'organization',
		},
	],
};

const tableViewItems = {
	items: [
		{
			appliedFilters: {},
			dataDefinitionId: 37497,
			dateCreated: '2020-06-08T12:12:31Z',
			dateModified: '2020-06-08T12:12:31Z',
			fieldNames: ['Text'],
			id: 37628,
			name: {
				en_US: 'Table 01',
			},
			siteId: 20124,
			sortField: '',
			userId: 20126,
		},
	],
};

describe('EditApp', () => {
	const mockToast = jest.fn();

	jest.mock('app-builder-web/js/utils/toast.es', () => ({
		__esModule: true,
		errorToast: (title) => mockToast(title),
		successToast: (title) => mockToast(title),
	}));

	afterEach(() => {
		cleanup();
		jest.restoreAllMocks();
	});

	it('renders control menu, upperToolbar, sidebar and steps components correctly when creating a new app', async () => {
		fetch.mockResponseOnce(JSON.stringify(roleItems));
		fetch.mockResponseOnce(JSON.stringify(customObjectItems));
		fetch.mockResponseOnce(JSON.stringify(customObjectItems));
		fetch.mockResponseOnce(JSON.stringify(formViewItems));
		fetch.mockResponseOnce(JSON.stringify(tableViewItems));
		fetch.mockResponseOnce(JSON.stringify(tableViewItems));
		fetch.mockResponseOnce(
			JSON.stringify({
				active: false,
				appDeployments: [],
				dataDefinitionId: 37497,
				dataDefinitionName: 'Object 01',
				dataLayoutId: 37625,
				dataListViewId: 37628,
				dataRecordCollectionId: 37725,
				dateCreated: '2020-08-10T19:55:34Z',
				dateModified: '2020-08-10T20:10:37Z',
				id: 37796,
				name: {en_US: 'Test'},
				siteId: 20124,
				userId: 20126,
				version: '1.0',
			})
		);
		fetch.mockResponseOnce(
			JSON.stringify({
				actions: {},
				facets: [],
				items: [
					{
						active: false,
						appDeployments: [],
						dataDefinitionId: 37723,
						dataDefinitionName: 'Object 01',
						dataLayoutId: 37729,
						dataListViewId: 37732,
						dataRecordCollectionId: 37725,
						dateCreated: '2020-08-10T20:20:11Z',
						dateModified: '2020-08-10T20:45:53Z',
						id: 37812,
						name: {
							en_US: 'Test12',
						},
						siteId: 20124,
						userId: 20126,
						version: '1.0',
					},
				],
				lastPage: 1,
				page: 1,
				pageSize: 20,
				totalCount: 1,
			})
		);

		const params = {};

		const routeProps = {
			match: {params},
		};

		const {
			container,
			getAllByText,
			getAllByTitle,
			getByDisplayValue,
			getByLabelText,
			getByPlaceholderText,
			getByText,
			getByTitle,
			queryByText,
		} = render(
			<AppContextProviderWrapper history={history}>
				<EditApp {...routeProps} />
			</AppContextProviderWrapper>
		);

		const deployButton = getByText('deploy');
		const nameInput = getByPlaceholderText('untitled-app');
		const saveButton = getByText('save');
		let stepNameInput = container.querySelector(
			'.form-group-outlined input'
		);
		const steps = container.querySelectorAll('.step');

		expect(queryByText('step-configuration')).toBeTruthy();
		expect(queryByText('new-workflow-powered-app')).toBeTruthy();
		expect(queryByText('cancel')).toBeTruthy();
		expect(steps.length).toBe(2);
		expect(steps[0]).toHaveTextContent('initial-step');
		expect(steps[1]).toHaveTextContent('final-step');
		expect(stepNameInput.value).toBe('initial-step');

		expect(nameInput.value).toBe('');
		expect(saveButton).toBeDisabled();

		await fireEvent.click(getByText('data-and-views'));

		const sidebarHeader = document.querySelector('div.tab-title');

		expect(queryByText('step-configuration')).toBeNull();
		expect(sidebarHeader.children.length).toBe(2);
		expect(sidebarHeader.children[1]).toHaveTextContent('data-and-views');

		await waitForElementToBeRemoved(() =>
			document.querySelector('span.loading-animation')
		);
		await fireEvent.click(getByText('Object 01'));

		expect(getByLabelText('main-data-object')).toHaveTextContent(
			'Object 01'
		);
		expect(getByLabelText('form-view')).toHaveTextContent(
			'select-a-form-view'
		);
		expect(getByLabelText('table-view')).toHaveTextContent(
			'select-a-table-view'
		);

		await waitForElementToBeRemoved(() =>
			document.querySelector('span.loading-animation')
		);

		await fireEvent.click(getByText('Form 01'));
		await fireEvent.click(getByText('Table 01'));

		expect(getByLabelText('form-view')).toHaveTextContent('Form 01');
		expect(getByLabelText('table-view')).toHaveTextContent('Table 01');

		await fireEvent.change(nameInput, {target: {value: 'Test'}});

		expect(deployButton).toBeEnabled();

		await fireEvent.click(getByTitle('create-new-step'));

		expect(deployButton).toBeDisabled();

		stepNameInput = container.querySelector('.form-group-outlined input');

		expect(stepNameInput.value).toBe('step-x');

		await fireEvent.mouseDown(getByText('Account Manager'));

		expect(
			container.querySelector('.label-dismissible span')
		).toHaveTextContent('Account Manager');

		await fireEvent.click(getByText('data-and-views'));

		await fireEvent.click(getByText('add-new-form-view'));

		const stepFormViews = container.querySelectorAll('.step-form-view');

		expect(stepFormViews[0]).toHaveTextContent('Form 01');

		await fireEvent.click(getAllByText('Form 02')[1]);

		expect(stepFormViews[1]).toHaveTextContent('Form 02');

		await fireEvent.click(getAllByTitle('remove')[1]);

		await fireEvent.click(getByTitle('create-new-step'));

		await fireEvent.click(getByText('actions'));

		await fireEvent.change(getByDisplayValue('submit'), {
			target: {value: 'Submit to'},
		});

		await fireEvent.click(getByText('add-new-action'));

		await fireEvent.click(getByText('remove'));

		await fireEvent.click(getAllByText('delete-step')[1]);

		expect(deployButton).toBeEnabled();

		await fireEvent.click(getByText('save'));

		expect(mockToast).toHaveBeenCalledWith(
			'the-app-was-saved-successfully'
		);

		expect(history.push).toHaveBeenCalled();
	});

	it('renders upperToolbar and data and views with respective infos when editing an app', async () => {
		const app = {
			active: false,
			appDeployments: [
				{
					settings: {},
					type: 'standalone',
				},
			],
			dataDefinitionId: 37497,
			dataDefinitionName: 'Object 01',
			dataLayoutId: 37625,
			dataListViewId: 37628,
			dateCreated: '2020-06-08T12:13:14Z',
			dateModified: '2020-06-08T12:13:14Z',
			id: 37634,
			name: {
				en_US: 'Test',
			},
			siteId: 20124,
			userId: 20126,
		};

		const workflow = {
			appId: 37634,
			appWorkflowStates: [
				{
					appWorkflowTransitions: [
						{
							name: 'Submit',
							primary: true,
							transitionTo: 'Step 1',
						},
					],
					initial: true,
					name: 'Start',
				},
				{
					appWorkflowTransitions: [],
					initial: false,
					name: 'Closed',
				},
			],
			appWorkflowTasks: [
				{
					appWorkflowDataLayoutLinks: [
						{
							dataLayoutId: 37625,
							readOnly: true,
						},
					],
					appWorkflowRoleAssignments: [
						{
							roleId: 37238,
							roleName: 'Account Manager',
						},
					],
					appWorkflowTransitions: [
						{
							name: 'Close',
							primary: true,
							transitionTo: 'Closed',
						},
					],
					name: 'Step 1',
				},
			],
		};

		fetch.mockResponseOnce(JSON.stringify(roleItems));
		fetch.mockResponseOnce(JSON.stringify(customObjectItems));
		fetch.mockResponseOnce(JSON.stringify(app));
		fetch.mockResponseOnce(JSON.stringify(workflow));
		fetch.mockResponseOnce(JSON.stringify(customObjectItems.items[0]));
		fetch.mockResponseOnce(JSON.stringify(formViewItems));
		fetch.mockResponseOnce(JSON.stringify(tableViewItems));
		fetch.mockResponseOnce(JSON.stringify(customObjectItems));
		fetch.mockResponseOnce(JSON.stringify(formViewItems));
		fetch.mockResponseOnce(JSON.stringify(tableViewItems));
		fetch.mockResponseOnce(JSON.stringify(formViewItems));

		const routeProps = {
			match: {params: {appId: '37634'}},
		};

		const {
			container,
			getByLabelText,
			getByPlaceholderText,
			getByText,
		} = render(
			<AppContextProviderWrapper history={history}>
				<EditApp {...routeProps} />
			</AppContextProviderWrapper>
		);

		await waitForElementToBeRemoved(() =>
			document.querySelector('span.loading-animation')
		);

		const steps = container.querySelectorAll('.step-card');
		let stepNameInput = container.querySelector(
			'.form-group-outlined input'
		);

		expect(steps.length).toBe(3);
		expect(steps[0]).toHaveTextContent('Start');
		expect(steps[1]).toHaveTextContent('Step 1');
		expect(steps[2]).toHaveTextContent('Closed');
		expect(stepNameInput.value).toBe('Start');

		const dataAndViewsButton = container.querySelectorAll(
			'.sidebar-body button'
		)[0];

		expect(dataAndViewsButton).toHaveTextContent('Form 01');
		expect(dataAndViewsButton).toHaveTextContent('Table 01');

		await fireEvent.click(dataAndViewsButton);

		await waitForElementToBeRemoved(() =>
			document.querySelector('span.loading-animation')
		);

		expect(getByPlaceholderText('untitled-app').value).toBe('Test');
		expect(getByLabelText('main-data-object')).toHaveTextContent(
			'Object 01'
		);
		expect(getByLabelText('form-view')).toHaveTextContent('Form 01');
		expect(getByLabelText('table-view')).toHaveTextContent('Table 01');
		expect(getByText('deploy')).toBeEnabled();

		await fireEvent.click(steps[1]);

		stepNameInput = container.querySelector('.form-group-outlined input');

		expect(stepNameInput.value).toBe('Step 1');
		expect(container.querySelector('h3.title')).toHaveTextContent(
			'step-configuration'
		);

		expect(
			container.querySelector('.label-dismissible span')
		).toHaveTextContent('Account Manager');
		expect(
			container.querySelectorAll('.tab-button span')[1].parentElement
		).toHaveTextContent('Form 01');

		await fireEvent.click(steps[2]);

		stepNameInput = container.querySelector('.form-group-outlined input');

		expect(stepNameInput.value).toBe('Closed');

		await fireEvent.change(stepNameInput, {target: {value: 'End'}});

		expect(stepNameInput.value).toBe('End');
		expect(steps[2]).toHaveTextContent('End');

		await fireEvent.click(getByText('cancel'));

		expect(history.push).toHaveBeenCalled();
	});
});
