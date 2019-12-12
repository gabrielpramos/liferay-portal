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

import React, {useCallback, useMemo, useState, useContext} from 'react';

import Filter from '../../shared/components/filter/Filter.es';
import {useFilterFetch} from '../../shared/components/filter/hooks/useFilterFetch.es';
import {useFilterName} from '../../shared/components/filter/hooks/useFilterName.es';
import filterConstants from '../../shared/components/filter/util/filterConstants.es';
import {useRouterParams} from '../../shared/hooks/useRouterParams.es';
import {AppContext} from '../AppContext.es';
import {
	parseQueryDate,
	formatDescriptionDate
} from '../process-metrics/util/timeRangeUtil.es';
import {CustomTimeRangeForm} from './CustomTimeRangeForm.es';
import {formatTimeRange} from './util/timeRangeUtil.es';

const isCustomFilter = filter => filter.key === 'custom';

const onChangeFilter = selectedFilter => {
	const preventDefault = isCustomFilter(selectedFilter);

	return preventDefault;
};

const TimeRangeFilter = ({
	buttonClassName,
	className,
	dispatch,
	filterKey = filterConstants.timeRange.key,
	options = {},
	prefixKey = ''
}) => {
	const defaultOptions = {
		hideControl: true,
		multiple: false,
		position: 'left',
		withSelectionTitle: true
	};
	// eslint-disable-next-line react-hooks/exhaustive-deps
	options = useMemo(() => ({...defaultOptions, ...options}), [options]);

	const {isAmPm} = useContext(AppContext);
	const {filters} = useRouterParams();
	const {formVisible, onClickFilter, setFormVisible} = useCustomFormState();

	const dateEnd = filters[`${prefixKey}dateEnd`];
	const dateStart = filters[`${prefixKey}dateStart`];

	const staticItems = useMemo(
		() => [getCustomTimeRange(dateEnd, dateStart)],
		[dateEnd, dateStart]
	);

	const {items, selectedItems} = useFilterFetch({
		dispatch,
		filterKey,
		parseItems: parseDateItems(isAmPm),
		prefixKey,
		requestUrl: '/time-ranges',
		staticItems
	});

	const defaultItem = useMemo(
		() => items.find(timeRange => timeRange.defaultTimeRange) || items[0],
		[items]
	);

	if (defaultItem && !selectedItems.length) {
		selectedItems[0] = defaultItem;
	}

	const filterName = useFilterName(
		options.multiple,
		selectedItems,
		Liferay.Language.get('completion-period'),
		options.withSelectionTitle
	);

	return (
		<Filter
			buttonClassName={buttonClassName}
			dataTestId="timeRangeFilter"
			defaultItem={defaultItem}
			elementClasses={className}
			filterKey={filterKey}
			items={items}
			name={filterName}
			onChangeFilter={onChangeFilter}
			onClickFilter={onClickFilter}
			prefixKey={prefixKey}
			{...options}
		>
			{formVisible && (
				<CustomTimeRangeForm
					filterKey={filterKey}
					items={items}
					prefixKey={prefixKey}
					setFormVisible={setFormVisible}
				/>
			)}
		</Filter>
	);
};

const getCustomTimeRange = (dateEnd, dateStart) => {
	const customTimeRange = {
		active: false,
		dateEnd: parseQueryDate(dateEnd, true),
		dateStart: parseQueryDate(dateStart),
		dividerAfter: true,
		key: 'custom',
		name: Liferay.Language.get('custom-range')
	};

	customTimeRange.resultName = `${formatDescriptionDate(
		dateStart
	)} - ${formatDescriptionDate(dateEnd)}`;

	return customTimeRange;
};

const useCustomFormState = () => {
	const [formVisible, setFormVisible] = useState(false);

	const onClickFilter = useCallback(currentItem => {
		if (isCustomFilter(currentItem)) {
			setFormVisible(true);

			if (currentItem.active) {
				document.dispatchEvent(new Event('mousedown'));
			}
		} else {
			setFormVisible(false);
		}

		return true;
	}, []);

	return {
		formVisible,
		onClickFilter,
		setFormVisible
	};
};

const parseDateItems = isAmPm => items => {
	return items.map(item => {
		const parsedItem = {
			...item,
			dateEnd: new Date(item.dateEnd),
			dateStart: new Date(item.dateStart),
			key: item.key
		};

		if (parsedItem.key !== 'custom') {
			parsedItem.description = formatTimeRange(item, isAmPm);
		}

		return parsedItem;
	});
};

export default TimeRangeFilter;
