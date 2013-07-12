define([], function() {
	'use strict';

	var Bar = cc.Node.extend({
		ctor:function() {
			this._super();
			this.barSprite = new cc.Sprite();
			//this.barSprite.setScaleX(100);
			this.barSprite.initWithFile(window.bl.getResource('bar_slither_white'));
			this.barSprite.setAnchorPoint(0,0.5);
			this.barSprite.setPosition(0,0);
			this.addChild(this.barSprite);
		},

		setLength:function(length) {
			var scale = length/(this.barSprite.getContentSize().width);
			this.barSprite.setScaleX(scale);
		},
	});

	return Bar;
})