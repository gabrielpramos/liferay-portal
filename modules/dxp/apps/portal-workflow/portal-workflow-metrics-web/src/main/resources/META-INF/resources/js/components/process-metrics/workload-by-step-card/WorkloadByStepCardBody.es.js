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

import Panel from '../../../shared/components/Panel.es';
import ContentView from '../../../shared/components/content-view/ContentView.es';
import ReloadButton from '../../../shared/components/list/ReloadButton.es';
import PaginationBar from '../../../shared/components/pagination-bar/PaginationBar.es';
import {Table} from './WorkloadByStepCardTable.es';

const Body = ({items, page, pageSize, processId, totalCount}) => {
	const statesProps = {
		emptyProps: {
			className: 'border-0 mb-0',
			message: Liferay.Language.get(
				'there-are-no-pending-items-at-the-moment'
			),
			messageClassName: 'small',
		},
		errorProps: {
			actionButton: <ReloadButton />,
			className: 'border-0',
			hideAnimation: true,
			message: Liferay.Language.get('unable-to-retrieve-data'),
			messageClassName: 'small',
		},
		loadingProps: {className: 'pb-6 pt-6 sheet'},
	};

	return (
		<Panel.Body>
			<ContentView {...statesProps}>
				{totalCount > 0 && (
					<>
						<Body.Table items={items} processId={processId} />

						<PaginationBar
							page={page}
							pageSize={pageSize}
							totalCount={totalCount}
						/>
					</>
				)}
			</ContentView>
		</Panel.Body>
	);
};

Body.Table = Table;

export {Body};
