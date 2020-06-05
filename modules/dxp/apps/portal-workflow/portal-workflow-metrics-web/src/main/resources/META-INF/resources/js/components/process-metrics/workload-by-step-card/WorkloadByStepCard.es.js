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

import ClayButton from '@clayui/button';
import ClayDropDown, {ClayDropDownWithItems} from '@clayui/drop-down';
import {ClayRadio, ClayRadioGroup} from '@clayui/form';
import React, {useMemo, useState} from 'react';

import PromisesResolver from '../../../shared/components/promises-resolver/PromisesResolver.es';
import {useFetch} from '../../../shared/hooks/useFetch.es';
import {Body} from './WorkloadByStepCardBody.es';

const WorkloadByStepCard = ({processId, routeParams}) => {
	const {data, fetchData} = useFetch({
		params: routeParams,
		url: `/processes/${processId}/nodes/metrics`,
	});

	const promises = useMemo(() => [fetchData()], [fetchData]);
	const [active, setActive] = useState(false);
	const [value, setValue] = useState('one');

	const createItem = (size) => {
		const item = [];

		for (let i = 0; i < size; i++) {
			item.push({checked: false, label: `item${i}`, value: i});
		}

		return item;
	};

	const [items, setItems] = useState(createItem(5));

	const onChange = (index) => {
		setItems([
			...items.map((item, indexItem) => ({
				...item,
				checked: index === indexItem,
			})),
		]);
	};

	const items2 = [
		{
			items: [
				{
					checked: true,
					label: 'one',
					type: 'radio',
					value: 'one',
				},
				{
					label: 'two',
					type: 'radio',
					value: 'two',
				},
			],
			label: 'radio',
			name: 'radio',
			type: 'radiogroup',
			value: 'one',
		},
	];

	return (
		<PromisesResolver promises={promises}>
			<ClayDropDown
				active={active}
				onActiveChange={setActive}
				trigger={<ClayButton>Click Here</ClayButton>}
			>
				<ClayDropDown.ItemList>
					<ClayDropDown.Group header={'Radio'}>
						<ClayDropDown.ItemList>
							{items.map(({checked, label, value}, index) => (
								<ClayDropDown.Section key={index}>
									<ClayRadio
										checked={checked}
										label={label}
										onChange={(event) => {
											event.stopPropagation();
											onChange(index);
										}}
										value={value}
									/>
								</ClayDropDown.Section>
							))}
						</ClayDropDown.ItemList>
					</ClayDropDown.Group>
				</ClayDropDown.ItemList>
			</ClayDropDown>

			<ClayRadioGroup
				inline
				onSelectedValueChange={(val) => setValue(val)}
				selectedValue={value}
			>
				<ClayRadio label="One" value="one" />
				<ClayRadio label="Two" value="two" />
				<ClayRadio label="Three" value="three" />
			</ClayRadioGroup>

			<ClayDropDownWithItems
				footerContent={
					<>
						<ClayButton displayType="secondary">
							{'Cancel'}
						</ClayButton>
						<ClayButton>{'Done'}</ClayButton>
					</>
				}
				items={items2}
				trigger={<ClayButton>{'Click Me'}</ClayButton>}
			/>
		</PromisesResolver>
	);
};

WorkloadByStepCard.Body = Body;

export default WorkloadByStepCard;
