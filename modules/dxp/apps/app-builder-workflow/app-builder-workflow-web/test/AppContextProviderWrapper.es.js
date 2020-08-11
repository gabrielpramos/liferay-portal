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

import {AppContextProvider} from 'app-builder-web/js/AppContext.es';
import {createMemoryHistory} from 'history';
import React from 'react';
import {HashRouter} from 'react-router-dom';

export default ({
	appContext = {
		baseResourceURL:
			'"http://localhost:8080/group/guest/~/control_panel/manage?p_p_id=com_liferay_app_builder_web_internal_portlet_AppsPortlet&p_p_lifecycle=2&p_p_state=maximized&p_p_mode=view&p_p_cacheability=cacheLevelPage&p_p_auth=unagSOkK"',
	},
	children,
	history = createMemoryHistory(),
}) => {
	return (
		<AppContextProvider {...appContext}>
			<div className="tools-control-group">
				<div className="control-menu-level-1-heading" />
			</div>

			<HashRouter>{React.cloneElement(children, {history})}</HashRouter>
		</AppContextProvider>
	);
};
