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
import {Sidebar} from 'data-engine-taglib';
import React, {useEffect, useReducer, useState} from 'react';
import {withRouter} from 'react-router-dom';

import ControlMenu from '../../../../components/control-menu/ControlMenu.es';
import {Loading} from '../../../../components/loading/Loading.es';
import UpperToolbar from '../../../../components/upper-toolbar/UpperToolbar.es';
import {getItem} from '../../../../utils/client.es';
import SelectObjects from '../../SelectObjectsDropDown.es';
import DeployApp from '../DeployApp.es';
import EditAppContext, {UPDATE_APP, reducer} from '../EditAppContext.es';
import SelectFormView from './SelectFormViewDropdown.es';
import SelectTableView from './SelectTableViewDropdown.es';

export default withRouter(
	({
		history,
		match: {
			params: {appId},
		},
	}) => {
		const [isDataViewsOpen, setDataViewsOpen] = useState(false);
		const [isDeployAppVisible, setDeployAppVisible] = useState(false);
		const [isLoading, setLoading] = useState(false);
		const [selectedValue, setSelectedValue] = useState({
			id: undefined,
			name: undefined,
		});
		const {id: customObjectId, name: customObjectName} = selectedValue;

		const [state, dispatch] = useReducer(reducer, {
			app: {
				active: true,
				appDeployments: [],
				dataLayoutId: null,
				dataListViewId: null,
				name: {
					en_US: '',
				},
			},
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

		return (
			<div>
				<ControlMenu backURL="../" title={title} />

				<Loading isLoading={isLoading}>
					<EditAppContext.Provider value={{dispatch, state}}>
						<UpperToolbar className="workflow-app-upper-toolbar">
							<UpperToolbar.Input
								placeholder={Liferay.Language.get(
									'untitled-app'
								)}
							/>
							<UpperToolbar.Group>
								<UpperToolbar.Button
									displayType="secondary"
									onClick={() => history.goBack()}
								>
									{Liferay.Language.get('cancel')}
								</UpperToolbar.Button>

								<UpperToolbar.Button
									onClick={() => setDeployAppVisible(true)}
								>
									{Liferay.Language.get('deploy')}
								</UpperToolbar.Button>
							</UpperToolbar.Group>
						</UpperToolbar>

						<Sidebar className="workflow-app-sidebar">
							<Sidebar.Header>
								{!isDataViewsOpen ? (
									<h4>
										{Liferay.Language.get('configuration')}
									</h4>
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
											<label>
												{Liferay.Language.get(
													'main-data-object'
												)}
											</label>

											<SelectObjects
												label={Liferay.Language.get(
													'select-data-object'
												)}
												onSelect={setSelectedValue}
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
													onSelect={setSelectedValue}
													selectedValue={
														customObjectName
													}
												/>

												<h5 className="mt-5 text-secondary text-uppercase">
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
													onSelect={setSelectedValue}
													selectedValue={
														customObjectName
													}
												/>
											</div>
										)}
									</>
								)}
							</Sidebar.Body>
						</Sidebar>

						{isDeployAppVisible && <DeployApp />}
					</EditAppContext.Provider>
				</Loading>
			</div>
		);
	}
);
