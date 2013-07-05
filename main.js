require.config({
	paths: {
        'toollayer': '../../tools/common/toollayer',
        'numberwheel': '../../tools/long_division/number-wheel',
        'constants': '../../tools/long_division/constants',
        'canvasclippingnode': '../../tools/long_division/canvas-clipping-node',
        'numberpickerbox': '../../tools/long_division/number-picker-box',
        'numberbox': '../../tools/long_division/number-box',
        'barsbox': '../../tools/long_division/bars-box',
        'bar': '../../tools/long_division/bar',
	}
});

define(['exports', 'cocos2d', 'toollayer', 'qlayer', 'numberwheel', 'numberpickerbox', 'barsbox', 'constants', 'canvasclippingnode'], function(exports, cocos2d, ToolLayer, QLayer, NumberWheel, NumberPickerBox, BarsBox, constants, CanvasClippingNode) {
	'use strict';

	var Tool = ToolLayer.extend({

		init:function() {

			this._super();

			this.setTouchEnabled(true);

            var dividend = 999;
            var divisor = 1;

            this.size = cc.Director.getInstance().getWinSize();
            var size = this.size;

            var clc = cc.Layer.create();
            var background = new cc.Sprite();
            background.initWithFile(bl.resources['images_deep_water_background']);
            background.setPosition(size.width/2, size.height/2);
            clc.addChild(background);
            this.addChild(clc,0);

            var questionLabel = new cc.LabelTTF.create(dividend + " divided by " + divisor, "mikadoBold", 30);
            questionLabel.setPosition(size.width/2, 700);
            this.addChild(questionLabel);

            this.numberPickerBox = new NumberPickerBox();
            this.numberPickerBox.layer = this;
            this.numberPickerBox.setPosition(size.width/2, 400);
            this.addChild(this.numberPickerBox);

            this.barsBox = new BarsBox(dividend, divisor);
            this.barsBox.setPosition(size.width/2, 575);
            this.addChild(this.barsBox);

            this.testLabel = new cc.LabelTTF.create("HELLO", "mikadoBold", 24);
            this.testLabel.setPosition(size.width/2, 200);
            this.addChild(this.testLabel);

            return this;
		},

        onTouchesBegan:function(touches, event) {
            var touchLocation = this.convertTouchToNodeSpace(touches[0]);
            this.testLabel.setString(JSON.stringify(this.numberPickerBox.valueString()));
        },

        processDigitChange:function() {
            this.barsBox.setBars(this.numberPickerBox.digitValues());
        },

	});

	exports.ToolLayer = Tool;
});