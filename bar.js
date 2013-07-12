define([], function() {
	'use strict';

	var Bar = cc.Node.extend({
		ctor:function() {
			this._super();
			this.barLeft = new cc.Sprite();
			this.barLeft.initWithFile(window.bl.getResource('bar_slither_white_left'));
			this.addChild(this.barLeft);

			this.barMiddle = new cc.Sprite();
			this.barMiddle.initWithFile(window.bl.getResource('bar_slither_white'));
			this.addChild(this.barMiddle);

			this.barRight = new cc.Sprite();
			this.barRight.initWithFile(window.bl.getResource('bar_slither_white_right'));
			this.addChild(this.barRight);
		},

		setLength:function(length) {
			var leftWidth = this.barLeft.getContentSize().width;
			var leftMainWidth = 3;
			var rightWidth = this.barRight.getContentSize().width;
			var rightMainWidth = 4;
			var lengthOfMiddle = length - leftMainWidth - rightMainWidth;
			if (lengthOfMiddle < 0) {
				this.barLeft.setVisible(false);
				this.barRight.setVisible(false);
				var scale = (length - 1)/(this.barMiddle.getContentSize().width);
				this.barMiddle.setScaleX(scale);
				this.barMiddle.setPosition(length/2 + 1, 0);
			} else {
				this.barLeft.setVisible(true);
				this.barRight.setVisible(true);
				this.barLeft.setPosition(leftMainWidth - leftWidth/2, 0);

				var scale = lengthOfMiddle/(this.barMiddle.getContentSize().width);
				this.barMiddle.setScaleX(scale);
				this.barMiddle.setPosition(leftMainWidth + lengthOfMiddle/2, 0);

				this.barRight.setPosition(leftMainWidth + lengthOfMiddle + rightWidth/2, 0);
			};
		},

		setColor:function(color) {
			this.barLeft.setColor(color);
			this.barMiddle.setColor(color);
			this.barRight.setColor(color);
		},
	});

	return Bar;
})