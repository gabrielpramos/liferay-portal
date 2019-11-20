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

const filterKeys = {
	assignee: 'assigneeUserIds',
	processStatus: 'statuses',
	processStep: 'taskKeys',
	roles: 'roleIds',
	slaStatus: 'slaStatuses',
	timeRange: 'timeRange',
	timeRangeDateEnd: 'dateEnd',
	timeRangeDateStart: 'dateStart'
};

const filterTitles = {
	assignee: Liferay.Language.get('assignee'),
	processStatus: Liferay.Language.get('process-status'),
	processStep: Liferay.Language.get('process-step'),
	roles: Liferay.Language.get('roles'),
	slaStatus: Liferay.Language.get('sla-status')
};

export {filterKeys, filterTitles};
