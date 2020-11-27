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
import {useIsMounted} from 'frontend-js-react-web';
import React, {useEffect, useRef, useState} from 'react';

import './InlineConfirm.scss';

export default function InlineConfirm({
	cancelButtonLabel,
	confirmButtonLabel,
	message,
	onCancelButtonClick,
	onConfirmButtonClick,
}) {
	const [performingAction, setPerformingAction] = useState(false);
	const wrapper = useRef(null);
	const isMounted = useIsMounted();

	const _handleConfirmButtonClick = () => {
		if (wrapper.current) {
			wrapper.current.focus();
		}

		setPerformingAction(true);

		onConfirmButtonClick().then(() => {
			if (isMounted()) {
				setPerformingAction(false);
			}
		});
	};

	useEffect(() => {
		if (wrapper.current) {
			wrapper.current.focus();
		}
	}, []);

	useEffect(() => {
		if (wrapper.current) {
			const confirmButton = wrapper.current.querySelector(
				'app-builder-workflow__inline-confirm-button'
			);

			if (confirmButton) {
				confirmButton.focus();
			}
		}

		const _handleDocumentFocusOut = () => {
			requestAnimationFrame(() => {
				if (wrapper.current && !performingAction) {
					if (
						!wrapper.current.contains(document.activeElement) &&
						wrapper.current !== document.activeElement
					) {
						onCancelButtonClick();
					}
				}
			});
		};

		document.addEventListener('focusout', _handleDocumentFocusOut, true);

		return () =>
			window.removeEventListener(
				'focusout',
				_handleDocumentFocusOut,
				true
			);
	}, [performingAction, onCancelButtonClick]);

	return (
		<div
			className="app-builder-workflow__inline-confirm"
			onKeyDown={(e) => e.key === 'Escape' && onCancelButtonClick()}
			ref={wrapper}
			role="alertdialog"
			tabIndex="-1"
		>
			<p className="text-center text-secondary">
				<strong>{message}</strong>
			</p>

			<ClayButton.Group spaced>
				<ClayButton
					className="app-builder-workflow__inline-confirm-button"
					disabled={performingAction}
					displayType="primary"
					loading={performingAction}
					onClick={_handleConfirmButtonClick}
					small
				>
					{confirmButtonLabel}
				</ClayButton>

				<ClayButton
					disabled={performingAction}
					displayType="secondary"
					onClick={onCancelButtonClick}
					small
					type="button"
				>
					{cancelButtonLabel}
				</ClayButton>
			</ClayButton.Group>
		</div>
	);
}
