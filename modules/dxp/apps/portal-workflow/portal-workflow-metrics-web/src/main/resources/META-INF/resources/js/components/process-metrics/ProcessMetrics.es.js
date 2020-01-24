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

import React, {useContext, useState, useEffect, useCallback} from 'react';
import {Route, Switch} from 'react-router-dom';

import {parse, stringify} from '../../shared/components/router/queryString.es';
import {
	getPathname,
	withParams
} from '../../shared/components/router/routerUtil.es';
import {ChildLink} from '../../shared/components/router/routerWrapper.es';
import Tabs from '../../shared/components/tabs/Tabs.es';
import {sub} from '../../shared/util/lang.es';
import {openErrorToast} from '../../shared/util/toast.es';
import {AppContext} from '../AppContext.es';
import {useTimeRangeFetch} from '../filter/hooks/useTimeRangeFetch.es';
import AlertMessage from './AlertMessage.es';
import DropDownHeader from './DropDownHeader.es';
import CompletionVelocityCard from './completion-velocity/CompletionVelocityCard.es';
import PerformanceByAssigneeCard from './performance-by-assignee-card/PerformanceByAssigneeCard.es';
import PerformanceByStepCard from './performance-by-step-card/PerformanceByStepCard.es';
import CompletedItemsCard from './process-items/CompletedItemsCard.es';
import PendingItemsCard from './process-items/PendingItemsCard.es';
import WorkloadByAssigneeCard from './workload-by-assignee-card/WorkloadByAssigneeCard.es';
import WorkloadByStepCard from './workload-by-step-card/WorkloadByStepCard.es';

const ProcessMetrics = props => {
	const {history, processId, query} = props;
	const {client, defaultDelta} = useContext(AppContext);
	const [blockedSLACount, setBlockedSLACount] = useState(0);
	const [slaCount, setSlaCount] = useState(null);

	const loadBlockedSLACount = useCallback(() => {
		return client
			.get(`/processes/${processId}/slas?page=1&pageSize=1&status=2`)
			.then(({data: {totalCount}}) => totalCount)
			.catch(showLoadingError);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [processId]);

	const loadSLACount = useCallback(() => {
		return client
			.get(`/processes/${processId}/slas?page=1&pageSize=1`)
			.then(({data: {totalCount}}) => totalCount)
			.catch(showLoadingError);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [processId]);

	const showLoadingError = () => {
		openErrorToast({
			message: Liferay.Language.get(
				'there-was-a-problem-retrieving-data-please-try-reloading-the-page'
			)
		});
	};

	useEffect(() => {
		Promise.all([loadBlockedSLACount(), loadSLACount()])
			.then(([blockedSLACount, slaCount]) => {
				setBlockedSLACount(blockedSLACount);
				setSlaCount(slaCount);
			})
			.catch(showLoadingError);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	let blockedSLAText = Liferay.Language.get('x-sla-is-blocked');

	if (blockedSLACount !== 1) {
		blockedSLAText = Liferay.Language.get('x-slas-are-blocked');
	}

	const dashboardTab = {
		key: 'dashboard',
		name: Liferay.Language.get('dashboard'),
		params: {
			page: 1,
			pageSize: defaultDelta,
			processId,
			sort: encodeURIComponent('overdueInstanceCount:asc')
		},
		path: '/metrics/:processId/dashboard/:pageSize/:page/:sort'
	};
	const performanceTab = {
		key: 'performance',
		name: Liferay.Language.get('performance'),
		params: {
			processId
		},
		path: '/metrics/:processId/performance'
	};

	if (history.location.pathname === `/metrics/${processId}`) {
		const pathname = getPathname(dashboardTab.params, dashboardTab.path);

		const search = stringify({
			...parse(query),
			filters: {taskKeys: ['allSteps']}
		});

		history.replace({pathname, search});
	}

	return (
		<div
			className="workflow-process-dashboard"
			data-testid="processMetricsDashBoard"
		>
			<DropDownHeader>
				<DropDownHeader.Item>
					<ChildLink
						className="dropdown-item"
						to={`/slas/${processId}/${defaultDelta}/1`}
					>
						{Liferay.Language.get('sla-settings')}
					</ChildLink>
				</DropDownHeader.Item>
			</DropDownHeader>

			<Tabs tabs={[dashboardTab, performanceTab]} />

			{blockedSLACount !== 0 && (
				<AlertMessage className="mb-0" iconName="exclamation-full">
					<>
						{`${sub(blockedSLAText, [
							blockedSLACount
						])} ${Liferay.Language.get(
							'fix-the-sla-configuration-to-resume-accurate-reporting'
						)} `}

						<ChildLink to={`/slas/${processId}/${defaultDelta}/1`}>
							<strong>
								{Liferay.Language.get('set-up-slas')}
							</strong>
						</ChildLink>
					</>
				</AlertMessage>
			)}

			{slaCount === 0 && (
				<AlertMessage
					className="mb-0"
					iconName="warning-full"
					type="warning"
				>
					<>
						{`${Liferay.Language.get(
							'no-slas-are-defined-for-this-process'
						)} `}

						<ChildLink to={`/sla/new/${processId}`}>
							<strong>
								{Liferay.Language.get('add-a-new-sla')}
							</strong>
						</ChildLink>
					</>
				</AlertMessage>
			)}

			<Switch>
				<Route
					exact
					path={dashboardTab.path}
					render={withParams(DashboardTab)}
				/>

				<Route
					exact
					path={performanceTab.path}
					render={withParams(PerformanceTab)}
				/>
			</Switch>
		</div>
	);
};

const DashboardTab = props => {
	return (
		<div className="container-fluid-1280">
			<div className="row">
				<div className="col-md-9 p-0">
					<PendingItemsCard {...props} />

					<WorkloadByStepCard {...props} />
				</div>

				<div className="col-md-3 p-0">
					<WorkloadByAssigneeCard {...props} />
				</div>
			</div>
		</div>
	);
};

const PerformanceTab = props => {
	useTimeRangeFetch();

	return (
		<>
			<CompletedItemsCard {...props} />
			<CompletionVelocityCard {...props} />
			<PerformanceByStepCard {...props} />
			<PerformanceByAssigneeCard {...props} />
		</>
	);
};

export default ProcessMetrics;
