define(['numberbox', 'canvasclippingnode', 'constants'], function(NumberBox, CanvasClippingNode, constants) {
	'use strict';

	var NumberPickerLabels = constants['NumberPickerLabels'];

	var NumberPickerBox = cc.Node.extend({

		numberBoxes:[],
		boxesPastFirst:8,
		firstBoxShownIndex:null,
		scrolling:false,
		layer:null,

		ctor:function() {
			this._super();

			this.numberBoxes = [];

			var container = new cc.Sprite();
            container.initWithFile(window.bl.getResource('numberpickerbox'));
            this.addChild(container);

            this.numberPickerClipper = new CanvasClippingNode();
            this.numberPickerClipper.drawPathToClip = function() {
                this.ctx.rect(1, -203, 588, 203);
            },
            this.numberPickerClipper.setZOrder(-1);
            container.addChild(this.numberPickerClipper);

			this.slideNode = new cc.Node();
			this.slideNode.setPosition(70, 80);
			// container.addChild(this.slideNode);
			this.numberPickerClipper.addChild(this.slideNode);

            this.firstBoxShownIndex = 0;

            var decimalPoint = new cc.Sprite();
            decimalPoint.initWithFile(window.bl.getResource('decimalpoint'));
            decimalPoint.setPosition(290, 0);
            this.slideNode.addChild(decimalPoint);

			for (var i = 0; i < 8; i++) {
				this.addBox();
			};

			this.setVisibleBoxesAfterSlide();

			this.setupLabelNodes();

            var leftRightMenu = new cc.Menu.create();
            leftRightMenu.setPosition(0,0);
            this.addChild(leftRightMenu);

            var leftArrowFilename = window.bl.getResource('numberpicker_left_arrow');
            var leftButton = cc.MenuItemImage.create(leftArrowFilename, leftArrowFilename, this.scrollLeft, this);
            leftButton.setPosition(-325, 0);
            leftRightMenu.addChild(leftButton);

            var rightArrowFilename = window.bl.getResource('numberpicker_right_arrow')
            var rightButton = cc.MenuItemImage.create(rightArrowFilename, rightArrowFilename, this.scrollRight, this);
            rightButton.setPosition(327, 0);
            leftRightMenu.addChild(rightButton);

		},

		setupLabelNodes:function() {
			var numberLabelKeySuffixes = ['1000', '100', '10', '1', '1over10', '1over100', '1over1000'];
			var powerLabelKeySuffixes = ['10+3', '10+2', '10+1', '1', '10_1', '10_2', '10_3'];
			var wordLabelKeySuffixes = ['thousands', 'hundreds', 'tens', 'units', 'tenths', 'hundredths', 'thousandths'];

			this.numberLabelNode = this.setupNodeWithSuffixes(numberLabelKeySuffixes);
			this.slideNode.addChild(this.numberLabelNode);
			// this.numberLabelNode.setVisible(false);

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
			var xPosition = 80 * boxIndex;
			xPosition += numberBox.power >= 0 ? 0 : 20;
			numberBox.setPosition(xPosition, 0);
			this.slideNode.addChild(numberBox);
			this.numberBoxes[boxIndex] = numberBox;
			numberBox.boxVisible(false);
			numberBox.boxEnabled(false);
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
			var scrollAndSet = cc.Sequence.create(scroll, setScrollingFalse, setVisibleBoxes);
			this.slideNode.runAction(scrollAndSet);
		},

		setVisibleBoxesBeforeSlide:function() {
			for (var i = 0; i < this.numberBoxes.length; i++) {
				if (i >= this.firstBoxShownIndex - 2 && i <= this.firstBoxShownIndex + 7) {
					this.numberBoxes[i].boxVisible(true);
				} else {
					this.numberBoxes[i].boxVisible(false);
				};
				this.numberBoxes[i].boxEnabled(false);
			};
		},

		setVisibleBoxesAfterSlide:function() {
			for (var i = 0; i < this.numberBoxes.length; i++) {
				if (i > this.firstBoxShownIndex - 2 && i < this.firstBoxShownIndex + 7) {
					this.numberBoxes[i].boxVisible(true);
				} else {
					this.numberBoxes[i].boxVisible(false);
				};
				if (i > this.firstBoxShownIndex - 1 && i < this.firstBoxShownIndex + 7) {
					this.numberBoxes[i].boxEnabled(true);
				} else {
					this.numberBoxes[i].boxEnabled(false);
				};
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
		},
	});

	return NumberPickerBox
})