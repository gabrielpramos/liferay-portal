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

import {filterKeys} from '../../../shared/components/filter/util/filterConstants.es';
import {ChildLink} from '../../../shared/components/router/routerWrapper.es';
import {AppContext} from '../../AppContext.es';
import {processStatusConstants} from '../../filter/ProcessStatusFilter.es';

class WorkloadByStepCardItem extends React.Component {
	constructor(props) {
		super(props);
	}

	getFiltersQuery(slaStatusFilter) {
		const {taskKey} = this.props;

		return {
			[filterKeys.processStatus]: [processStatusConstants.pending],
			[filterKeys.processStep]: [taskKey],
			[filterKeys.slaStatus]: [slaStatusFilter]
		};
	}

	render() {
		const {defaultDelta} = this.context;
		const {
			instanceCount = '-',
			name,
			onTimeInstanceCount = '-',
			overdueInstanceCount = '-',
			processId
		} = this.props;

		const instancesListPath = `/instance/${processId}/${defaultDelta}/1`;

		return (
			<tr>
				<td className="lfr-title-column table-cell-expand table-cell-minw-200 table-title">
					{name}
				</td>

				<td className="text-right">
					<ChildLink
						className="workload-by-step-link"
						query={{filters: this.getFiltersQuery('Overdue')}}
						to={instancesListPath}
					>
						{overdueInstanceCount}
					</ChildLink>
				</td>

				<td className="text-right">
					<ChildLink
						className="workload-by-step-link"
						query={{filters: this.getFiltersQuery('OnTime')}}
						to={instancesListPath}
					>
						{onTimeInstanceCount}
					</ChildLink>
				</td>

				<td className="text-right">
					<ChildLink
						className="workload-by-step-link"
						query={{filters: this.getFiltersQuery()}}
						to={instancesListPath}
					>
						{instanceCount}
					</ChildLink>
				</td>
			</tr>
		);
	}
}

WorkloadByStepCardItem.contextType = AppContext;
export default WorkloadByStepCardItem;
