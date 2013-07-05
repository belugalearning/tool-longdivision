define(['numberbox', 'canvasclippingnode'], function(NumberBox, CanvasClippingNode) {
	'use strict';

	var NumberPickerBox = cc.Node.extend({

		numberBoxes:[],
		boxesPastFirst:8,
		firstBoxShownIndex:null,
		scrolling:false,
		layer:null,

		ctor:function() {
			this._super();

			var container = new cc.Sprite();
            container.initWithFile(bl.resources['images_long_division_numberpickerbox']);
            this.addChild(container);

            var numberPickerClipper = new CanvasClippingNode();
            numberPickerClipper.drawPathToClip = function() {
                this.ctx.rect(1, -203, 588, 203);
            },
            numberPickerClipper.setZOrder(-1);
            container.addChild(numberPickerClipper);

			this.slideNode = new cc.Node();
			this.slideNode.setPosition(70, 100);
			// container.addChild(this.slideNode);
			numberPickerClipper.addChild(this.slideNode);

            this.firstBoxShownIndex = 0;

            var decimalPoint = new cc.Sprite();
            decimalPoint.initWithFile(bl.resources['images_long_division_decimalpoint']);
            decimalPoint.setPosition(290, 0);
            this.slideNode.addChild(decimalPoint);

			for (var i = 0; i < 8; i++) {
				this.addBox();
			};

			this.setVisibleBoxesAfterSlide();

            var leftRightMenu = new cc.Menu.create();
            leftRightMenu.setPosition(0,0);
            this.addChild(leftRightMenu);

            var leftArrowFilename = bl.resources['images_long_division_numberpicker_left_arrow'];
            var leftButton = cc.MenuItemImage.create(leftArrowFilename, leftArrowFilename, this.scrollLeft, this);
            leftButton.setPosition(-325, 0);
            leftRightMenu.addChild(leftButton);

            var rightArrowFilename = bl.resources['images_long_division_numberpicker_right_arrow']
            var rightButton = cc.MenuItemImage.create(rightArrowFilename, rightArrowFilename, this.scrollRight, this);
            rightButton.setPosition(327, 0);
            leftRightMenu.addChild(rightButton);

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
					// this.numberBoxes[this.numberBoxes.length - 1].processVisible(false);
				};
			};
		},

		scrollToFirstBoxShown:function() {
			var positionOfBox = this.numberBoxes[this.firstBoxShownIndex].getPosition();
			var newPosition = cc.p(-positionOfBox.x + 70, positionOfBox.y + 100);
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
					this.numberBoxes[i].processVisible(true);
				} else {
					this.numberBoxes[i].processVisible(false);
				};
				this.numberBoxes[i]
			};
		},

		setVisibleBoxesAfterSlide:function() {
			for (var i = 0; i < this.numberBoxes.length; i++) {
				if (i > this.firstBoxShownIndex - 2 && i < this.firstBoxShownIndex + 7) {
					this.numberBoxes[i].processVisible(true);
				} else {
					this.numberBoxes[i].processVisible(false);
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