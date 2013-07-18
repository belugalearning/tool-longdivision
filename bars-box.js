define(['bar', 'tooltip', 'constants'], function(Bar, ToolTip, constants) {
	'use strict';

	var BarsBox = cc.Sprite.extend({

		ctor:function(dividend, divisor) {
			this._super();
			this.initWithFile(window.bl.getResource('barsbox'));
			this.dividend = dividend;
			this.divisor = divisor;
			this.barsNode = new cc.Node();
			var boxLength = this.getContentSize().width;
			this.barsNode.setPosition(0, this.getContentSize().height/2 - 4);
			this.addChild(this.barsNode);
			this.bars = [];
			this.toolTipNode = new cc.Node();
			this.toolTipNode.setPosition(0, 8);
			this.addChild(this.toolTipNode);
			this.toolTipNode.setZOrder(1);
			// this.testLabel = new cc.LabelTTF.create("Hello", "mikadoBold", 24);
			// this.testLabel.setPosition()
			// this.addChild(this.testLabel);
		},

		setBars:function(digitValues) {
			var totalLength = 0;
			var totalValue = 0;
			this.barsNode.removeAllChildren();
			this.toolTipNode.removeAllChildren();
/*			for (var i = 0; i < this.bars.length; i++) {
				this.bars[i].removeFromParent();
			};
*/			this.bars = [];
			var colors = constants['colors'];
			var digitKeys = [];
			for (var digitKey in digitValues) {
				digitKeys.push(digitKey);
			};
			digitKeys.sort(function(a,b){return b-a});
			var colourIndex = 0;
			if (this.dividend === 0) {
				for (var i = 0; i < digitKeys.length; i++) {
					if (digitValues[digitKeys[i]] !== 0) {
						var bigBar = new Bar();
						bigBar.setColor(cc.c3b(255, 0, 0));
						bigBar.setLength(10000);
						bigBar.setPosition(0,0);
						this.barsNode.addChild(bigBar);
						this.bars.push(bigBar);
						break;
					}
				};
			} else {
				for (var i = 0; i < digitKeys.length; i++) {
					var digitKey = digitKeys[i];
					var digit = digitValues[digitKey];
					var value = Math.pow(10, digitKey) * this.divisor;
					var length = Math.pow(10, digitKey) * this.scaleFactor();
					var dummyBar = new Bar();
					if (dummyBar.isVeryShort(length)) {
						break;
					};
					if (!dummyBar.isShort(length)) {
						for (var j = 0; j < digit; j++) {
							var bar = new Bar();
							bar.setColor(colors.indexWraparound(digitKey));
							bar.setLength(length);
							// bar.setPosition(0,0);
							bar.setPosition(totalLength, 0);
							this.barsNode.addChild(bar);
							this.bars.push(bar);
							totalValue += value;
							totalLength += length;

							var toolTip = new ToolTip();
							toolTip.setAutoFontSize(true);
							toolTip.setPosition(totalLength - 2, 70);
							var totalValueRounded = Math.round(totalValue * 10000)/10000;
							toolTip.setLabelString(totalValueRounded);
							if (length > toolTip.getContentSize().width) {
								this.toolTipNode.addChild(toolTip);
							};
						};
					} else {
						if (digit > 0) {
							var bar = new Bar();
							bar.setColor(colors.indexWraparound(digitKey % colors.length));
							bar.setLength(length * digit, false);
							bar.setPosition(totalLength, 0);
							this.barsNode.addChild(bar);
							this.bars.push(bar);
							totalValue += value * digit;
							totalLength += length * digit;
						};
					};
					colourIndex++;
				};
				if (this.layer.isTooBig(digitValues)) {
					var overColour = cc.c3b(255,0,0);
					for (var i = 0; i < this.bars.length; i++) {
						this.bars[i].setColor(overColour);
					};
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