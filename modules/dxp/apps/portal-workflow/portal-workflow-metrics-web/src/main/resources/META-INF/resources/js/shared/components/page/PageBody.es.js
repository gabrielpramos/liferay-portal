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

import EmptyState from '../empty-state/EmptyState.es';
import LoadingState from '../loading/LoadingState.es';
import PromisesResolver from '../promises-resolver/PromisesResolver.es';

const PageBody = ({children, emptyProps, errorProps, loadingProps}) => {
	return (
		<>
			<PromisesResolver.Pending>
				<PageBody.LoadingView {...loadingProps} />
			</PromisesResolver.Pending>

			<PromisesResolver.Resolved>
				{children || <PageBody.EmptyView {...emptyProps} />}
			</PromisesResolver.Resolved>

			<PromisesResolver.Rejected>
				<PageBody.ErrorView {...errorProps} />
			</PromisesResolver.Rejected>
		</>
	);
};

const EmptyView = ({emptyType, message}) => {
	return <EmptyState message={message} type={emptyType} />;
};

const ErrorView = ({actionButton, hideAnimation, message}) => {
	return (
		<EmptyState
			actionButton={actionButton}
			hideAnimation={hideAnimation}
			message={message}
		/>
	);
};

const LoadingView = ({className}) => {
	return <LoadingState className={className} />;
};

PageBody.EmptyView = EmptyView;
PageBody.ErrorView = ErrorView;
PageBody.LoadingView = LoadingView;

export {PageBody};
