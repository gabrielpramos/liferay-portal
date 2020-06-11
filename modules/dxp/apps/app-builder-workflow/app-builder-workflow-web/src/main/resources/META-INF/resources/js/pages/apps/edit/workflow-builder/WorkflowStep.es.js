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

import ClayBadge from '@clayui/badge';
import ClayIcon from '@clayui/icon';
import React from 'react';

export const STEP_PROPS = {
	end: {
		displayType: 'secondary',
		finalStep: true,
		label: Liferay.Language.get('end'),
	},
	start: {displayType: 'primary', label: Liferay.Language.get('start')},
};

const Badge = ({step}) => {
	return step ? (
		<ClayBadge
			className={`step-badge ${step.finalStep ? 'text-secondary' : ''}`}
			{...step}
		/>
	) : null;
};

const Card = ({content, selected}) => {
	return (
		<div className={`card ${selected ? 'selected' : ''}`}>
			<div className="card-row">
				<div className="autofit-col">{content}</div>
			</div>
		</div>
	);
};

const Step = ({cardContent, onClick, selected = false, step}) => {
	return (
		<>
			<div className="step">
				<div className={`step-wrapper ${!step ? 'no-badge' : ''}`}>
					<Badge step={step} />

					<Card content={cardContent} selected={selected} />
				</div>
			</div>
			{(!step || !step.finalStep) && <Divider />}
		</>
	);
};

const Divider = () => {
	return (
		<div className="divider">
			<div className="arrow-tail" />
			<ClayIcon className="icon" symbol="caret-bottom" />
		</div>
	);
};

export default Step;
