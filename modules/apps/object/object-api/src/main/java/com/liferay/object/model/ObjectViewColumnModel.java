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

package com.liferay.object.model;

import com.liferay.portal.kernel.bean.AutoEscape;
import com.liferay.portal.kernel.model.BaseModel;
import com.liferay.portal.kernel.model.MVCCModel;
import com.liferay.portal.kernel.model.ShardedModel;
import com.liferay.portal.kernel.model.StagedAuditedModel;

import java.util.Date;

import org.osgi.annotation.versioning.ProviderType;

/**
 * The base model interface for the ObjectViewColumn service. Represents a row in the &quot;ObjectViewColumn&quot; database table, with each column mapped to a property of this class.
 *
 * <p>
 * This interface and its corresponding implementation <code>com.liferay.object.model.impl.ObjectViewColumnModelImpl</code> exist only as a container for the default property accessors generated by ServiceBuilder. Helper methods and all application logic should be put in <code>com.liferay.object.model.impl.ObjectViewColumnImpl</code>.
 * </p>
 *
 * @author Marco Leo
 * @see ObjectViewColumn
 * @generated
 */
@ProviderType
public interface ObjectViewColumnModel
	extends BaseModel<ObjectViewColumn>, MVCCModel, ShardedModel,
			StagedAuditedModel {

	/*
	 * NOTE FOR DEVELOPERS:
	 *
	 * Never modify or reference this interface directly. All methods that expect a object view column model instance should use the {@link ObjectViewColumn} interface instead.
	 */

	/**
	 * Returns the primary key of this object view column.
	 *
	 * @return the primary key of this object view column
	 */
	public long getPrimaryKey();

	/**
	 * Sets the primary key of this object view column.
	 *
	 * @param primaryKey the primary key of this object view column
	 */
	public void setPrimaryKey(long primaryKey);

	/**
	 * Returns the mvcc version of this object view column.
	 *
	 * @return the mvcc version of this object view column
	 */
	@Override
	public long getMvccVersion();

	/**
	 * Sets the mvcc version of this object view column.
	 *
	 * @param mvccVersion the mvcc version of this object view column
	 */
	@Override
	public void setMvccVersion(long mvccVersion);

	/**
	 * Returns the uuid of this object view column.
	 *
	 * @return the uuid of this object view column
	 */
	@AutoEscape
	@Override
	public String getUuid();

	/**
	 * Sets the uuid of this object view column.
	 *
	 * @param uuid the uuid of this object view column
	 */
	@Override
	public void setUuid(String uuid);

	/**
	 * Returns the object view column ID of this object view column.
	 *
	 * @return the object view column ID of this object view column
	 */
	public long getObjectViewColumnId();

	/**
	 * Sets the object view column ID of this object view column.
	 *
	 * @param objectViewColumnId the object view column ID of this object view column
	 */
	public void setObjectViewColumnId(long objectViewColumnId);

	/**
	 * Returns the company ID of this object view column.
	 *
	 * @return the company ID of this object view column
	 */
	@Override
	public long getCompanyId();

	/**
	 * Sets the company ID of this object view column.
	 *
	 * @param companyId the company ID of this object view column
	 */
	@Override
	public void setCompanyId(long companyId);

	/**
	 * Returns the user ID of this object view column.
	 *
	 * @return the user ID of this object view column
	 */
	@Override
	public long getUserId();

	/**
	 * Sets the user ID of this object view column.
	 *
	 * @param userId the user ID of this object view column
	 */
	@Override
	public void setUserId(long userId);

	/**
	 * Returns the user uuid of this object view column.
	 *
	 * @return the user uuid of this object view column
	 */
	@Override
	public String getUserUuid();

	/**
	 * Sets the user uuid of this object view column.
	 *
	 * @param userUuid the user uuid of this object view column
	 */
	@Override
	public void setUserUuid(String userUuid);

	/**
	 * Returns the user name of this object view column.
	 *
	 * @return the user name of this object view column
	 */
	@AutoEscape
	@Override
	public String getUserName();

	/**
	 * Sets the user name of this object view column.
	 *
	 * @param userName the user name of this object view column
	 */
	@Override
	public void setUserName(String userName);

	/**
	 * Returns the create date of this object view column.
	 *
	 * @return the create date of this object view column
	 */
	@Override
	public Date getCreateDate();

	/**
	 * Sets the create date of this object view column.
	 *
	 * @param createDate the create date of this object view column
	 */
	@Override
	public void setCreateDate(Date createDate);

	/**
	 * Returns the modified date of this object view column.
	 *
	 * @return the modified date of this object view column
	 */
	@Override
	public Date getModifiedDate();

	/**
	 * Sets the modified date of this object view column.
	 *
	 * @param modifiedDate the modified date of this object view column
	 */
	@Override
	public void setModifiedDate(Date modifiedDate);

	/**
	 * Returns the object view ID of this object view column.
	 *
	 * @return the object view ID of this object view column
	 */
	public long getObjectViewId();

	/**
	 * Sets the object view ID of this object view column.
	 *
	 * @param objectViewId the object view ID of this object view column
	 */
	public void setObjectViewId(long objectViewId);

	/**
	 * Returns the object field name of this object view column.
	 *
	 * @return the object field name of this object view column
	 */
	@AutoEscape
	public String getObjectFieldName();

	/**
	 * Sets the object field name of this object view column.
	 *
	 * @param objectFieldName the object field name of this object view column
	 */
	public void setObjectFieldName(String objectFieldName);

	/**
	 * Returns the priority of this object view column.
	 *
	 * @return the priority of this object view column
	 */
	public int getPriority();

	/**
	 * Sets the priority of this object view column.
	 *
	 * @param priority the priority of this object view column
	 */
	public void setPriority(int priority);

	@Override
	public ObjectViewColumn cloneWithOriginalValues();

}