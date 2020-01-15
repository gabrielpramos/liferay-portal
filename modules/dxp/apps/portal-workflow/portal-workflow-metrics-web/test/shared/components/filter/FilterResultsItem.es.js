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

import React from 'react';
import renderer from 'react-test-renderer';

import {FilterResultsItem} from '../../../../src/main/resources/META-INF/resources/js/shared/components/filter/FilterResultsItem.es';
import {MockRouter} from '../../../mock/MockRouter.es';

test('Should render component', () => {
	const filter = {
		items: [
			{
				active: true,
				key: 'overdue',
				name: 'Overdue'
			},
			{
				active: false,
				key: 'ontime',
				name: 'On Time'
			}
		],
		key: 'slaStatus',
		name: 'SLA Status'
	};

	const component = renderer.create(
		<MockRouter>
			<FilterResultsItem filter={filter} item={filter.items[0]} />
		</MockRouter>
	);

	const tree = component.toJSON();

	expect(tree).toMatchSnapshot();
});
