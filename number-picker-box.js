define(['numberbox', 'canvasclippingnode', 'constants'], function(NumberBox, CanvasClippingNode, constants) {
	'use strict';

	var NumberPickerLabels = constants['NumberPickerLabels'];

	var NumberPickerBox = cc.Node.extend({

		numberBoxes:[],
		boxesPastFirst:13,
		firstBoxShownIndex:null,
		scrolling:false,
		layer:null,
		insignificantGrey:cc.c3b(150, 150, 150),

		ctor:function() {
			this._super();

			this.numberBoxes = [];

			var container = new cc.Sprite();
            container.initWithFile(window.bl.getResource('numberpicker_box'));
            this.addChild(container);

            this.numberPickerClipper = new CanvasClippingNode();
            this.numberPickerClipper.drawPathToClip = function() {
                this.ctx.rect(1, -208, 918, 206);
            },
            this.numberPickerClipper.setZOrder(-1);
            container.addChild(this.numberPickerClipper);

/*            var testBox = new cc.Sprite();
            testBox.initWithFile(window.bl.getResource('testbigwhitebox'));
            testBox.setPosition(500,30);
            this.numberPickerClipper.addChild(testBox);
*/
			this.slideNode = new cc.Node();
			this.slideNode.setPosition(70, 80);
			// container.addChild(this.slideNode);
			this.numberPickerClipper.addChild(this.slideNode);

            this.firstBoxShownIndex = 0;

            var decimalPoint = new cc.Sprite();
            decimalPoint.initWithFile(window.bl.getResource('decimalpoint'));
            decimalPoint.setPosition(294, 0);
            this.slideNode.addChild(decimalPoint);

			for (var i = 0; i < this.boxesPastFirst; i++) {
				this.addBox();
			};

			this.setVisibleBoxesAfterSlide();

			this.setupLabelNodes();

            this.leftButton = new cc.Sprite();
            this.leftButton.initWithFile(window.bl.getResource('numberpicker_left_arrow'));
            this.leftButton.setPosition(-485, 0);
            this.addChild(this.leftButton);
            this.leftTouch = false;

            this.rightButton = new cc.Sprite();
            this.rightButton.initWithFile(window.bl.getResource('numberpicker_right_arrow'));
            this.rightButton.setPosition(486, 0);
            this.addChild(this.rightButton);
            this.rightTouch = false;

		},

		setupLabelNodes:function() {
			var numberLabelKeySuffixes = ['1000', '100', 'number10', '1', '1over10', '1over100', '1over1000'];
			var powerLabelKeySuffixes = ['10+3', '10+2', '10+1', '1', '10_1', '10_2', '10_3'];
			var wordLabelKeySuffixes = ['thousands', 'hundreds', 'tens', 'units', 'tenths', 'hundredths', 'thousandths'];

			this.numberLabelNode = this.setupNodeWithSuffixes(numberLabelKeySuffixes);
			this.slideNode.addChild(this.numberLabelNode);
			this.numberLabelNode.setVisible(false);

			this.powerLabelNode = this.setupNodeWithSuffixes(powerLabelKeySuffixes);
			this.slideNode.addChild(this.powerLabelNode);
			this.powerLabelNode.setVisible(false);

			this.wordLabelNode = this.setupNodeWithSuffixes(wordLabelKeySuffixes);
			this.slideNode.addChild(this.wordLabelNode);
			this.wordLabelNode.setVisible(false);
		},

		setLabelType:function(labelType) {
			this.numberLabelNode.setVisible(false);
			this.powerLabelNode.setVisible(false);
			this.wordLabelNode.setVisible(false);
			switch (labelType) {
				case NumberPickerLabels.NUMBERS:
					this.numberLabelNode.setVisible(true);
					break;
				case NumberPickerLabels.POWERS:
					this.powerLabelNode.setVisible(true);
					break;
				case NumberPickerLabels.WORDS:
					this.wordLabelNode.setVisible(true);
					break;
			}
		},

		setupNodeWithSuffixes:function(keySuffixes) {
			var labelNode = new cc.Node();
			labelNode.setPosition(0, 100);
			for (var i = 0; i < keySuffixes.length; i++) {
				var label = new cc.Sprite();
				label.initWithFile(bl.getResource('labels_label_' + keySuffixes[i]));
				label.setPosition(this.numberBoxes[i].getPosition().x, 0);
				labelNode.addChild(label);
			};
			return labelNode;
		},

		addBox:function() {
			var numberBox = new NumberBox();
			numberBox.numberPickerBox = this;
			var boxIndex = this.numberBoxes.length;
			numberBox.power = 3 - boxIndex;
			var xPosition = 81 * boxIndex;
			xPosition += numberBox.power >= 0 ? 0 : 20;
			numberBox.setPosition(xPosition, 0);
			this.slideNode.addChild(numberBox);
			this.numberBoxes[boxIndex] = numberBox;
			numberBox.boxVisible(false);
			numberBox.boxEnabled(false);
			numberBox.setDigitColor(this.insignificantGrey);
		},

		processTouch:function(touchLocation) {
			if (this.leftButton.touched(touchLocation)) {
				this.scrollLeft();
				this.leftTouch = true;
			} else if (this.rightButton.touched(touchLocation)) {
				this.scrollRight();
				this.rightTouch = true;
			};
		},

		processEnd:function() {
			this.leftTouch = false;
			this.rightTouch = false;
		},

		scrollLeft:function() {
			if (!this.scrolling) {
				if (this.firstBoxShownIndex !== 0) {
					this.scrolling = true;	
					this.firstBoxShownIndex--;
					this.scrollToFirstBoxShown();
				};
			};
		},

		scrollRight:function() {
			if (!this.scrolling) {
				this.scrolling = true;
				this.firstBoxShownIndex++;
				this.scrollToFirstBoxShown();
				if (this.firstBoxShownIndex + this.boxesPastFirst > this.numberBoxes.length) {
					this.addBox();
					// this.numberBoxes[this.numberBoxes.length - 1].setVisible(false);
				};
			};
		},

		scrollToFirstBoxShown:function() {
			var positionOfBox = this.numberBoxes[this.firstBoxShownIndex].getPosition();
			var newPosition = cc.p(-positionOfBox.x + 70, this.slideNode.getPosition().y);
			var scroll = cc.MoveTo.create(0.3, newPosition);
			var setScrollingFalse = cc.CallFunc.create(function() {this.scrolling = false}, this);
			this.setVisibleBoxesBeforeSlide();
			var setVisibleBoxes = cc.CallFunc.create(this.setVisibleBoxesAfterSlide, this);
			var repeatCall = cc.CallFunc.create(this.repeatCall, this);
			var scrollAndSet = cc.Sequence.create(scroll, setScrollingFalse, setVisibleBoxes, repeatCall);
			this.slideNode.runAction(scrollAndSet);
		},

		setVisibleBoxesBeforeSlide:function() {
			for (var i = 0; i < this.numberBoxes.length; i++) {
				if (i >= this.firstBoxShownIndex - 2 && i <= this.firstBoxShownIndex + this.boxesPastFirst - 1) {
					this.numberBoxes[i].boxVisible(true);
				} else {
					this.numberBoxes[i].boxVisible(false);
				};
				this.numberBoxes[i].boxEnabled(false);
			};
		},

		setVisibleBoxesAfterSlide:function() {
			for (var i = 0; i < this.numberBoxes.length; i++) {
				if (i > this.firstBoxShownIndex - 2 && i < this.firstBoxShownIndex + this.boxesPastFirst - 1) {
					this.numberBoxes[i].boxVisible(true);
				} else {
					this.numberBoxes[i].boxVisible(false);
				};
				if (i > this.firstBoxShownIndex - 1 && i < this.firstBoxShownIndex + this.boxesPastFirst - 2) {
					this.numberBoxes[i].boxEnabled(true);
				} else {
					this.numberBoxes[i].boxEnabled(false);
				};
			};
		},

		repeatCall:function() {
			if (this.leftTouch) {
				this.scrollLeft();
			} else if (this.rightTouch) {
				this.scrollRight();
			};
		},

		digitValues:function() {
			var digitValues = {};
			for (var i = 0; i < this.numberBoxes.length; i++) {
				var numberBox = this.numberBoxes[i];
				digitValues[numberBox.power] = numberBox.digit;
			};
			return digitValues;
		},

		value:function() {
			var value = 0;
			var digitValues = this.digitValues();
			for (var digit in digitValues) {
				value += digitValues[digit] * Math.pow(10, digit);
			}
			return value;
		},

		valueString:function() {
			var valueString = "";
			for (var i = 0; i < this.numberBoxes.length; i++) {
				if (this.numberBoxes[i].power === -1) {
					valueString += ".";
				};
				valueString += this.numberBoxes[i].digit;
			};
			while (valueString[valueString.length - 1] === "0") {
				valueString = valueString.slice(0, valueString.length - 1);
			}
			while (valueString[0] === "0" && valueString[1] !== ".") {
				valueString = valueString.slice(1);
			}
			if (valueString[valueString.length - 1] === ".") {
				valueString = valueString.slice(0, valueString.length - 1);
			};
			return valueString;
		},

		processDigitChange:function() {
			this.layer.processDigitChange();
			this.setBoxColors();
		},

		setBoxColors:function() {
			var firstSignificantIndex = 4;
			for (var i = 0; i < 4; i++) {
				var box = this.numberBoxes[i];
				if (box.digit === 0) {
					box.setDigitColor(this.insignificantGrey);
				} else {
					firstSignificantIndex = i;
					break;
				}
			};
		
			var lastSignificantIndex = 3;
			for (var i = this.numberBoxes.length - 1; i >= 4; i--) {
				var box = this.numberBoxes[i];
				if (box.digit === 0) {
					box.setDigitColor(this.insignificantGrey);
				} else {
					lastSignificantIndex = i;
					break;
				};
			};
			for (var i = firstSignificantIndex; i <= lastSignificantIndex; i++) {
				var box = this.numberBoxes[i];
				if (box.digit === 0) {
					box.setDigitColor(cc.c3b(255, 255, 255));
				} else {
					box.setDigitColor(constants['colors'].indexWraparound(box.power));
				};
			};
			if (firstSignificantIndex <= lastSignificantIndex) {
				var unitBox = this.numberBoxes[3];
				var color = unitBox.digit === 0 ? cc.c3b(255, 255, 255) : constants['colors'].indexWraparound(0);
				unitBox.setDigitColor(color);
			};

		},
	});

	return NumberPickerBox
})