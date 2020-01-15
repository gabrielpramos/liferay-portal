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

import ProcessMetrics from '../../../src/main/resources/META-INF/resources/js/components/process-metrics/ProcessMetrics.es';
import {MockRouter} from '../../mock/MockRouter.es';
import fetch from '../../mock/fetch.es';
import fetchFailure from '../../mock/fetchFailure.es';

beforeAll(() => {
	const vbody = document.createElement('div');

	vbody.innerHTML = `
		<div id="workflow">
			<div class="user-control-group">
				<div class="control-menu-icon"></div>
			</div>
		</div>
	`;
	document.body.appendChild(vbody);
});

test('Should render component with completed tab activated', () => {
	const component = mount(
		<MockRouter
			client={fetchFailure()}
			initialPath="/metrics/35315"
			path="/metrics/:processId"
		>
			<ProcessMetrics />
		</MockRouter>
	);

	expect(component).toMatchSnapshot();
});

test('Should render component with default tab activated', () => {
	const data = {
		id: 35315,
		onTimeInstanceCount: 1,
		overdueInstanceCount: 0,
		title: 'Single Approver',
		totalCount: 1
	};

	const component = mount(
		<MockRouter
			client={fetch({data})}
			initialPath="/metrics/35315/dashboard"
			path="/metrics/:processId"
		>
			<ProcessMetrics />
		</MockRouter>
	);

	expect(component).toMatchSnapshot();
});

test('Should render component with failure state', () => {
	const component = mount(
		<MockRouter
			client={fetchFailure()}
			initialPath="/metrics/35315/performance"
			path="/metrics/:processId"
		>
			<ProcessMetrics />
		</MockRouter>
	);

	expect(component).toMatchSnapshot();
});

test('Should render with blocked SLA', () => {
	const component = mount(
		<MockRouter
			client={fetchFailure()}
			initialPath="/metrics/35315/performance"
			path="/metrics/:processId"
		>
			<ProcessMetrics />
		</MockRouter>
	);

	const instance = component.find(ProcessMetrics).instance();

	instance.setState({blockedSLACount: 1}, () => {
		expect(component).toMatchSnapshot();
	});
});
