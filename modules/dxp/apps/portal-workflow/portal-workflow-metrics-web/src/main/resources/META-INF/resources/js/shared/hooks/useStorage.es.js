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

import {useState, useEffect} from 'react';

import {jsonStorage} from '../util/storage.es';

const eventTarget = new EventTarget();

const useStorage = (storageType, key) => {
	const {get, set} = jsonStorage(storageType);
	const [value, setValue] = useState(get(key));

	const updater = (updatedValue, remove = false) => {
		setValue(updatedValue);

		if (remove) {
			storageType.removeItem(key);
		} else {
			set(key, updatedValue);
		}

		eventTarget.dispatchEvent(
			new CustomEvent('storage_change', {detail: {key, updatedValue}})
		);
	};

	useEffect(() => {
		const listener = ({detail}) => {
			if (detail.key === key) setValue(detail.updatedValue);
		};

		eventTarget.addEventListener('storage_change', listener);

		return () => {
			eventTarget.removeEventListener('storage_change', listener);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return [
		value,
		updatedValue => updater(updatedValue),
		() => updater({}, true)
	];
};

const setStorage = storage => key => useStorage(storage, key);

const useLocalStorage = setStorage(localStorage);
const useSessionStorage = setStorage(sessionStorage);

export {useLocalStorage, useSessionStorage};
