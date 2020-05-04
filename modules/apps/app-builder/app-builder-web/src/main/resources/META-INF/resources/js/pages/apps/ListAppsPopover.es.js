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

import React from 'react';

import Popover from '../../components/popover/Popover.es';

const ListAppsPopover = ({forwardRef, onCancel, onSubmit, visible}) => {
	return (
		<Popover
			ref={forwardRef}
			showArrow={false}
			title={() => (
				<>
					<h4 className="m-0">{Liferay.Language.get('new-app')}</h4>

					<span>
						{Liferay.Language.get(
							'create-an-app-to-manage-the-data-of-an-object'
						)}
					</span>
				</>
			)}
			visible={visible}
		/>
	);
};

export default React.forwardRef((props, ref) => (
	<ListAppsPopover {...props} forwardRef={ref} />
));
