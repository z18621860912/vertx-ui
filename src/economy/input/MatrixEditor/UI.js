import React from 'react'
import './Cab.less'
import {Input, Table} from 'antd';
import Op from "./UI.Render";
import U from "underscore";

const processValue = (props = {}) => {
    const {rows = {}} = props.config;
    const dataRow = Object.keys(rows);
    const data = [];
    dataRow.forEach(row => {
        const dataItem = {};
        dataItem.key = rows[row];
        dataItem.field = row;
        data.push(dataItem);
    });
    return data;
};

class Component extends React.PureComponent {
    constructor(props) {
        super(props);
        const data = processValue(props);
        this.state = {
            source: props.value || data
        }
    }

    render() {
        const {config = {}, $render, ...jsx} = this.props;
        const {value, ...rest} = jsx;
        if (config.columns) {
            Op.renderColumn(this, config.columns, jsx, $render);
        }
        const {source = []} = this.state;
        if (U.isArray(source)) {
            source.forEach((item, index) => (item.sequence = (index + 1)))
        }
        return (
            <Input.Group {...rest}>
                <Table columns={config.columns} className={"web-table-editor"}
                       pagination={false} dataSource={source}/>
            </Input.Group>
        )
    }
}

export default Component;