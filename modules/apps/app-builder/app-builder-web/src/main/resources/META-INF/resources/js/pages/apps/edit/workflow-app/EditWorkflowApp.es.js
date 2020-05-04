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

import Sidebar from 'data-engine-taglib';
import React, {useContext, useState} from 'react';

import {AppContext} from '../../../../AppContext.es';
import {ControlMenuBase} from '../../../../components/control-menu/ControlMenu.es';
import WorkflowAppUpperToolbar from './WorkflowAppUpperToolbar.es';

const WorkflowAppControlMenu = ({backURL, dataLayoutId}) => {
	let title = Liferay.Language.get('new-workflow-powered-app');

	if (dataLayoutId > 0) {
		title = Liferay.Language.get('edit-workflow-powered-app');
	}

	return (
		<ControlMenuBase backURL={backURL} title={title} url={location.href} />
	);
};

const EditWorkflowApp = ({dataLayoutId}) => {
	const {basePortletURL} = useContext(AppContext);

	const backURL = `${basePortletURL}/#/apps`;

	return (
		<>
			<WorkflowAppControlMenu
				backURL={backURL}
				dataLayoutId={dataLayoutId}
			/>

			<WorkflowAppUpperToolbar />

			<Sidebar className="app-builder-sidebar main">
				<Sidebar.Header></Sidebar.Header>

				<Sidebar.Body></Sidebar.Body>
			</Sidebar>
		</>
	);
};

export default ({dataLayoutBuilderId, ...props}) => {
	const [dataLayoutBuilder, setDataLayoutBuilder] = useState();

	if (!dataLayoutBuilder) {
		Liferay.componentReady(dataLayoutBuilderId).then(setDataLayoutBuilder);
	}

	return dataLayoutBuilder ? (
		<EditWorkflowApp dataLayoutBuilder={dataLayoutBuilder} {...props} />
	) : null;
};
