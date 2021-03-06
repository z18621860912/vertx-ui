import {HocI18n} from "entity";
import Logger from './Ix.Logger';

const _ixFullName = (Component, Cab = {}, Name) => {
    // ns 属性检查
    if (!Cab || !Cab.hasOwnProperty("ns")) {
        console.error("[ZeroI] The 'Cab' must contain 'ns' field.");
    }
    // 参数名称检查
    if (!Name) {
        console.error("[ZeroI] The input 'Name' must be valid.");
    }
    // 返回全称
    const fullName = Cab['ns'] + "/" + Name;
    if (Component) Component.displayName = fullName;
    return fullName;
};
const _ixI18nName = (target, options = {}) => {
    let fullName;
    if (options.hasOwnProperty("i18n.cab") && options.hasOwnProperty("i18n.name")) {
        const cab = options['i18n.cab'];
        const name = options['i18n.name'];
        if (name && cab) {
            fullName = _ixFullName(target, cab, name);
        }
    }
    return fullName;
};
const _ixI18n = (target, options = {}) => {
    let i18n;
    const fullName = _ixI18nName(target, options);
    if (fullName) {
        i18n = new HocI18n(fullName, {});
    }
    return i18n;
};
const _zero = (options = {}) => {
    return (target, property, descriptor) => {
        const injectState = options.state ? options.state : {};

        class _target extends target {
            // 静态资源放到State状态中
            state = {
                // $hoc变量处理
                $hoc: _ixI18n(target, options),
                ...injectState
            };

            render() {
                const fullName = _ixI18nName(this, options);
                Logger.debug(this, fullName);
                return super.render();
            }
        }

        return _target;
    }
};
export default _zero;