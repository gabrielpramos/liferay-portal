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

import React, {
	useCallback,
	useMemo,
	useState,
	useContext,
	useEffect
} from 'react';

import Filter from '../../shared/components/filter/Filter.es';
import {useFilterName} from '../../shared/components/filter/hooks/useFilterName.es';
import {useFilterStatic} from '../../shared/components/filter/hooks/useFilterStatic.es';
import filterConstants from '../../shared/components/filter/util/filterConstants.es';
import {mergeItemsArray} from '../../shared/components/filter/util/filterUtil.es';
import {useRouterParams} from '../../shared/hooks/useRouterParams.es';
import {useSessionStorage} from '../../shared/hooks/useStorage.es';
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
	disabled,
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

	const [storageTimeRanges = {}] = useSessionStorage('timeRanges');

	const {items: timeRanges} = useMemo(() => storageTimeRanges, [
		storageTimeRanges
	]);

	const customRange = useMemo(() => getCustomTimeRange(dateEnd, dateStart), [
		dateEnd,
		dateStart
	]);

	const staticItems = useMemo(
		() =>
			parseDateItems(isAmPm)(mergeItemsArray([customRange], timeRanges)),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[customRange, timeRanges]
	);

	const {items, selectedItems} = useFilterStatic(
		dispatch,
		filterKey,
		prefixKey,
		staticItems
	);

	const defaultItem = useMemo(
		() => items.find(timeRange => timeRange.defaultTimeRange),
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
			disabled={disabled}
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

const useTimeRangeFetch = () => {
	const {client} = useContext(AppContext);

	const [, update, remove] = useSessionStorage('timeRanges');

	useEffect(() => {
		client.get('/time-ranges').then(({data}) => {
			update({items: data.items});
		});

		return () => {
			remove();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
};

export {useTimeRangeFetch};
export default TimeRangeFilter;
