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
import {addEntryComment} from '../store/thunks.es';
import CommentForm from './CommentForm.es';

export default function AddCommentForm({entryId}) {
	const [, dispatch] = useContext(CommentsContext);
	const [addingComment, setAddingComment] = useState(false);
	const [showButtons, setShowButtons] = useState(false);
	const [commentText, setCommentText] = useState('');

	const onSubmit = () => {
		setAddingComment(true);

		dispatch(addEntryComment({body: commentText, entryId}))
			.then(() => {
				setAddingComment(false);
				setShowButtons(false);
				setCommentText('');
			})
			.catch(() => {
				openToast({
					message: Liferay.Language.get(
						'the-comment-could-not-be-saved'
					),
					type: 'danger',
				});

				setAddingComment(false);
			});
	};

	return (
		<CommentForm
			commentText={commentText}
			loading={addingComment}
			onCancel={() => {
				setShowButtons(false);
				setCommentText('');
			}}
			onChange={setCommentText}
			onFocus={() => setShowButtons(true)}
			onSubmit={onSubmit}
			showButtons={showButtons}
			submitLabel={Liferay.Language.get('comment')}
		/>
	);
}
