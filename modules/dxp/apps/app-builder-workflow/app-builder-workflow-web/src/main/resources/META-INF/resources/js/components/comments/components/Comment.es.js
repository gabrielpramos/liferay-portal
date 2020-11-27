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
import ClayDropDown from '@clayui/drop-down';
import ClayIcon from '@clayui/icon';
import classNames from 'classnames';
import {openToast} from 'frontend-js-web';
import React, {useState} from 'react';

import {deleteEntryComment} from '../store/thunks.es';
import EditCommentForm from './EditCommentForm.es';
import InlineConfirm from './InlineConfirm.es';
import ReplyCommentForm from './ReplyCommentForm.es';
import UserIcon from './UserIcon.es';

import './Comment.scss';

export default function Comment({comment, entryId, parentCommentId}) {
	const {
		author,
		body,
		commentId,
		dateDescription,
		edited,
		modifiedDateDescription,
	} = comment;

	const [dropDownActive, setDropDownActive] = useState(false);
	const [editing, setEditing] = useState(false);
	const [showDeleteMask, setShowDeleteMask] = useState(false);
	const dispatch = () => {};

	const showModifiedDateTooltip = !!(edited && modifiedDateDescription);

	const commentClassname = classNames('app-builder-workflow__comment small', {
		'app-builder-workflow__comment--reply': !!parentCommentId,
		'app-builder-workflow__comment--with-delete-mask': showDeleteMask,
	});

	return (
		<article className={commentClassname}>
			<div className="d-flex mb-2">
				<UserIcon {...author} />

				<div className="flex-grow-1 overflow-hidden pl-2">
					<p className="m-0 text-truncate">
						<strong
							className="lfr-portal-tooltip"
							data-title={author.fullName}
						>
							{author.fullName}
						</strong>
					</p>

					<p
						className={classNames('m-0 text-secondary', {
							'lfr-portal-tooltip': showModifiedDateTooltip,
						})}
						data-title={
							showModifiedDateTooltip &&
							Liferay.Util.sub(
								Liferay.Language.get('edited-x'),
								modifiedDateDescription
							)
						}
					>
						{dateDescription}
					</p>
				</div>

				{Liferay.ThemeDisplay.getUserId() === author.userId && (
					<ClayDropDown
						active={dropDownActive}
						onActiveChange={setDropDownActive}
						trigger={
							<ClayButton
								borderless
								className="border-0"
								disabled={editing}
								displayType="secondary"
								monospaced
								small
							>
								<ClayIcon symbol="ellipsis-v" />
							</ClayButton>
						}
					>
						<ClayDropDown.ItemList>
							<ClayDropDown.Item
								onClick={() => {
									setDropDownActive(false);
									setEditing(true);
								}}
							>
								{Liferay.Language.get('edit')}
							</ClayDropDown.Item>

							<ClayDropDown.Item
								onClick={() => {
									setDropDownActive(false);
									setShowDeleteMask(true);
								}}
							>
								{Liferay.Language.get('delete')}
							</ClayDropDown.Item>
						</ClayDropDown.ItemList>
					</ClayDropDown>
				)}
			</div>

			{editing ? (
				<EditCommentForm
					comment={comment}
					entryId={entryId}
					onCloseForm={() => setEditing(false)}
				/>
			) : (
				<div
					className="content pb-2 text-secondary"
					dangerouslySetInnerHTML={{__html: body}}
				/>
			)}

			<ReplyCommentForm
				disabled={editing}
				entryId={entryId}
				parentCommentId={commentId}
			/>

			{comment.children && Boolean(comment.children.length) && (
				<footer className="app-builder-workflow__comment-replies">
					{comment.children &&
						comment.children.map((childComment) => (
							<Comment
								comment={{
									...childComment,
									parentCommentId: comment.commentId,
								}}
								entryId={entryId}
								key={childComment.commentId}
								parentCommentId={commentId}
							/>
						))}
				</footer>
			)}

			{showDeleteMask && (
				<InlineConfirm
					cancelButtonLabel={Liferay.Language.get('cancel')}
					confirmButtonLabel={Liferay.Language.get('delete')}
					message={Liferay.Language.get(
						'are-you-sure-you-want-to-delete-this-comment'
					)}
					onCancelButtonClick={() => setShowDeleteMask(false)}
					onConfirmButtonClick={() =>
						dispatch(
							deleteEntryComment({
								commentId,
								entryId,
								parentCommentId,
							})
						).catch(() => {
							openToast({
								message: Liferay.Language.get(
									'the-comment-could-not-be-deleted'
								),
								type: 'danger',
							});
						})
					}
				/>
			)}
		</article>
	);
}
