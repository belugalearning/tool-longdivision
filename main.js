require.config({
	paths: {
        'toollayer': '../../tools/common/toollayer',
        'numberwheel': '../../tools/long_division/number-wheel',
        'constants': '../../tools/long_division/constants',
        'canvasclippingnode': '../../tools/long_division/canvas-clipping-node',
        'numberpickerbox': '../../tools/long_division/number-picker-box',
        'numberbox': '../../tools/long_division/number-box',
	}
});

define(['exports', 'cocos2d', 'toollayer', 'qlayer', 'numberwheel', 'numberpickerbox', 'constants', 'canvasclippingnode'], function(exports, cocos2d, ToolLayer, QLayer, NumberWheel, NumberPickerBox, constants, CanvasClippingNode) {
	'use strict';

	var Tool = ToolLayer.extend({

		init:function() {

			this._super();

			this.setTouchEnabled(true);

            var dividend = 40;
            var divisor = 8;

            this.size = cc.Director.getInstance().getWinSize();
            var size = this.size;

            var clc = cc.Layer.create();
            var background = new cc.Sprite();
            background.initWithFile(bl.resources['images_deep_water_background']);
            background.setPosition(size.width/2, size.height/2);
            clc.addChild(background);
            this.addChild(clc,0);

            var numberPickerBox = new NumberPickerBox();
            numberPickerBox.setPosition(size.width/2, 400);
            this.addChild(numberPickerBox);

            var barsBox = new cc.Sprite();
            barsBox.initWithFile(bl.resources['images_long_division_barsbox']);
            barsBox.setPosition(size.width/2, 575);
            this.addChild(barsBox);

            return this;
		},

        onTouchesBegan:function(touches, event) {
            var touchLocation = this.convertTouchToNodeSpace(touches[0]);
        },

	});

	exports.ToolLayer = Tool;
});