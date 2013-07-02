define(['constants'], function(constants) {
	'use strict';

	var numberWheelPositions = constants['numberWheelPositions'];

	var NumberWheel = cc.Node.extend({
		sectionValueIndices:[],
		digitLabels:[],
		buttons:[],

		ctor:function(numberOfDigits) {
			this._super();

			for (var i = 0; i < numberOfDigits; i++) {
				this.sectionValueIndices.push(0);
			};

			var background = new cc.Sprite.create(s_number_wheel_backgrounds[numberOfDigits-1]);
			this.addChild(background);

			var offsets = [0, -40, -75, -115, -150, -192];

			for (var i = 0; i < numberOfDigits; i++) {
				var xPosition = offsets[numberOfDigits - 1] + 77 * i;

				var sectionBackground = new cc.Sprite.create(s_number_wheel_section_background);
				sectionBackground.setPosition(xPosition, 0);
				sectionBackground.setZOrder(-1);
				this.addChild(sectionBackground);
				// sectionBackground.setColor(cc.c4f(50 + i * 25, 0,0,1));
				
				var digitLabel = new cc.LabelTTF.create(this.sectionValueIndices[i], "mikadobold", 34);
				digitLabel.setPosition(xPosition, 0);
				digitLabel.setColor(cc.c4f(0,0,0,1));
				digitLabel.setZOrder(-1);
				this.addChild(digitLabel);
				this.digitLabels.push(digitLabel);

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
			var label = this.digitLabels[positionIndex];
			var sectionValueIndex = this.sectionValueIndices[positionIndex];
			var toAdd = button.isUp ? 1 : -1;
			sectionValueIndex += toAdd;
			var numberOfPositions = numberWheelPositions.length;
			sectionValueIndex %= numberOfPositions;
			sectionValueIndex += sectionValueIndex < 0 ? numberOfPositions : 0;
			label.setString(numberWheelPositions[sectionValueIndex]);
			this.sectionValueIndices.splice(positionIndex, 1, sectionValueIndex);
		},

	});

	return NumberWheel;

});