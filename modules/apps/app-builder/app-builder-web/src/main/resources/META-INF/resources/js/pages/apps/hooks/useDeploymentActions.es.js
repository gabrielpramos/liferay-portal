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

import ClayButton from '@clayui/button';
import ClayList from '@clayui/list';
import {Context} from '@clayui/modal';
import React, {useContext} from 'react';

import {updateItem} from '../../../utils/client.es';
import {DEPLOYMENT_ACTION} from '../constants.es';
import {concatTypes} from '../utils.es';

export default () => {
	const [{onClose}, dispatch] = useContext(Context);

	const deployApp = (item, undeploy) => {
		return updateItem(
			`/o/app-builder/v1.0/apps/${item.id}/deployment`,
			{},
			{deploymentAction: undeploy ? 'undeploy' : 'deploy'}
		)
			.then(() => true)
			.catch((error) => error);
	};

	const openUndeployAppModal = (app) => {
		return new Promise((resolve, reject) => {
			dispatch({
				payload: {
					body: (
						<>
							<p>{Liferay.Language.get('undeploy-warning')}</p>
							<ClayList>
								<ClayList.Header>
									{Liferay.Language.get('app')}
								</ClayList.Header>
								<ClayList.Item flex>
									<ClayList.ItemField expand>
										<span>
											<b>
												{Liferay.Language.get('name')}:
											</b>{' '}
											{app.nameText}
										</span>
										<span>
											<b>
												{Liferay.Language.get(
													'deployed-as'
												)}
												:
											</b>{' '}
											{concatTypes(
												app.appDeployments.map(
													(deployment) =>
														deployment.type
												)
											)}
										</span>
										<span>
											<b>
												{Liferay.Language.get(
													'modified-date'
												)}
												:
											</b>{' '}
											{app.dateModified}
										</span>
									</ClayList.ItemField>
								</ClayList.Item>
							</ClayList>
						</>
					),
					footer: [
						<></>,
						<></>,
						<ClayButton.Group key={0} spaced>
							<ClayButton
								displayType="secondary"
								key={1}
								onClick={onClose}
							>
								{Liferay.Language.get('cancel')}
							</ClayButton>
							<ClayButton
								key={2}
								onClick={() => {
									deployApp(app, true)
										.then((result) => {
											onClose();
											resolve(result);
										})
										.catch(reject);
								}}
							>
								{DEPLOYMENT_ACTION.undeploy}
							</ClayButton>
						</ClayButton.Group>,
					],
					header: DEPLOYMENT_ACTION.undeploy,
					size: 'lg',
					status: 'warning',
				},
				type: 1,
			});
		});
	};

	return {deployApp, openUndeployAppModal};
};
