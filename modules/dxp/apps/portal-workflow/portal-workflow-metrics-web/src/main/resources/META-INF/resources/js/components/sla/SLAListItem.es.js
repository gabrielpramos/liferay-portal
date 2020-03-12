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

import ClayButton from '@clayui/button';
import ClayDropDown from '@clayui/drop-down';
import ClayIcon from '@clayui/icon';
import ClayTable from '@clayui/table';
import React, {useCallback, useContext, useState} from 'react';

import {ChildLink} from '../../shared/components/router/routerWrapper.es';
import {formatDuration} from '../../shared/util/duration.es';
import moment from '../../shared/util/moment.es';
import SLAListCardContext from './SLAListCardContext.es';

const SLAListItem = ({
	dateModified,
	description,
	duration,
	id,
	name,
	processId,
	status,
}) => {
	const [active, setActive] = useState(false);
	const {showConfirmDialog} = useContext(SLAListCardContext);
	const deleteHandler = useCallback(() => {
		showConfirmDialog(id);
		setActive(false);
	}, [id, showConfirmDialog]);

	const blocked = status === 2;
	const durationString = formatDuration(duration);

	const blockedStatusClass = blocked ? 'text-danger' : '';

	const statusText = blocked
		? Liferay.Language.get('blocked')
		: Liferay.Language.get('running');

	return (
		<ClayTable.Row>
			<ClayTable.Cell data-testid="SLAName">
				<div className="table-list-title">
					{blocked && (
						<ClayIcon
							className="text-danger"
							symbol="exclamation-full"
						/>
					)}{' '}
					<ChildLink to={`/sla/edit/${processId}/${id}`}>
						{name}
					</ChildLink>
				</div>
			</ClayTable.Cell>

			<ClayTable.Cell data-testid="SLADescription">
				{description}
			</ClayTable.Cell>

			<ClayTable.Cell className={blockedStatusClass}>
				{statusText}
			</ClayTable.Cell>

			<ClayTable.Cell data-testid="SLADuration">
				{durationString}
			</ClayTable.Cell>

			<ClayTable.Cell data-testid="SLADateModified">
				{moment
					.utc(dateModified)
					.format(Liferay.Language.get('mmm-dd'))}
			</ClayTable.Cell>

			<ClayTable.Cell className="actions">
				<ClayDropDown
					active={active}
					onActiveChange={setActive}
					trigger={
						<ClayButton
							className="component-action"
							data-testid="slaDropDownButton"
							displayType="unstyled"
							monospaced
						>
							<ClayIcon symbol="ellipsis-v" />
						</ClayButton>
					}
				>
					<ClayDropDown.ItemList>
						<li>
							<ChildLink
								className="dropdown-item"
								to={`/sla/edit/${processId}/${id}`}
							>
								{Liferay.Language.get('edit')}
							</ChildLink>
						</li>
						<li>
							<ClayButton
								className="dropdown-item"
								data-testid="deleteButton"
								onClick={deleteHandler}
							>
								{Liferay.Language.get('delete')}
							</ClayButton>
						</li>
					</ClayDropDown.ItemList>
				</ClayDropDown>
			</ClayTable.Cell>
		</ClayTable.Row>
	);
};

export default SLAListItem;
