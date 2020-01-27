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

import {useContext, useEffect} from 'react';

import filterConstants from '../../../shared/components/filter/util/filterConstants.es';
import {useBeforeUnload} from '../../../shared/hooks/useBeforeUnload.es';
import {useFilter} from '../../../shared/hooks/useFilter.es';
import {useSessionStorage} from '../../../shared/hooks/useStorage.es';
import {AppContext} from '../../AppContext.es';

const useTimeRangeFetch = () => {
	const {client} = useContext(AppContext);
	const {dispatch} = useFilter();

	const [, update, remove] = useSessionStorage('timeRanges');

	useBeforeUnload(() => remove());

	useEffect(() => {
		dispatch({filterKey: filterConstants.timeRange.key});

		client
			.get('/time-ranges')
			.then(({data}) => {
				update({items: data.items});
			})
			.catch(error => {
				dispatch({error, filterKey: filterConstants.timeRange.key});
			});

		return () => {
			remove();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
};

export {useTimeRangeFetch};
