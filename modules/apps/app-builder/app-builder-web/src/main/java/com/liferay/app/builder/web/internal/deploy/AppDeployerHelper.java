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

package com.liferay.app.builder.web.internal.deploy;

import com.liferay.app.builder.web.internal.portlet.AppPortlet;

import java.util.Map;

import javax.portlet.Portlet;

import org.osgi.framework.BundleContext;
import org.osgi.framework.ServiceRegistration;
import org.osgi.service.component.annotations.Component;

/**
 * @author Rafael Praxedes
 */
@Component(immediate = true, service = AppDeployerHelper.class)
public class AppDeployerHelper {

	public ServiceRegistration<?> deployPortlet(
		AppPortlet appPortlet, BundleContext bundleContext,
		Map<String, Object> customProperties) {

		return bundleContext.registerService(
			Portlet.class, appPortlet,
			appPortlet.getProperties(customProperties));
	}

}