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

			this.leftMainWidth = 3;
			this.rightMainWidth = 4;
		},

		setLength:function(length, rounded) {
			if (rounded !== false) {
				rounded = true;
			};
			if (length > 1) {
				this.setVisible(true);
				var leftWidth = this.barLeft.getContentSize().width;
				var rightWidth = this.barRight.getContentSize().width;
				var lengthOfMiddle = length - this.leftMainWidth - this.rightMainWidth;
				if (lengthOfMiddle < 0 || !rounded) {
					this.barLeft.setVisible(false);
					this.barRight.setVisible(false);
					var scale = length/(this.barMiddle.getContentSize().width);
					this.barMiddle.setScaleX(scale);
					this.barMiddle.setPosition(length/2, 0);
				} else {
					this.barLeft.setVisible(true);
					this.barRight.setVisible(true);
					this.barLeft.setPosition(this.leftMainWidth - leftWidth/2, 0);

					var scale = lengthOfMiddle/(this.barMiddle.getContentSize().width);
					this.barMiddle.setScaleX(scale);
					this.barMiddle.setPosition(this.leftMainWidth + lengthOfMiddle/2, 0);

					this.barRight.setPosition(this.leftMainWidth + lengthOfMiddle + rightWidth/2, 0);
				};
			} else {
				this.setVisible(false);
			};
		},

		isShort:function(length) {
			return length - this.leftMainWidth - this.rightMainWidth < 0;
		},

		isVeryShort:function(length) {
			return length < 0.01;
		},

		setColor:function(color) {
			this.barLeft.setColor(color);
			this.barMiddle.setColor(color);
			this.barRight.setColor(color);
		},
	});

	return Bar;
})