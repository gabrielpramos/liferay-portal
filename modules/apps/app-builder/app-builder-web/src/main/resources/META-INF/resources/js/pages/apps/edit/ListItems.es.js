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

import {ClayRadio, ClayRadioGroup} from '@clayui/form';
import ClayTable from '@clayui/table';
import classNames from 'classnames';
import React, {useContext, useEffect} from 'react';

import {withLoading} from '../../../components/loading/Loading.es';
import {withEmpty} from '../../../components/table/EmptyState.es';
import {getLocalizedValue} from '../../../utils/lang.es';
import {fromNow} from '../../../utils/time.es';
import EditAppContext, {
	UPDATE_DATA_LAYOUT_ID,
	UPDATE_DATA_LIST_VIEW_ID,
	UPDATE_WORKFLOW_PROCESS_ID,
} from './EditAppContext.es';

const {Body, Cell, Head, Row} = ClayTable;

const ListItems = ({defaultLanguageId, itemType, items}) => {
	const {
		dispatch,
		state: {
			app: {dataLayoutId, dataListViewId, workflowProcessId = ''},
		},
	} = useContext(EditAppContext);

	const itemsProps = {
		DATA_LAYOUT: {id: dataLayoutId, type: UPDATE_DATA_LAYOUT_ID},
		DATA_LIST_VIEW: {id: dataListViewId, type: UPDATE_DATA_LIST_VIEW_ID},
		WORKFLOW_PROCESS: {
			id: workflowProcessId,
			type: UPDATE_WORKFLOW_PROCESS_ID,
		},
	};

	const onItemIdChange = (id) => {
		dispatch({
			id,
			type: itemsProps[itemType].type,
		});
	};

	useEffect(() => {
		if (itemType === 'WORKFLOW_PROCESS') {
			items.unshift({
				dateCreated: null,
				dateModified: null,
				id: '',
				name: {
					[defaultLanguageId]: Liferay.Language.get('no-workflow'),
				},
			});
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<table className="table table-autofit table-heading-nowrap table-hover table-nowrap table-responsive">
			<Head>
				<Row>
					<Cell expanded={true} headingCell>
						{Liferay.Language.get('name')}
					</Cell>
					<Cell headingCell>
						{Liferay.Language.get('create-date')}
					</Cell>
					<Cell headingCell>
						{Liferay.Language.get('modified-date')}
					</Cell>
					<Cell headingCell></Cell>
				</Row>
			</Head>
			<Body>
				{items.map(({dateCreated, dateModified, id, name}, index) => (
					<Row
						className={classNames('selectable-row', {
							'selectable-active': id === itemsProps[itemType].id,
						})}
						key={index}
						onClick={() => onItemIdChange(id)}
					>
						<Cell align="left">
							{getLocalizedValue(defaultLanguageId, name)}
						</Cell>
						<Cell>{dateCreated && fromNow(dateCreated)}</Cell>
						<Cell>{dateModified && fromNow(dateModified)}</Cell>
						<Cell align={'right'}>
							<ClayRadioGroup
								inline
								onSelectedValueChange={() => onItemIdChange(id)}
								selectedValue={itemsProps[itemType].id}
							>
								<ClayRadio value={id} />
							</ClayRadioGroup>
						</Cell>
					</Row>
				))}
			</Body>
		</table>
	);
};

export default withLoading(withEmpty(ListItems));
