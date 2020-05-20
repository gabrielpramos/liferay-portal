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
import DeployApp from '../DeployApp.es';
import EditAppContext, {UPDATE_APP, reducer} from '../EditAppContext.es';
import DataObjectDropdown from './DataObjectDropdown.es';

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

										<h4 className="mt-1">
											{Liferay.Language.get(
												'data-and-views'
											)}
										</h4>
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
									<DataObjectDropdown />
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
