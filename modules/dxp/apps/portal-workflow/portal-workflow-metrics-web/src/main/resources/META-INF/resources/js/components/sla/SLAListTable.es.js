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

import ClayTable from '@clayui/table';
import React, {useMemo} from 'react';

import SLAListItem from './SLAListItem.es';

const SLAListTable = ({items}) => {
	const blockedItems = useMemo(
		() => items.filter(({status}) => status === 2),
		[items]
	);

	const showBlockedDivider = blockedItems.length > 0;
	const unblockedItems = useMemo(
		() => items.filter(({status}) => status !== 2),
		[items]
	);

	const showRunningDivider = showBlockedDivider && unblockedItems.length > 0;

	return (
		<ClayTable>
			<ClayTable.Head>
				<ClayTable.Row>
					<ClayTable.Cell headingCell style={{width: '27%'}}>
						{Liferay.Language.get('sla-name')}
					</ClayTable.Cell>

					<ClayTable.Cell headingCell style={{width: '24%'}}>
						{Liferay.Language.get('description')}
					</ClayTable.Cell>

					<ClayTable.Cell headingCell style={{width: '17%'}}>
						{Liferay.Language.get('status')}
					</ClayTable.Cell>

					<ClayTable.Cell headingCell style={{width: '17%'}}>
						{Liferay.Language.get('duration')}
					</ClayTable.Cell>

					<ClayTable.Cell headingCell style={{width: '25%'}}>
						{Liferay.Language.get('last-modified')}
					</ClayTable.Cell>

					<ClayTable.Cell />
				</ClayTable.Row>
			</ClayTable.Head>

			<ClayTable.Body>
				{showBlockedDivider && (
					<tr className="table-divider">
						<td colSpan="9">
							{Liferay.Language.get('blocked').toUpperCase()}
						</td>
					</tr>
				)}

				{blockedItems.map((sla, index) => (
					<SLAListItem {...sla} key={`blocked_${index}`} status={2} />
				))}

				{showRunningDivider && (
					<tr className="table-divider">
						<td colSpan="9">
							{Liferay.Language.get('running').toUpperCase()}
						</td>
					</tr>
				)}

				{unblockedItems.map((sla, index) => (
					<SLAListItem {...sla} key={`unblocked_${index}`} />
				))}
			</ClayTable.Body>
		</ClayTable>
	);
};

export default SLAListTable;
