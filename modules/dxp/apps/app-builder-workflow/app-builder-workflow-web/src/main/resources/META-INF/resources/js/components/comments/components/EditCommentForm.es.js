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

import {openToast} from 'frontend-js-web';
import React, {useContext, useState} from 'react';

import {CommentsContext} from '../store/context.es';
import {editEntryComment} from '../store/thunks.es';
import CommentForm from './CommentForm.es';

export default function EditCommentForm({comment, entryId, onCloseForm}) {
	const [, dispatch] = useContext(CommentsContext);
	const [editingComment, setEditingComment] = useState(false);
	const [commentText, setCommentText] = useState(comment.body);

	const onSubmit = () => {
		setEditingComment(true);

		dispatch(
			editEntryComment({
				...comment,
				body: commentText,
				entryId,
			})
		)
			.then(() => {
				setEditingComment(false);

				onCloseForm();
			})
			.catch(() => {
				openToast({
					message: Liferay.Language.get(
						'the-comment-could-not-be-edited'
					),
					type: 'danger',
				});

				setEditingComment(false);
			});
	};

	return (
		<CommentForm
			autoFocus
			commentText={commentText}
			loading={editingComment}
			onCancel={() => onCloseForm()}
			onChange={setCommentText}
			onSubmit={onSubmit}
			showButtons
			submitLabel={Liferay.Language.get('update')}
		/>
	);
}
