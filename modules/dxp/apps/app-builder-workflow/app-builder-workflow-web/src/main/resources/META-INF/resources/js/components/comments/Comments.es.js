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

import React, {useContext, useEffect} from 'react';

import AddCommentForm from './components/AddCommentForm.es';
import Comment from './components/Comment.es';
import NoCommentsMessage from './components/NoCommentsMessage.es';
import {CommentsContext, CommentsContextProvider} from './store/context.es';

export function Comments({entryId}) {
	const [{comments}] = useContext(CommentsContext);

	useEffect(() => {}, [entryId]);

	return (
		<div className="p-4 sheet">
			<AddCommentForm entryId={entryId} />

			{comments.length ? (
				comments.map((comment) => (
					<Comment
						comment={comment}
						entryId={entryId}
						key={comment.commentId}
					/>
				))
			) : (
				<NoCommentsMessage />
			)}
		</div>
	);
}

export default ({entryId}) => {
	return (
		<CommentsContextProvider entryId={entryId}>
			<Comments entryId={entryId} />
		</CommentsContextProvider>
	);
};
