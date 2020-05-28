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

const DEPLOYMENT_ACTION = {
	deploy: Liferay.Language.get('deploy'),
	undeploy: Liferay.Language.get('undeploy'),
};

const DEPLOYMENT_TYPES = {
	productMenu: Liferay.Language.get('product-menu'),
	standalone: Liferay.Language.get('standalone'),
	widget: Liferay.Language.get('widget'),
};

const DROPDOWN_ITEM_LABEL = {
	custom: {
		displayType: 'success',
		label: Liferay.Language.get('custom'),
	},
	native: {displayType: 'info', label: Liferay.Language.get('native')},
};

const FILTER_NAMES = {
	author: [
		Liferay.Language.get('author'),
		Liferay.Language.get('filter-by-author'),
	],
	'deployment-type': [
		Liferay.Language.get('deployment-type'),
		Liferay.Language.get('filter-by-deployment-type'),
	],
	status: [
		Liferay.Language.get('status'),
		Liferay.Language.get('filter-by-status'),
	],
};

const STATUSES = {
	active: Liferay.Language.get('deployed'),
	inactive: Liferay.Language.get('undeployed'),
};

export {
	DEPLOYMENT_ACTION,
	DEPLOYMENT_TYPES,
	DROPDOWN_ITEM_LABEL,
	FILTER_NAMES,
	STATUSES,
};
