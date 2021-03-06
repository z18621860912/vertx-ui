import Ux from 'ux';

const renderColumn = (reference, columns = [], jsx, render = {}) => {
    columns.forEach((item) => {
        if (render[item.dataIndex]) {
            item.render = render[item.dataIndex]
        } else {
            const type = item['$type'] ? item['$type'] : "TEXT";
            const RENDER = Ux.aiUnitRenders;
            const render = RENDER[type];
            if (render) {
                item.render = render(reference, item, jsx)
            }
        }
    })
};
export default {
    renderColumn
}