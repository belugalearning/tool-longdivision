require.config({
	paths: {
        'toollayer': '../../tools/common/toollayer',
        'numberwheel': '../../tools/long_division/number-wheel',
        'constants': '../../tools/long_division/constants',
	}
});

define(['exports', 'cocos2d', 'toollayer', 'qlayer', 'numberwheel', 'constants'], function(exports, cocos2d, ToolLayer, QLayer, NumberWheel, constants) {
	'use strict';

	var Tool = ToolLayer.extend({

		init:function() {

			this._super();

			this.setTouchEnabled(true);

            this.size = cc.Director.getInstance().getWinSize();
            var size = this.size;


            var clc = cc.Layer.create();
            var background = new cc.Sprite();
            background.initWithFile(s_deep_water_background);
            background.setPosition(size.width/2, size.height/2);
            clc.addChild(background);
            this.addChild(clc,0);

            this.numberWheel = new NumberWheel(6);
            this.numberWheel.setPosition(size.width/2, size.height/2);
            this.addChild(this.numberWheel);

            return this;
		},

        onTouchesBegan:function(touches, event) {
            var touchLocation = this.convertTouchToNodeSpace(touches[0]);
            this.numberWheel.processTouch(touchLocation);
        },

	});

	exports.ToolLayer = Tool;
});