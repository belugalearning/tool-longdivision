require.config({
	paths: {

	}
});

define([], function() {
	'use strict';

	var Tool = ToolLayer.extend({

		init:function() {

			this._super();

			this.setTouchEnabled(true);

            var clc = cc.Layer.create();
            var background = new cc.Sprite();
            background.initWithFile(s_deep_water_background);
            background.setPosition(size.width/2, size.height/2);
            clc.addChild(background);
            this.addChild(clc,0);

		}

	});

	exports.ToolLayer = Tool;
});