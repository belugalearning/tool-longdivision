define(['canvasclippingnode'], function(CanvasClippingNode) {
	'use strict';

	var DivisionTable = cc.Sprite.extend({
		ctor:function(divisor) {
			this._super();
			this.initWithFile(window.bl.getResource('table_sectionbox'));
			this.divisor = divisor;
			this.scrolling = false;
			this.numberOfRows = 0;
			var clippingNode = new CanvasClippingNode();
			clippingNode.drawPathToClip = function() {
				this.ctx.rect(0, -203, 600, 203);
			};
			this.addChild(clippingNode);
			this.slideNode = new cc.Node();
			clippingNode.addChild(this.slideNode);
			var upButtonFilename = window.bl.getResource('table_up_arrow');
			var upButton = new cc.MenuItemImage.create(upButtonFilename, upButtonFilename, this.scrollDown, this);
			upButton.setPosition(0, 55);
			var downButtonFilename = window.bl.getResource('table_down_arrow');
			var downButton = new cc.MenuItemImage.create(downButtonFilename, downButtonFilename, this.scrollUp, this);
			downButton.setPosition(0, -55);
			var upDownMenu = new cc.Menu.create(upButton, downButton);
			upDownMenu.setPosition(525, 90);
			this.addChild(upDownMenu);

			var answerBox = new cc.Sprite();
			answerBox.initWithFile(window.bl.getResource('table_answerbox'));
			answerBox.setPosition(800, 100);
			this.addChild(answerBox);
			this.answerLabel = new cc.LabelTTF.create("", "mikadoBold", 34);
			this.answerLabel.setPosition(answerBox.getAnchorPointInPoints());
			answerBox.addChild(this.answerLabel);

		},

		clearSlideNode:function() {
			this.slideNode.removeAllChildren();
			// this.slideNode.setPosition(0,0);
		},

		setupTable:function(digitValues) {
			this.clearSlideNode();
			this.yPosition = 165;
			var power = 3;
			this.total = "0";
			var previousNumberOfRows = this.numberOfRows;
			this.numberOfRows = 0;
			while (digitValues[power] !== undefined) {
				var digit = digitValues[power];
				if (digit !== 0) {
					this.setupTableRow(digit, power);
				};
				power--;
			};
			if (this.numberOfRows < previousNumberOfRows) {
				var currentYPosition = this.slideNode.getPosition().y;
				var rowCorrector = Math.min(this.numberOfRows, 3);
				this.slideNode.setPosition(0, Math.min(50 * (this.numberOfRows - rowCorrector), currentYPosition));
			};
			this.answerLabel.setString(this.total);
		},

		setupTableRow:function(digit, power) {
			var rowNode = new cc.Node();
			rowNode.setPosition(100,this.yPosition);
			this.slideNode.addChild(rowNode);

			var digitBox = new cc.Sprite();
			digitBox.initWithFile(window.bl.getResource('table_box'));
			rowNode.addChild(digitBox);
			var digitLabel = new cc.LabelTTF.create(digit, "mikadoBold", "24");
			digitLabel.setPosition(digitBox.getAnchorPointInPoints());
			digitBox.addChild(digitLabel);

			var multiply = new cc.Sprite();
			multiply.initWithFile(window.bl.getResource('table_x'));
			multiply.setPosition(75, 0);
			rowNode.addChild(multiply);

			var unitBox = new cc.Sprite();
			unitBox.initWithFile(window.bl.getResource('table_box'))
			unitBox.setPosition(150, 0);
			rowNode.addChild(unitBox);
			var unit = this.numberTimesPowerOfTenString(this.divisor, power);
			var unitLabel = new cc.LabelTTF.create(unit, "mikadoBold", 24);
			unitLabel.setPosition(unitBox.getAnchorPointInPoints());
			unitBox.addChild(unitLabel);

			var equals = new cc.Sprite();
			equals.initWithFile(bl.resources['images_long_division_table_=']);
			equals.setPosition(225, 0);
			rowNode.addChild(equals);

			var resultBox = new cc.Sprite();
			resultBox.initWithFile(window.bl.getResource('table_box'));
			resultBox.setPosition(300, 0);
			rowNode.addChild(resultBox);
			var result = this.numberTimesPowerOfTenString(this.divisor * digit, power);
			var resultLabel = new cc.LabelTTF.create(result, "mikadoBold", 24);
			resultLabel.setPosition(resultBox.getAnchorPointInPoints());
			resultBox.addChild(resultLabel);
			this.total = this.addNumberStrings(this.total, result);

			this.yPosition -= 50;
			this.numberOfRows++;
		},

		scrollUp:function() {
			if (this.slideNode.getPosition().y < 50 * (this.numberOfRows - 3)) {
				this.scroll(true);
			};
		},

		scrollDown:function() {
			if (this.slideNode.getPosition().y > 0) {
				this.scroll(false);
			};
		},

		scroll:function(up) {
			if (!this.scrolling) {
				this.scrolling = true;
				var yChange = up ? 50 : -50;
				var moveAction = cc.MoveBy.create(0.3, cc.p(0, yChange));
				var setScrollingFalse = cc.CallFunc.create(function() {this.scrolling = false}, this);
				var moveAndSet = cc.Sequence.create(moveAction, setScrollingFalse);
				this.slideNode.runAction(moveAndSet);
			};
		},

		numberTimesPowerOfTenString:function(numberOrString, power) {
			var numberString = numberOrString + "";
			var numberStringLength = numberString.length;
			if (power >= 0) {
				for (var i = 0; i < power; i++) {
					numberString += "0";
				};
			} else if (power <= -numberStringLength) {
				for (var i = 0; i < -power - numberStringLength; i++) {
					numberString = "0" + numberString;
				};
				numberString = "0." + numberString;
			} else {
				var breakIndex = numberStringLength + power;
				var beforePoint = numberString.slice(0, breakIndex);
				var afterPoint = numberString.slice(breakIndex);
				numberString = beforePoint + "." + afterPoint;
			};
			numberString = numberString.removeUnnecessaryZerosFromNumberString();
			return numberString;
		},

		addNumberStrings:function(firstString, secondString) {
			var digitsAfterPoints = [];
			var strings = [firstString, secondString];
			var stringArrays = [];
			for (var i = 0; i < strings.length; i++) {
				var string = strings[i];
				if (string.indexOf(".") !== -1) {
					var digitAfterPoint = string.split(".")[1].length;
					digitsAfterPoints.push(digitAfterPoint);
				} else {
					digitsAfterPoints.push(0);
				};
			};
			var powerToRaiseBy = digitsAfterPoints.length > 0 ? Math.max.apply(null, digitsAfterPoints) : 0;
			for (var i = 0; i < strings.length; i++) {
				var stringArray = strings[i].split("");
				var pointIndex = stringArray.indexOf(".");
				if (pointIndex !== -1) {
					stringArray.splice(pointIndex, 1);
				};
				for (var j = 0; j < powerToRaiseBy - digitsAfterPoints[i]; j++) {
					stringArray.push("0");
				};
				stringArrays.push(stringArray);
			};
			var sumArray = this.addDigitArrays(stringArrays[0], stringArrays[1]);
			var sumString = sumArray.join("");
			var sumStringCorrected = this.numberTimesPowerOfTenString(sumString, -powerToRaiseBy);
			return sumStringCorrected
		},

		addDigitArrays:function(firstArray, secondArray) {
			var sumArray = [];
			var maxLength = Math.max(firstArray.length, secondArray.length);
			var arrays = [firstArray, secondArray, sumArray];
			for (var i = 0; i < arrays.length; i++) {
				var array = arrays[i];
				var arrayLength = array.length;
				for (var j = 0; j < arrayLength; j++) {
					array.splice(j, 1, parseInt(array[j]));
				};
				for (var j = 0; j < maxLength - arrayLength + 1; j++) {
					array.splice(0,0,0);
				};
			};
			for (var i = firstArray.length - 1; i >= 1; i--) {
				var totalThisDigit = firstArray[i] + secondArray[i] + sumArray[i];
				sumArray[i] = totalThisDigit % 10;
				sumArray[i-1] = Math.floor(totalThisDigit/10);
			};
			return sumArray;
		},
	});

	return DivisionTable;
})