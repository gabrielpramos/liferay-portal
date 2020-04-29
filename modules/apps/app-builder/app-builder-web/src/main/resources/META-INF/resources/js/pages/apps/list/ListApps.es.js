/**
 * Copyright (c) 2000-present Liferay, Inc. All rights reserved.
 *
 * This library is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Lesser General Public License as published by the Free
 * Software Foundation; either version 2.1 of the License, or (at your option)
 * any later version.
 *
 * This library is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more
 * details.
 */

import ClayLabel from '@clayui/label';
import React, {useContext, useMemo} from 'react';
import {Link} from 'react-router-dom';

import {AppContext} from '../../../AppContext.es';
import Button from '../../../components/button/Button.es';
import ListView from '../../../components/list-view/ListView.es';
import {confirmDelete} from '../../../utils/client.es';
import {fromNow} from '../../../utils/time.es';
import {DEPLOYMENT_ACTION, DEPLOYMENT_STATUS} from '../constants.es';
import useDeploymentActions from '../hooks/useDeploymentActions.es';
import {concatTypes, isDeployed} from '../utils.es';

export default ({
	match: {
		params: {dataDefinitionId},
		url,
	},
}) => {
	const {getStandaloneURL} = useContext(AppContext);
	const {deployApp, openUndeployAppModal} = useDeploymentActions();

	const ACTIONS = [
		{
			action: (item) => {
				return isDeployed(item.statusText)
					? openUndeployAppModal(item)
					: deployApp(item);
			},
			name: (item) =>
				isDeployed(item.statusText)
					? DEPLOYMENT_ACTION.undeploy
					: DEPLOYMENT_ACTION.deploy,
		},
		{
			action: (item) =>
				Promise.resolve(
					window.open(getStandaloneURL(item.id), '_blank')
				),
			name: Liferay.Language.get('open-standalone-app'),
			show: (item) =>
				item.appDeployments.some(
					(deployment) => deployment.type === 'standalone'
				),
		},
		{
			action: confirmDelete('/o/app-builder/v1.0/apps/'),
			name: Liferay.Language.get('delete'),
		},
	];

	const addButton = () => (
		<Button
			className="nav-btn nav-btn-monospaced"
			href={`${url}/deploy`}
			symbol="plus"
			tooltip={Liferay.Language.get('new-app')}
		/>
	);

	let COLUMNS = [
		{
			key: 'name',
			sortable: !!dataDefinitionId,
			value: Liferay.Language.get('name'),
		},
		{
			key: 'type',
			value: Liferay.Language.get('deployed-as'),
		},
		{
			key: 'dateCreated',
			sortable: !!dataDefinitionId,
			value: Liferay.Language.get('create-date'),
		},
		{
			asc: false,
			key: 'dateModified',
			sortable: !!dataDefinitionId,
			value: Liferay.Language.get('modified-date'),
		},
		{
			key: 'status',
			value: Liferay.Language.get('status'),
		},
	];

	const EMPTY_STATE = {
		title: Liferay.Language.get('there-are-no-apps-yet'),
	};

	if (dataDefinitionId) {
		EMPTY_STATE.description = Liferay.Language.get(
			'select-the-form-and-table-view-you-want-and-deploy-your-app-as-a-widget-standalone-or-place-it-in-the-product-menu'
		);
		EMPTY_STATE.button = () => (
			<Button displayType="secondary" href={`${url}/deploy`}>
				{Liferay.Language.get('new-app')}
			</Button>
		);
	}
	else {
		const [nameColumn, ...otherColumns] = COLUMNS;

		COLUMNS = [
			nameColumn,
			{key: 'dataDefinitionName', value: Liferay.Language.get('object')},
			...otherColumns,
		];
	}

	const ENDPOINT_APPS = `/o/app-builder/v1.0/apps`;
	const ENDPOINT_CUSTOM_OBJECT = `/o/app-builder/v1.0/data-definitions/${dataDefinitionId}/apps`;

	const ENDPOINT = useMemo(
		() => (dataDefinitionId ? ENDPOINT_CUSTOM_OBJECT : ENDPOINT_APPS),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[dataDefinitionId]
	);

	return (
		<ListView
			actions={ACTIONS}
			addButton={dataDefinitionId && addButton}
			columns={COLUMNS}
			emptyState={EMPTY_STATE}
			endpoint={ENDPOINT}
		>
			{(item) => ({
				...item,
				dateCreated: fromNow(item.dateCreated),
				dateModified: fromNow(item.dateModified),
				name: dataDefinitionId ? (
					<Link
						to={`/custom-object/${dataDefinitionId}/apps/${item.id}`}
					>
						{item.name.en_US}
					</Link>
				) : (
					item.name.en_US
				),
				nameText: item.name.en_US,
				status: (
					<ClayLabel
						displayType={
							isDeployed(item.status.toLowerCase())
								? 'success'
								: 'secondary'
						}
					>
						{DEPLOYMENT_STATUS[item.status.toLowerCase()]}
					</ClayLabel>
				),
				statusText: item.status.toLowerCase(),
				type: concatTypes(
					item.appDeployments.map((deployment) => deployment.type)
				),
			})}
		</ListView>
	);
};
