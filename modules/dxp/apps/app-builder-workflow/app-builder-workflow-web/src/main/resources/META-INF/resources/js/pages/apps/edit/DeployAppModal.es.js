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
import ClayIcon from '@clayui/icon';
import ClayLink from '@clayui/link';
import ClayModal, {useModal} from '@clayui/modal';
import {AppContext} from 'app-builder-web/js/AppContext.es';
import {DeploySettings} from 'app-builder-web/js/pages/apps/edit/DeployApp.es';
import EditAppContext from 'app-builder-web/js/pages/apps/edit/EditAppContext.es';
import {parseResponse} from 'app-builder-web/js/utils/client.es';
import {errorToast, successToast} from 'app-builder-web/js/utils/toast.es';
import {createResourceURL, fetch} from 'frontend-js-web';
import React, {useContext, useState} from 'react';

export default ({onCancel}) => {
	const {
		appId,
		config: {assigneesRoles, dataObject, steps},
		isModalVisible,
		setModalVisible,
		state: {app},
	} = useContext(EditAppContext);
	const {baseResourceURL, getStandaloneURL, namespace} = useContext(
		AppContext
	);
	const [isDeploying, setDeploying] = useState(false);

	const {observer, onClose} = useModal({
		onClose: () => setModalVisible(false),
	});

	if (!isModalVisible) {
		return <></>;
	}

	const getStandaloneLink = ({appDeployments, id}) => {
		const isStandalone = appDeployments.some(
			({type}) => type === 'standalone'
		);

		if (!isStandalone) {
			return <></>;
		}

		return (
			<ClayLink href={getStandaloneURL(id)} target="_blank">
				{`${Liferay.Language.get('open-standalone-app')}. `}
				<ClayIcon symbol="shortcut" />
			</ClayLink>
		);
	};

	const onSuccess = ({app}) => {
		onClose();
		successToast(
			<>
				{Liferay.Language.get('the-app-was-deployed-successfully')}{' '}
				{getStandaloneLink(app)}
			</>
		);
		setDeploying(false);
		setModalVisible(false);

		onCancel();
	};

	const onError = ({title}) => {
		onClose();
		errorToast(title ? `${title}.` : title);
		setDeploying(false);
		setModalVisible(false);
	};

	const onClickDeploy = () => {
		setDeploying(true);

		const workflowAppSteps = [...steps];

		const workflowApp = {
			appWorkflowStates: [
				workflowAppSteps.shift(),
				workflowAppSteps.pop(),
			],
			appWorkflowTasks: workflowAppSteps.map((appWorkflowTask) => ({
				...appWorkflowTask,
				appWorkflowRoleAssignments: assigneesRoles,
			})),
		};

		if (appId) {
			fetch(
				createResourceURL(baseResourceURL, {
					p_p_resource_id: '/app_builder/update_workflow_app',
				}),
				{
					body: new URLSearchParams(
						Liferay.Util.ns(namespace, {
							app: JSON.stringify(app),
							appBuilderAppId: appId,
							appWorkflow: JSON.stringify(workflowApp),
						})
					),
					method: 'POST',
				}
			)
				.then(parseResponse)
				.then(onSuccess)
				.catch(onError);
		} else {
			fetch(
				createResourceURL(baseResourceURL, {
					p_p_resource_id: '/app_builder/add_workflow_app',
				}),
				{
					body: new URLSearchParams(
						Liferay.Util.ns(namespace, {
							app: JSON.stringify(app),
							appWorkflow: JSON.stringify(workflowApp),
							dataDefinitionId: dataObject.id,
						})
					),
					method: 'POST',
				}
			)
				.then(parseResponse)
				.then(onSuccess)
				.catch(onError);
		}
	};

	return (
		<ClayModal observer={observer} size="md">
			<ClayModal.Header>
				{Liferay.Language.get('deploy')}
			</ClayModal.Header>

			<div className="modal-body px-0">
				<DeploySettings />
			</div>

			<ClayModal.Footer
				last={
					<>
						<ClayButton
							className="mr-3"
							displayType="secondary"
							onClick={onClose}
							small
						>
							{Liferay.Language.get('cancel')}
						</ClayButton>

						<ClayButton
							disabled={
								isDeploying || app.appDeployments.length === 0
							}
							onClick={onClickDeploy}
							small
						>
							{Liferay.Language.get('done')}
						</ClayButton>
					</>
				}
			/>
		</ClayModal>
	);
};
