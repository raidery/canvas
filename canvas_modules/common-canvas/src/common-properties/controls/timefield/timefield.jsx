/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

import React from "react";
import PropTypes from "prop-types";
import TextInput from "carbon-components-react/lib/components/TextInput";
import ValidationMessage from "./../../components/validation-message";
import ControlUtils from "./../../util/control-utils";
import moment from "moment";
import { DEFAULT_TIME_FORMAT, STATES } from "./../../constants/constants.js";
import classNames from "classnames";

export default class TimefieldControl extends React.Component {

	handleChange(evt) {
		let stringValue = null;

		if (evt.target.value) {
			const format = this.props.control.timeFormat || DEFAULT_TIME_FORMAT;
			const mom = moment.utc(evt.target.value, format, true);
			if (mom.isValid()) {
				stringValue = mom.format("HH:mm:ssZ"); // If moment is valid save as ISO format
			} else {
				stringValue = evt.target.value; // Otherwise just save as invalid entered string
			}
		} else {
			stringValue = null;
		}

		this.props.controller.updatePropertyValue(this.props.propertyId, stringValue);
	}

	render() {
		const stringValue = this.props.controller.getPropertyValue(this.props.propertyId);
		const state = this.props.controller.getControlState(this.props.propertyId);
		const messageInfo = this.props.controller.getErrorMessage(this.props.propertyId);

		let displayValue = "";
		if (stringValue) {
			const format = this.props.control.timeFormat || DEFAULT_TIME_FORMAT;
			const mom = moment.utc(stringValue, "HH:mm:ssZ", true);

			if (mom.isValid()) {
				try {
					displayValue = mom.format(format);
				} catch (err) { // This will only happen if the caller provides something other than a string as the format.
					displayValue = "Invalid format object provided. Check input definitions.";
				}
			} else {
				displayValue = stringValue;
			}
		}
		const className = classNames("properties-timefield", "properties-input-control", { "hide": state === STATES.HIDDEN }, messageInfo ? messageInfo.type : null);
		return (
			<div className={className} data-id={ControlUtils.getDataId(this.props.propertyId)}>
				<TextInput
					autoComplete="off"
					id={ControlUtils.getControlId(this.props.propertyId)}
					disabled={state === STATES.DISABLED}
					placeholder={this.props.control.additionalText}
					onChange={this.handleChange.bind(this)}
					value={displayValue}
					labelText={this.props.control.label ? this.props.control.label.text : ""}
					hideLabel
				/>
				<ValidationMessage inTable={this.props.tableControl} state={state} messageInfo={messageInfo} />
			</div>
		);
	}
}

TimefieldControl.propTypes = {
	control: PropTypes.object.isRequired,
	propertyId: PropTypes.object.isRequired,
	controller: PropTypes.object.isRequired,
	tableControl: PropTypes.bool
};
