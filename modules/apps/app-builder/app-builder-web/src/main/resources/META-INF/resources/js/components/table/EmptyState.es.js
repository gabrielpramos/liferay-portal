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

import lang from '../../utils/lang.es';

const EmptyState = ({emptyState, isFiltered, keywords = ''}) => {
	const defaultEmpty = {
		description: null,
		title: Liferay.Language.get('there-are-no-entries'),
	};

	const defaultFiltered = {
		description: Liferay.Language.get(
			'there-are-no-results-with-these-attributes'
		),
		title: Liferay.Language.get('no-results-were-found'),
	};

	const defaultSearch = {
		...defaultFiltered,
		description: lang.sub(
			Liferay.Language.get('there-are-no-results-for-x'),
			[keywords]
		),
	};

	const defaultSearchFiltered = {
		...defaultFiltered,
		description: lang.sub(
			Liferay.Language.get(
				'there-are-no-results-for-x-with-these-attributes'
			),
			[keywords]
		),
	};

	emptyState = {
		...defaultEmpty,
		...emptyState,
	};

	const filtered = {
		...defaultFiltered,
		...emptyState.filtered,
	};

	const search = {
		...defaultSearch,
		...emptyState.search,
	};

	const searchFiltered = {
		...defaultSearchFiltered,
		...emptyState.searchFiltered,
	};

	const isSearch = keywords !== '';

	let currentState = isSearch ? search : emptyState;

	if (isFiltered) {
		currentState = isSearch ? searchFiltered : filtered;
	}

	const {button, description, title} = currentState;
	const stateType = isSearch || isFiltered ? 'search' : 'empty';

	return (
		<div className="taglib-empty-result-message">
			<div className="text-center">
				<div className={`taglib-${stateType}-state`} />

				{title && (
					<h1 className="taglib-empty-result-message-title">
						{title}
					</h1>
				)}

				{description && (
					<p className="empty-message-color taglib-empty-result-message-description">
						{description}
					</p>
				)}

				{button && button()}
			</div>
		</div>
	);
};

export const withEmpty = (Component) => {
	const Wrapper = ({
		emptyState,
		isEmpty,
		isFiltered,
		keywords,
		...restProps
	}) => {
		if (isEmpty) {
			return (
				<EmptyState
					emptyState={emptyState}
					isFiltered={isFiltered}
					keywords={keywords}
				/>
			);
		}

		return <Component {...restProps} />;
	};

	return Wrapper;
};

export default EmptyState;
