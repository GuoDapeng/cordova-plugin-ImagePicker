/**
 * Created by zhongpeng on 2017/5/31.
 */
var cordova            = require('cordova'),

    exec               = require('cordova/exec'),

    // Reference name for the plugin
    PLUGIN_NAME        = 'ImagePicker',

    // Plugin methods on the native side that can be called from JavaScript
    pluginNativeMethod = {
        START       : 'start',
        STOP        : 'stop',
        GET_PICTURES: 'getPictures'
    },

    // 事件名字要是全部小写的，只是在 cordova 8.0.0 是这样
    CHANNELS           = {
        IMAGE_PICKER_DOWNLOAD_FINISHED: 'image_picker_download_finished'
    };

var ImagePicker = function () {
    this.channels = {
        IMAGE_PICKER_DOWNLOAD_FINISHED: cordova.addWindowEventHandler(CHANNELS.IMAGE_PICKER_DOWNLOAD_FINISHED)
    };

    for (var key in this.channels) {
        if (this.channels.hasOwnProperty(key)) {
            this.channels[key].onHasSubscribersChange = ImagePicker.onHasSubscribersChange;
        }
    }
};

/**
 * Event handlers for when callbacks get registered for the battery.
 * Keep track of how many handlers we have so we can start and stop the native battery listener
 * appropriately (and hopefully save on battery life!).
 */
ImagePicker.onHasSubscribersChange = function () {
    console.log("onHasSubscribersChange");
    // If we just registered the first handler, make sure native listener is started.
    if (this.numHandlers === 1 && handlers() === 1) {
        exec(imagePicker._status, imagePicker._error, PLUGIN_NAME, pluginNativeMethod.START, []);
    } else if (handlers() === 0) {
        exec(null, null, PLUGIN_NAME, pluginNativeMethod.STOP, []);
    }
};

/**
 * 获取图片地址
 * @param onSuccess
 * @param onFail
 * @param params
 */
ImagePicker.prototype.getPictures = function (onSuccess, onFail, params) {
    exec(onSuccess, onFail, PLUGIN_NAME, pluginNativeMethod.GET_PICTURES, [params]);
};

ImagePicker.prototype._status = function (info) {
    if (info) {
        cordova.fireWindowEvent(CHANNELS.IMAGE_PICKER_DOWNLOAD_FINISHED, info);
    }
};

ImagePicker.prototype._error = function (e) {
    console.log('Error initializing Battery: ' + e);
};

function handlers() {
    return imagePicker.channels.IMAGE_PICKER_DOWNLOAD_FINISHED.numHandlers;
}

var imagePicker = new ImagePicker();

module.exports = imagePicker;
