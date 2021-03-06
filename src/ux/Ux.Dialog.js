import {message, Modal} from 'antd';
import Prop from './Ux.Prop';
import Expr from './Ux.Expr';
import U from 'underscore'

const _captureKey = (reference, key) => {
    const {$hoc} = reference.state;
    if ($hoc) {
        const dialog = $hoc._("dialog");
        return dialog[key];
    } else {
        return "";
    }
};

const _buildConfig = (reference, message, fnSuccess, key) => {
    const config = {
        title: _captureKey(reference, key),
        content: message
    };
    if (U.isFunction(fnSuccess)) {
        config.onOk = fnSuccess;
    }
    if (!config.width) config.width = 488;
    return config;
};
/**
 * 错误信息显示窗口
 * @method showError
 * @param {React.PureComponent} reference React对应组件引用
 * @param message 直接呈现的消息
 * @param {Function} fnSuccess 窗口按钮的回调函数
 */
const showError = (reference, message, fnSuccess) => Modal.error(_buildConfig(reference, message, fnSuccess, "error"));
/**
 * 成功信息显示专用窗口
 * @method showSuccess
 * @param {React.PureComponent} reference React对应组件引用
 * @param message 直接呈现的消息
 * @param {Function} fnSuccess 窗口按钮的回调函数
 */
const showSuccess = (reference, message, fnSuccess) => Modal.success(_buildConfig(reference, message, fnSuccess, "success"));
const showConfirm = (reference, message, fnSuccess) => Modal.confirm(_buildConfig(reference, message, fnSuccess, "confirm"));

const _dialogFun = {
    success: showSuccess,
    error: showError,
    confirm: showConfirm
};

const messageSuccess = (displayMsg, fnSuccess) => {
    message.destroy();
    message.success(displayMsg, 3, fnSuccess);
};
const messageError = (displayMsg, fnSuccess) => {
    message.destroy();
    message.error(displayMsg, 3, fnSuccess);
};
const _messageFun = {
    success: messageSuccess,
    error: messageError
};
// 特殊函数解析配置
const _configModal = (reference = {}, key, params, dialog = true) => {
    const modal = Prop.fromHoc(reference, "modal");
    // 分析配置信息
    if (modal) {
        if (modal.hasOwnProperty('type') && modal.hasOwnProperty('message')) {
            /*
            *  {
            *      "type":"success",
            *      "message":{
            *          "key1":"message1",
            *          "key2":"message2"
            *      }
            *  }
            *  只有一种配置，优先解析
            */
            const fun = dialog ? _dialogFun[modal.type] : _messageFun[modal.type];
            let message = modal.message[key];
            if (params) {
                message = Expr.formatExpr(message, params);
            }
            return {fun, message};
        } else if (modal.hasOwnProperty('success') || modal.hasOwnProperty('error')) {
            /*
             * {
             *      "success":{
             *          "key1":"message1",
             *          "key2":"message2"
             *      },
             *      "error":{
             *          "key1":"message1",
             *          "key2":"message2"
             *      }
             * }
             */
            const {success = {}, error = {}} = modal;
            const type = success[key] && !error[key] ? "success" : "error";
            const fun = dialog ? _dialogFun[type] : _messageFun[type];
            let message = "success" === type ? success[key] : error[key];
            if (params) {
                message = Expr.formatExpr(message, params);
            }
            return {fun, message};
        }
    } else {
        console.error("[Zero] Core config key '_modal' missing in Hoc.");
    }
};
/**
 * 显示窗口专用函数，该函数用于根据资源文件中的配置信息显示窗口，资源文件必须包含`_modal`或`modal`节点；
 * * key用于从`modal`配置中提取窗口信息
 * @method showDialog
 * @param {React.PureComponent} reference React对应组件引用
 * @param {String} key 提取配置的key值
 * @param {Function} fnSuccess 窗口按钮的回调函数
 * @param {Object} params 传入参数，用于处理message专用
 * @example
 *
 *      ...
 *      "_modal": {
 *          "type": "success",
 *          "message": {
 *              "add": "您的账单项目添加成功！",
 *              "edit": "您的账单项目保存成功！"
 *          }
 *      }
 */
const showDialog = (reference, key, fnSuccess, params) => {
    const config = _configModal(reference, key, params);
    config.fun(reference, config.message, fnSuccess);
};
/**
 * 显示窗口专用函数，该函数用于根据资源文件中的配置信息显示窗口，资源文件必须包含`_modal`或`modal`节点；
 * * key用于从`modal`配置中提取窗口信息
 * @method showMessage
 * @param {React.PureComponent} reference React对应组件引用
 * @param {String} key 提取配置的key值
 * @param {Function} fnSuccess 窗口按钮的回调函数
 * @param {Object} params 传入参数，用于处理message专用
 * @example
 *
 *      ...
 *      "_modal": {
 *          "type": "success",
 *          "message": {
 *              "add": "您的账单项目添加成功！",
 *              "edit": "您的账单项目保存成功！"
 *          }
 *      }
 */
const showMessage = (reference, key, fnSuccess, params) => {
    const config = _configModal(reference, key, params, false);
    config.fun(config.message, fnSuccess);
};
/**
 * 显示窗口专用函数，直接和React的组件联合使用
 * * `fnShow`函数必须存在于reference.props
 * @method fadeIn
 * @param {React.PureComponent} reference React对应组件引用
 */
const fadeIn = (reference = {}) => {
    const {fnShow} = reference.props;
    if (fnShow) {
        fnShow();
    } else {
        console.error("[Zero] 'fnShow' function missing in reference.props.");
    }
};
/**
 * 隐藏窗口专用函数，直接和React的组件联合使用
 * * `fnHide`函数必须存在于reference.props
 * @method fadeOut
 * @param {React.PureComponent} reference React对应组件引用
 */
const fadeOut = (reference = {}) => {
    const {fnHide} = reference.props;
    if (fnHide) {
        fnHide();
    } else {
        console.error("[Zero] 'fnHide' function missing in reference.props.");
    }
};
/**
 * @class Dialog
 * @description 窗口专用雷用于处理弹出窗口的开与关的信息
 */
export default {
    fadeIn,
    fadeOut,
    showError,
    showSuccess,
    showConfirm,
    showDialog,
    showMessage
}
