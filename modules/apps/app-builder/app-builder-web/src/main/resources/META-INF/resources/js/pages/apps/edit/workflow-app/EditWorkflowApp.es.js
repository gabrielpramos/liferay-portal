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
import ClayIcon from '@clayui/icon';
import ClayLink from '@clayui/link';
import ClayModal, {useModal} from '@clayui/modal';
import {ClayTooltipProvider} from '@clayui/tooltip';
import {Sidebar} from 'data-engine-taglib';
import React, {useContext, useEffect, useReducer, useState} from 'react';
import {withRouter} from 'react-router-dom';

import {AppContext} from '../../../../AppContext.es';
import ControlMenu from '../../../../components/control-menu/ControlMenu.es';
import {Loading} from '../../../../components/loading/Loading.es';
import UpperToolbar from '../../../../components/upper-toolbar/UpperToolbar.es';
import {addItem, getItem, updateItem} from '../../../../utils/client.es';
import {errorToast, successToast} from '../../../../utils/toast.es';
import SelectObjects from '../../SelectObjectsDropDown.es';
import DeployApp from '../DeployApp.es';
import EditAppContext, {
	UPDATE_APP,
	UPDATE_DATA_LAYOUT_ID,
	UPDATE_DATA_LIST_VIEW_ID,
	UPDATE_NAME,
	reducer,
} from '../EditAppContext.es';
import SelectFormView from './SelectFormViewDropdown.es';
import SelectTableView from './SelectTableViewDropdown.es';

export default withRouter(
	({
		history,
		match: {
			params: {appId},
		},
		scope,
	}) => {
		const {getStandaloneURL} = useContext(AppContext);

		const [{app}, dispatch] = useReducer(reducer, {
			app: {
				active: true,
				appDeployments: [],
				dataLayoutId: null,
				dataListViewId: null,
				name: {
					en_US: '',
				},
				scope,
			},
		});

		const [isDataViewsOpen, setDataViewsOpen] = useState(false);
		const [isDeployAppVisible, setDeployAppVisible] = useState(false);
		const [isLoading, setLoading] = useState(false);
		const [selectedFormView, setSelectedFormView] = useState({
			id: undefined,
			name: undefined,
		});
		const [selectedObject, setSelectedObject] = useState({
			id: undefined,
			name: undefined,
		});
		const [selectedTableView, setSelectedTableView] = useState({
			id: undefined,
			name: undefined,
		});

		const {id: formViewId, name: formViewName} = selectedFormView;
		const {id: customObjectId, name: customObjectName} = selectedObject;
		const {id: tableViewId, name: tableViewName} = selectedTableView;

		const {observer, onClose} = useModal({
			onClose: () => setDeployAppVisible(false),
		});

		useEffect(() => {
			if (appId) {
				setLoading(true);

				getItem(`/o/app-builder/v1.0/apps/${appId}`)
					.then((app) => {
						dispatch({
							app,
							type: UPDATE_APP,
						});

						setLoading(false);
					})
					.catch((_) => setLoading(false));
			}
		}, [appId]);

		let title = Liferay.Language.get('new-workflow-powered-app');

		if (appId) {
			title = Liferay.Language.get('edit-workflow-powered-app');
		}

		const getStandaloneLink = (appId) => {
			const isStandalone = app.appDeployments.some(
				(deployment) => deployment.type === 'standalone'
			);

			if (!isStandalone) {
				return <></>;
			}

			const url = getStandaloneURL(appId);

			return (
				<ClayLink href={url} target="_blank">
					{`${Liferay.Language.get('open-standalone-app')}.`}{' '}
					<ClayIcon symbol="shortcut" />
				</ClayLink>
			);
		};

		const onSuccess = (appId) => {
			successToast(
				<>
					{Liferay.Language.get('the-app-was-deployed-successfully')}{' '}
					{getStandaloneLink(appId)}
				</>
			);

			setDeployAppVisible(false);
		};

		const onError = (error) => {
			const {title = ''} = error;
			errorToast(`${title}.`);
			setDeployAppVisible(false);
		};

		const onCancel = () => {
			history.goBack();
		};

		const onChangeName = (event) => {
			const appName = event.target.value;

			dispatch({appName, type: UPDATE_NAME});
		};

		const onDeploy = () => {
			if (appId) {
				updateItem(`/o/app-builder/v1.0/apps/${appId}`, app)
					.then(() => onSuccess(appId))
					.then(onCancel)
					.catch(onError);
			} else {
				addItem(
					`/o/app-builder/v1.0/data-definitions/${customObjectId}/apps`,
					app
				)
					.then((app) => onSuccess(app.id))
					.then(onCancel)
					.catch(onError);
			}
		};

		return (
			<div>
				<ControlMenu backURL="../../" title={title} />

				<Loading isLoading={isLoading}>
					<EditAppContext.Provider value={{dispatch, state: {app}}}>
						<UpperToolbar className="workflow-app-upper-toolbar">
							<UpperToolbar.Input
								onChange={onChangeName}
								placeholder={Liferay.Language.get(
									'untitled-app'
								)}
								value={app.name.en_US}
							/>
							<UpperToolbar.Group>
								<UpperToolbar.Button
									displayType="secondary"
									onClick={() => history.goBack()}
								>
									{Liferay.Language.get('cancel')}
								</UpperToolbar.Button>

								<UpperToolbar.Button
									disabled={
										!customObjectId ||
										!formViewId ||
										!tableViewId ||
										!app.name.en_US
									}
									onClick={() => setDeployAppVisible(true)}
								>
									{Liferay.Language.get('deploy')}
								</UpperToolbar.Button>
							</UpperToolbar.Group>
						</UpperToolbar>

						<Sidebar className="workflow-app-sidebar">
							<Sidebar.Header>
								{!isDataViewsOpen ? (
									<h3>
										{Liferay.Language.get('configuration')}
									</h3>
								) : (
									<div className="border-bottom pb-3 pl-0 pt-0 sidebar-header">
										<ClayButton
											className="clearfix mr-3"
											displayType="secondary"
											onClick={() =>
												setDataViewsOpen(false)
											}
											small
										>
											<ClayIcon
												className="icon mb-1"
												symbol="angle-left"
											/>
										</ClayButton>

										<h3 className="mt-1">
											{Liferay.Language.get(
												'data-and-views'
											)}
										</h3>
									</div>
								)}
							</Sidebar.Header>

							<Sidebar.Body>
								{!isDataViewsOpen ? (
									<ClayButton
										className="clearfix w-100"
										displayType="secondary"
										onClick={() => setDataViewsOpen(true)}
									>
										<span className="float-left">
											{Liferay.Language.get(
												'data-and-views'
											)}
										</span>

										<ClayIcon
											className="float-right icon"
											symbol="angle-right"
										/>
									</ClayButton>
								) : (
									<>
										<div className="border-bottom pb-3">
											<div className="align-items-center d-flex">
												<label>
													{Liferay.Language.get(
														'main-data-object'
													)}
												</label>

												<ClayTooltipProvider>
													<ClayIcon
														className="ml-2 text-muted tooltip-icon"
														data-tooltip-align="top"
														data-tooltip-delay="0"
														symbol="question-circle-full"
														title={Liferay.Language.get(
															'a-data-object-stores-your-business-data-and-is-composed-by-data-fields'
														)}
													/>
												</ClayTooltipProvider>
											</div>

											<SelectObjects
												label={Liferay.Language.get(
													'select-data-object'
												)}
												onSelect={setSelectedObject}
												selectedValue={customObjectName}
											/>
										</div>

										{customObjectName && (
											<div>
												<h5 className="mt-3 text-secondary text-uppercase">
													{Liferay.Language.get(
														'gather-data'
													)}
												</h5>

												<label>
													{Liferay.Language.get(
														'form-view'
													)}
												</label>

												<SelectFormView
													customObjectId={
														customObjectId
													}
													label={Liferay.Language.get(
														'select-form-view'
													)}
													onSelect={(formView) => {
														setSelectedFormView(
															formView
														);

														dispatch({
															...formView,
															type: UPDATE_DATA_LAYOUT_ID,
														});
													}}
													selectedValue={formViewName}
												/>

												<h5 className="mt-4 text-secondary text-uppercase">
													{Liferay.Language.get(
														'display-data'
													)}
												</h5>

												<label>
													{Liferay.Language.get(
														'table-view'
													)}
												</label>

												<SelectTableView
													customObjectId={
														customObjectId
													}
													label={Liferay.Language.get(
														'select-table-view'
													)}
													onSelect={(tableView) => {
														setSelectedTableView(
															tableView
														);

														dispatch({
															...tableView,
															type: UPDATE_DATA_LIST_VIEW_ID,
														});
													}}
													selectedValue={
														tableViewName
													}
												/>
											</div>
										)}
									</>
								)}
							</Sidebar.Body>
						</Sidebar>

						{isDeployAppVisible && (
							<ClayModal observer={observer}>
								<div className="pb-3 pt-3">
									<DeployApp />

									<div className="d-flex justify-content-end mr-4 pt-0">
										<ClayButton
											className="mr-3"
											displayType="secondary"
											onClick={() => onClose()}
											small
										>
											{Liferay.Language.get('cancel')}
										</ClayButton>

										<ClayButton
											disabled={
												app.appDeployments.length === 0
											}
											onClick={() => onDeploy()}
											small
										>
											{Liferay.Language.get('done')}
										</ClayButton>
									</div>
								</div>
							</ClayModal>
						)}
					</EditAppContext.Provider>
				</Loading>
			</div>
		);
	}
);
