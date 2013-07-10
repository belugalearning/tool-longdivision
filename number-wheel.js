define(['constants', 'canvasclippingnode'], function(constants, CanvasClippingNode) {
	'use strict';

	var numberWheelPositions = constants['numberWheelPositions'];
	var decimalPointIndex = 10;

	var NumberWheel = cc.Node.extend({
		sectionWidth:80,
		sectionHeight:130,

		ctor:function(numberOfDigits) {
			this._super();

			var background = new cc.Sprite.create(bl.resources['images_number_wheel_nw_' + numberOfDigits + "_ov"]);
			this.addChild(background);

			var offsets = [0, -40, -75, -115, -150, -192];

			this.buttons = [];
			this.digitNodes = [];

			for (var i = 0; i < numberOfDigits; i++) {
				var xPosition = offsets[numberOfDigits - 1] + 77 * i;

				var sectionBackground = new cc.Sprite.create(bl.resources['images_number_wheel_numberwheelsectionbackground']);
				sectionBackground.setPosition(xPosition, 0);
				sectionBackground.setZOrder(-1);
				this.addChild(sectionBackground);
				// sectionBackground.setColor(cc.c4f(50 + i * 25, 0,0,1));

				var digitClipNode = new CanvasClippingNode();
				digitClipNode.drawPathToClip = function() {
					this.ctx.rect(0, -130, 100, 130);
				}
				sectionBackground.addChild(digitClipNode);

				var digitNode = new cc.Node();
				digitClipNode.addChild(digitNode);
				digitNode.setPosition(this.sectionWidth/2, this.sectionHeight/2 + 5);
				digitNode.numberWheelPositionIndex = 0;
				digitNode.actionInProgress = false;

				digitNode.visibleLabel = new cc.LabelTTF.create("", "mikadobold", 45);
				digitNode.addChild(digitNode.visibleLabel);
				digitNode.visibleLabel.setColor(cc.c3b(0,0,0));

				digitNode.aboveLabel = new cc.LabelTTF.create("", "mikadobold", 45);
				digitNode.aboveLabel.setPosition(0, this.sectionHeight);
				digitNode.addChild(digitNode.aboveLabel);
				digitNode.aboveLabel.setColor(cc.c3b(0,0,0));

				digitNode.belowLabel = new cc.LabelTTF.create("", "mikadobold", 45);
				digitNode.belowLabel.setPosition(0, -this.sectionHeight);
				digitNode.addChild(digitNode.belowLabel);
				digitNode.belowLabel.setColor(cc.c3b(0,0,0));

				this.setDigitNodeToNormal(digitNode);

				this.digitNodes.push(digitNode);

				var upButton = new cc.Sprite();
				upButton.initWithFile(bl.resources['images_long_division_numberpicker_up_arrow']);
				upButton.setPosition(xPosition, 120);
				this.addChild(upButton);
				upButton.isUp = true;
				upButton.positionIndex = i;
				this.buttons.push(upButton); 

				var downButton = new cc.Sprite();
				downButton.initWithFile(bl.resources['images_long_division_numberpicker_down_arrow']);
				downButton.setPosition(xPosition, -130);
				this.addChild(downButton);
				downButton.isUp = false;
				downButton.positionIndex = i;
				this.buttons.push(downButton);
			};
		},

		processTouch:function(touchLocation) {
			for (var i = 0; i < this.buttons.length; i++) {
				var button = this.buttons[i];
				if (button.touched(touchLocation)) {
					this.sectionChangeForButton(button);
				};
			};
		},

		sectionChangeForButton:function(button) {
			var positionIndex = button.positionIndex;
			var digitNode = this.digitNodes[positionIndex];
			if (!digitNode.actionInProgress) {
				digitNode.actionInProgress = true;
				var yPosition = button.isUp ? this.sectionHeight * 3/2 + 5 : -this.sectionHeight/2 + 5;
				var positionToMoveTo = cc.p(this.sectionWidth/2, yPosition);
				var moveAction = cc.MoveTo.create(0.3, positionToMoveTo);
				var resetDigitNode = cc.CallFunc.create(this.setDigitNodeToNormal, this, positionIndex);
				var scrollAndReset = cc.Sequence.create(moveAction, resetDigitNode);
				digitNode.numberWheelPositionIndex += button.isUp ? 1 : -1;
				digitNode.numberWheelPositionIndex %= numberWheelPositions.length;
				digitNode.numberWheelPositionIndex += digitNode.numberWheelPositionIndex < 0 ? numberWheelPositions.length : 0;
				digitNode.runAction(scrollAndReset);
			};
		},

		setDigitNodeToNormal:function(digitNode) {
			var numberWheelPositionIndex = digitNode.numberWheelPositionIndex;
			digitNode.visibleLabel.setString(numberWheelPositions[numberWheelPositionIndex]);
			digitNode.aboveLabel.setString(numberWheelPositions.indexWraparound(numberWheelPositionIndex - 1));
			digitNode.belowLabel.setString(numberWheelPositions.indexWraparound(numberWheelPositionIndex + 1));
			digitNode.setPosition(this.sectionWidth/2, this.sectionHeight/2 + 5);
			digitNode.actionInProgress = false;

		},

		digitPowers:function(button) {
			var decimalPointInfo = this.findDecimalPoints();
			var digitPowers = {};
			if (decimalPointInfo["numberOfPoints"] > 1) {

			} else {
				var positionOfPoint = decimalPointInfo["positionOfPoint"];
				for (var i = 0; i < positionOfPoint; i++) {
					digitPowers[i] = positionOfPoint - 1 - i;
				};
				for (var i = positionOfPoint + 1; i < this.digitNodes.length; i++) {
					digitPowers[i] = positionOfPoint - i;
				};
			}
			return digitPowers;
		},

		findDecimalPoints:function() {
			var decimalPointInfo = {"numberOfPoints":0, "positionOfPoint":this.digitNodes.length};
			var pointNotSet = true;
			for (var i = 0; i < this.digitNodes.length; i++) {
				if (this.digitNodes[i].numberWheelPositionIndex === decimalPointIndex) {
					decimalPointInfo["numberOfPoints"]++;
					if (pointNotSet) {
						decimalPointInfo["positionOfPoint"] = i;
						pointNotSet = false;
					};
				}
			};
			return decimalPointInfo;
		},

		value:function() {
			var value = 0;
			var digitPowers = this.digitPowers();
			for (var digit in digitPowers) {
				value += this.digitNodes[digit].numberWheelPositionIndex * Math.pow(10, digitPowers[digit]);
			};
			return value;
		},

	});

	return NumberWheel;

});