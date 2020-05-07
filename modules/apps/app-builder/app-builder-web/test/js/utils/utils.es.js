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

import {isEqualObjects} from '../../../src/main/resources/META-INF/resources/js/utils/utils.es';

describe('Utils', () => {
	describe('isEqualObjects', () => {
		it('call without args', () => {
			expect(isEqualObjects()).toBeTruthy();
		});

		it('call with non objects', () => {
			expect(isEqualObjects(1, 2)).toBeFalsy();
		});

		it('call with different objects', () => {
			expect(isEqualObjects({propA: 1}, {propB: 2})).toBeFalsy();
		});

		it('call with equal objects', () => {
			const object = {propA: 1, propB: 2};

			expect(isEqualObjects(object, object)).toBeTruthy();
		});
	});
});
