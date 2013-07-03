define(['constants', 'canvasclippingnode'], function(constants, CanvasClippingNode) {
	'use strict';

	var numberWheelPositions = constants['numberWheelPositions'];
	var decimalPointIndex = 11;

	var NumberWheel = cc.Node.extend({
		sectionValueIndices:[],
		digitNodes:[],
		buttons:[],
		sectionWidth:80,
		sectionHeight:130,

		ctor:function(numberOfDigits) {
			this._super();

			var background = new cc.Sprite.create(s_number_wheel_backgrounds[numberOfDigits - 1]);
			this.addChild(background);

			var offsets = [0, -40, -75, -115, -150, -192];

			for (var i = 0; i < numberOfDigits; i++) {
				this.sectionValueIndices.push(0);

				var xPosition = offsets[numberOfDigits - 1] + 77 * i;

				var sectionBackground = new cc.Sprite.create(s_number_wheel_section_background);
				sectionBackground.setPosition(xPosition, 0);
				sectionBackground.setZOrder(-1);
				this.addChild(sectionBackground);
				// sectionBackground.setColor(cc.c4f(50 + i * 25, 0,0,1));

				var digitClipNode = new CanvasClippingNode();
				digitClipNode.drawPathToClip = function() {
					var ctx = cc.renderContext;
					ctx.rect(0, -this.sectionHeight, this.sectionWidth, this.sectionHeight);
				}
				sectionBackground.addChild(digitClipNode);

				var digitNode = new cc.Node();
				digitClipNode.addChild(digitNode);
				digitNode.setPosition(0,5);

				digitNode.visibleLabel = new cc.LabelTTF.create(numberWheelPositions[0], "mikadobold", 34);
				digitNode.visibleLabel.setPosition(this.sectionWidth/2, this.sectionHeight/2);
				digitNode.addChild(digitNode.visibleLabel);
				digitNode.visibleLabel.setColor(cc.c3b(0,0,0));

				digitNode.aboveLabel = new cc.LabelTTF.create(numberWheelPositions.indexWraparound(-1), "mikadobold", 34);
				digitNode.aboveLabel.setPosition(this.sectionWidth/2, this.sectionHeight * 3/2);
				digitNode.addChild(digitNode.aboveLabel);
				digitNode.aboveLabel.setColor(cc.c3b(0,0,0));

				digitNode.belowLabel = new cc.LabelTTF.create(numberWheelPositions.indexWraparound(1), "mikadobold", 34);
				digitNode.belowLabel.setPosition(this.sectionWidth/2, this.sectionHeight * -1/2);
				digitNode.addChild(digitNode.belowLabel);
				digitNode.belowLabel.setColor(cc.c3b(0,0,0));

				this.digitNodes.push(digitNode);
				
				// var digitLabel = new cc.LabelTTF.create(this.sectionValueIndices[i], "mikadobold", 34);
				// digitLabel.setPosition(40, 75);
				// digitLabel.setColor(cc.c4f(0,0,0,1));
				// digitLabel.setZOrder(-1);
				// digitClipNode.addChild(digitLabel);
				// this.digitLabels.push(digitLabel);

				var upButton = new cc.Sprite();
				upButton.initWithFile(s_arrow_up);
				upButton.setPosition(xPosition, 120);
				this.addChild(upButton);
				upButton.isUp = true;
				upButton.positionIndex = i;
				this.buttons.push(upButton); 

				var downButton = new cc.Sprite();
				downButton.initWithFile(s_arrow_down);
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
			var sectionValueIndex = this.sectionValueIndices[positionIndex];
			var multiplier = button.isUp ? 1 : -1;
			var positionToMoveTo = cc.p(0, multiplier * this.sectionHeight + 5);
			var moveAction = cc.MoveTo.create(0.3, positionToMoveTo);
			digitNode.runAction(moveAction);
/*			var positionIndex = button.positionIndex;
			var label = this.digitLabels[positionIndex];
			var sectionValueIndex = this.sectionValueIndices[positionIndex];
			var toAdd = button.isUp ? 1 : -1;
			sectionValueIndex += toAdd;
			var numberOfPositions = numberWheelPositions.length;
			sectionValueIndex %= numberOfPositions;
			sectionValueIndex += sectionValueIndex < 0 ? numberOfPositions : 0;
			label.setString(numberWheelPositions[sectionValueIndex]);
			this.sectionValueIndices.splice(positionIndex, 1, sectionValueIndex);
*/		},

		numberOfEachUnit:function(button) {
			var numbersOfUnits = [];
			var numberOfDecimalPoints = this.numberOfDecimalPoints();
			if (numberOfDecimalPoints > 1) {
				
			}
		},

	});

	return NumberWheel;

});