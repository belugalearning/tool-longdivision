define(['canvasclippingnode', 'barsbox'], function(CanvasClippingNode, BarsBox) {
	'use strict';

	var MagnifiedBarsBox = cc.Sprite.extend({
		ctor:function(dividend, divisor) {
			this._super();
			this.initWithFile(bl.resources['images_long_division_magnifyingglass']);
			var clipperNode = new CanvasClippingNode();
			clipperNode.drawPathToClip = function() {
				this.ctx.arc(112, -117, 87, 0, 2 * Math.PI, false);
			}
			clipperNode.setPosition(0,0);
			this.addChild(clipperNode);
			var testBox = new cc.Sprite();
			// testBox.initWithFile(bl.resources['images_long_division_testbigwhitebox']);
			// clipperNode.addChild(testBox);

			var magnifyFactor = 5;

			this.barsBox = new BarsBox(dividend / magnifyFactor, divisor);
			this.barsBox.setPosition(-260, 100);
			this.barsBox.barsNode.setPosition((1 - magnifyFactor) * this.barsBox.getContentSize().width, -4)
			clipperNode.addChild(this.barsBox);
			// this.addChild(this.barsBox);
		},

		setBars:function(digitValues) {
			this.barsBox.setBars(digitValues);
		},
	});

	return MagnifiedBarsBox;
})