import React from 'react'
import "./Cab.less";
import {DatePicker, Input, Radio} from 'antd';
import Immutable from 'immutable';

class Component extends React.PureComponent {
    triggerChange = (changedValue) => {
        const onChange = this.props.onChange;
        if (onChange) {
            const newValue = Object.assign({}, this.state, changedValue);
            onChange(Immutable.fromJS(newValue).toJS());
        }
    };
    handleDisabled = (event) => {
        const yes = event.target.value;
        const value = {};
        value.agree = "YES" === yes;
        if (!value.agree) {
            value.value = undefined;
        }
        this.setState(value);
        this.triggerChange(value);
    };

    handleDate = (event) => {
        const value = {};
        value.value = event;
        this.setState(value);
        this.triggerChange(value);
    };

    constructor(props) {
        super(props);
        this.state = props.value || {};
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if ('value' in nextProps) {
            const value = nextProps.value;
            this.setState(value);
        }
    }

    render() {
        const {config = [], related = {}, ...rest} = this.props;
        const {agree = false} = this.state;
        const disabled = related.disabled ? !agree : false;
        const {value, ...meta} = rest;
        return (
            <Input.Group {...meta} compact>
                <Radio.Group className={"web-checked-radio"} onChange={
                    related.disabled ? this.handleDisabled : () => {
                        console.info("Not")
                    }}>
                    {config.map(item => (
                        <Radio key={item.key} value={item.value ? item.value : item.key}>
                            {item.name}</Radio>))}
                </Radio.Group>
                &nbsp;&nbsp;
                <span className={"web-checked-radio"}>
                {related.config && related.config.label ? `${related.config.label}：` : false}
                </span>
                <DatePicker disabled={disabled} {...related.config} onChange={this.handleDate}/>
            </Input.Group>
        )
    }
}

export default Component;