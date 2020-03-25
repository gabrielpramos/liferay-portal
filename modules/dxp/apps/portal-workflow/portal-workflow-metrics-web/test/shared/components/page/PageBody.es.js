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

import {cleanup, render} from '@testing-library/react';
import React from 'react';

import {PageBody} from '../../../../src/main/resources/META-INF/resources/js/shared/components/page/PageBody.es';

import '@testing-library/jest-dom/extend-expect';
describe('The PageBody component should', () => {
	afterEach(cleanup);

	test('Be rendered with empty view and the expected message', () => {
		const {getByTestId} = render(
			<PageBody.EmptyView message={'no-results-were-found'} />
		);

		const emptyState = getByTestId('emptyState');

		expect(emptyState).toHaveTextContent('no-results-were-found');
	});

	test('Be rendered with error view and the expected message', () => {
		const {getByTestId} = render(
			<PageBody.ErrorView
				message={
					'there-was-a-problem-retrieving-data-please-try-reloading-the-page'
				}
			/>
		);

		const emptyState = getByTestId('emptyState');

		expect(emptyState).toHaveTextContent(
			'there-was-a-problem-retrieving-data-please-try-reloading-the-page'
		);
	});

	test('Be rendered with loading view', async () => {
		const {getByTestId} = render(<PageBody.LoadingView />);

		const loadingStateDiv = getByTestId('loadingState');

		expect(loadingStateDiv).not.toBeNull();
	});
});
