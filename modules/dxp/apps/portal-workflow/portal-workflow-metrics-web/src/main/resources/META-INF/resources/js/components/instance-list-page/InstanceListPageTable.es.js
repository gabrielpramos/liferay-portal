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

import React from 'react';

import TableView from '../../shared/components/table/TableView.es';
import {Item} from './InstanceListPageItem.es';

const Table = ({items, totalCount}) => {
	const cells = [
		{style: {width: '7%'}},
		{content: Liferay.Language.get('id'), style: {width: '8%'}},
		{
			content: Liferay.Language.get('item-subject'),
			style: {width: '17%'},
		},
		{
			content: Liferay.Language.get('process-step'),
			style: {width: '18%'},
		},
		{content: Liferay.Language.get('assignee'), style: {width: '14%'}},
		{content: Liferay.Language.get('created-by'), style: {width: '17%'}},
		{
			content: Liferay.Language.get('creation-date'),
			style: {width: '18%'},
		},
		{style: {width: '5%'}},
	];

	return (
		<TableView>
			<TableView.Header cells={cells} />

			<TableView.Body
				itemComponent={Table.Item}
				itemProps={{totalCount}}
				items={items}
			/>
		</TableView>
	);
};

Table.Item = Item;

export {Table};
