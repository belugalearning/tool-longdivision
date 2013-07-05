define(['bar'], function(Bar) {
	'use strict';

	var BarsBox = cc.Sprite.extend({

		ctor:function(dividend, divisor) {
			this._super();
			this.initWithFile(bl.resources['images_long_division_barsbox']);
			this.dividend = dividend;
			this.divisor = divisor;
			this.barsNode = new cc.Node();
			var boxLength = this.getContentSize().width;
			this.barsNode.setPosition(0, -4);
			this.addChild(this.barsNode);
			this.bars = [];
		},

		setBars:function(digitValues) {
			var totalLength = 0;
			for (var i = 0; i < this.bars.length; i++) {
				this.bars[i].removeFromParent();
			};
			this.bars = [];
			var digitKeys = [];
			for (var digitKey in digitValues) {
				digitKeys.push(digitKey);
			};
			digitKeys.sort(function(a,b){return b-a});
			for (var i = 0; i < digitKeys.length; i++) {
				var digitKey = digitKeys[i];
				for (var j = 0; j < digitValues[digitKey]; j++) {
					var bar = new Bar();

					var red = 125 + Math.floor(Math.random() * 125);
					var green = 125 + Math.floor(Math.random() * 125);
					var blue = 125 + Math.floor(Math.random() * 125);
					bar.barSprite.setColor(cc.c3b(red, green, blue));

					var length = Math.pow(10, digitKey) * this.scaleFactor();
					bar.setLength(length);
					// bar.setPosition(0,0);
					bar.setPosition(totalLength, 0);
					this.barsNode.addChild(bar);
					this.bars.push(bar);
					totalLength += length;
				};
			};
		},

		scaleFactor:function() {
			var boxLength = this.getContentSize().width;
			return boxLength * this.divisor / this.dividend;
		},

	});

	return BarsBox;
})