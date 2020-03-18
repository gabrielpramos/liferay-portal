/**
 * Copyright (c) 2000-present Liferay, Inc. All rights reserved.
 *
 * The contents of this file are subject to the terms of the Liferay Enterprise
 * Subscription License ("License"). You may not use this file except in
 * compliance with the License. You can obtain a copy of the License by
 * contacting Liferay, Inc. See the License for the specific language governing
 * permissions and limitations under the License, including but not limited to
 * distribution rights of the Software.
 *
 *
 *
 */

package com.liferay.portal.workflow.metrics.service.internal.messaging.test;

import com.liferay.arquillian.extension.junit.bridge.junit.Arquillian;
import com.liferay.petra.string.StringPool;
import com.liferay.portal.kernel.messaging.Message;
import com.liferay.portal.kernel.messaging.MessageListener;
import com.liferay.portal.kernel.test.rule.AggregateTestRule;
import com.liferay.portal.kernel.test.rule.DeleteAfterTestRun;
import com.liferay.portal.kernel.test.util.ServiceContextTestUtil;
import com.liferay.portal.test.rule.Inject;
import com.liferay.portal.test.rule.LiferayIntegrationTestRule;
import com.liferay.portal.workflow.kaleo.model.KaleoDefinition;
import com.liferay.portal.workflow.kaleo.model.KaleoInstance;
import com.liferay.portal.workflow.metrics.model.WorkflowMetricsSLADefinition;
import com.liferay.portal.workflow.metrics.service.WorkflowMetricsSLADefinitionLocalService;
import com.liferay.portal.workflow.metrics.service.util.BaseWorkflowMetricsIndexerTestCase;

import java.util.ArrayList;
import java.util.List;

import org.junit.ClassRule;
import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;

/**
 * @author Rafael Praxedes
 */
@RunWith(Arquillian.class)
public class WorkflowMetricsSLAProcessMessageListenerTest
	extends BaseWorkflowMetricsIndexerTestCase {

	@ClassRule
	@Rule
	public static final AggregateTestRule aggregateTestRule =
		new LiferayIntegrationTestRule();

	@Test
	public void testProcess() throws Exception {
		KaleoDefinition kaleoDefinition = getKaleoDefinition();

		retryAssertCount(
			4, "workflow-metrics-nodes", "WorkflowMetricsNodeType", "companyId",
			kaleoDefinition.getCompanyId(), "processId",
			kaleoDefinition.getKaleoDefinitionId());
		retryAssertCount(
			"workflow-metrics-processes", "WorkflowMetricsProcessType",
			"companyId", kaleoDefinition.getCompanyId(), "processId",
			kaleoDefinition.getKaleoDefinitionId());

		WorkflowMetricsSLADefinition workflowMetricsSLADefinition =
			_workflowMetricsSLADefinitionLocalService.
				addWorkflowMetricsSLADefinition(
					StringPool.BLANK, StringPool.BLANK, 50000, "Abc",
					new String[0], kaleoDefinition.getKaleoDefinitionId(),
					new String[] {getInitialNodeKey(kaleoDefinition)},
					new String[] {getTerminalNodeKey(kaleoDefinition)},
					ServiceContextTestUtil.getServiceContext());

		_workflowMetricsSLADefinitions.add(workflowMetricsSLADefinition);

		_workflowMetricsSLADefinitionLocalService.
			deactivateWorkflowMetricsSLADefinition(
				workflowMetricsSLADefinition.
					getWorkflowMetricsSLADefinitionId(),
				ServiceContextTestUtil.getServiceContext());

		KaleoInstance kaleoInstance = getKaleoInstance(addBlogsEntry());

		completeKaleoTaskInstanceToken(kaleoInstance);

		completeKaleoInstance(kaleoInstance);

		retryAssertCount(
			"workflow-metrics-instances", "WorkflowMetricsInstanceType",
			"className", kaleoInstance.getClassName(), "classPK",
			kaleoInstance.getClassPK(), "companyId",
			kaleoInstance.getCompanyId(), "completed", true, "instanceId",
			kaleoInstance.getKaleoInstanceId(), "processId",
			kaleoDefinition.getKaleoDefinitionId());

		retryAssertCount(
			"workflow-metrics-instances", "WorkflowMetricsInstanceType",
			"className", kaleoInstance.getClassName(), "classPK",
			kaleoInstance.getClassPK(), "companyId",
			kaleoInstance.getCompanyId(), "completed", true, "instanceId",
			kaleoInstance.getKaleoInstanceId(), "processId",
			kaleoDefinition.getKaleoDefinitionId());
		retryAssertCount(
			0, "workflow-metrics-instances", "WorkflowMetricsInstanceType",
			"className", kaleoInstance.getClassName(), "classPK",
			kaleoInstance.getClassPK(), "companyId",
			kaleoInstance.getCompanyId(), "completed", false, "instanceId",
			kaleoInstance.getKaleoInstanceId(), "processId",
			kaleoDefinition.getKaleoDefinitionId());

		workflowMetricsSLADefinition =
			_workflowMetricsSLADefinitionLocalService.
				addWorkflowMetricsSLADefinition(
					StringPool.BLANK, StringPool.BLANK, 50000, "Def",
					new String[0], kaleoDefinition.getKaleoDefinitionId(),
					new String[] {getInitialNodeKey(kaleoDefinition)},
					new String[] {getTerminalNodeKey(kaleoDefinition)},
					ServiceContextTestUtil.getServiceContext());

		_workflowMetricsSLADefinitions.add(workflowMetricsSLADefinition);

		kaleoInstance = getKaleoInstance(addBlogsEntry());

		retryAssertCount(
			"workflow-metrics-instances", "WorkflowMetricsInstanceType",
			"className", kaleoInstance.getClassName(), "classPK",
			kaleoInstance.getClassPK(), "companyId",
			kaleoInstance.getCompanyId(), "completed", false, "instanceId",
			kaleoInstance.getKaleoInstanceId(), "processId",
			kaleoDefinition.getKaleoDefinitionId());

		_workflowMetricsSLAProcessMessageListener.receive(new Message());

		retryAssertCount(
			"workflow-metrics-sla-instance-results",
			"WorkflowMetricsSLAInstanceResultType", "companyId",
			kaleoDefinition.getCompanyId(), "processId",
			kaleoDefinition.getKaleoDefinitionId(), "slaDefinitionId",
			workflowMetricsSLADefinition.getWorkflowMetricsSLADefinitionId());
		retryAssertCount(
			"workflow-metrics-sla-instance-results",
			"WorkflowMetricsSLAInstanceResultType", "companyId",
			kaleoDefinition.getCompanyId(), "instanceId",
			kaleoInstance.getKaleoInstanceId(), "processId",
			kaleoDefinition.getKaleoDefinitionId());
		retryAssertCount(
			"workflow-metrics-sla-instance-results",
			"WorkflowMetricsSLAInstanceResultType", "companyId",
			kaleoDefinition.getCompanyId(), "instanceId",
			kaleoInstance.getKaleoInstanceId(), "processId",
			kaleoDefinition.getKaleoDefinitionId(), "slaDefinitionId",
			workflowMetricsSLADefinition.getWorkflowMetricsSLADefinitionId());

		_workflowMetricsSLAProcessMessageListener.receive(new Message());

		retryAssertCount(
			"workflow-metrics-sla-instance-results",
			"WorkflowMetricsSLAInstanceResultType", "companyId",
			kaleoDefinition.getCompanyId(), "instanceId",
			kaleoInstance.getKaleoInstanceId(), "processId",
			kaleoDefinition.getKaleoDefinitionId(), "slaDefinitionId",
			workflowMetricsSLADefinition.getWorkflowMetricsSLADefinitionId());
	}

	@Inject
	private WorkflowMetricsSLADefinitionLocalService
		_workflowMetricsSLADefinitionLocalService;

	@DeleteAfterTestRun
	private final List<WorkflowMetricsSLADefinition>
		_workflowMetricsSLADefinitions = new ArrayList<>();

	@Inject(
		filter = "(&(objectClass=com.liferay.portal.workflow.metrics.internal.messaging.WorkflowMetricsSLAProcessMessageListener))"
	)
	private MessageListener _workflowMetricsSLAProcessMessageListener;

}