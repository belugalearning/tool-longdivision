define(['canvasclippingnode', 'constants'], function(CanvasClippingNode, constants) {
	'use strict';

	var DivisionTable = cc.Node.extend({
		ctor:function(divisor) {
			this._super();
			this.divisor = divisor;
			this.scrolling = false;
			this.rows = [];
			var clippingNode = new CanvasClippingNode();
			clippingNode.setPosition(40, 0);
			clippingNode.drawPathToClip = function() {
				this.ctx.rect(0, -203, 600, 203);
			};
			this.addChild(clippingNode);
			this.slideNode = new cc.Node();
			clippingNode.addChild(this.slideNode);
			// this.addChild(this.slideNode);
			var upButtonFilename = window.bl.getResource('table_up_arrow');
			var upButton = new cc.MenuItemImage.create(upButtonFilename, upButtonFilename, this.scrollDown, this);
			upButton.setPosition(0, 55);
			var downButtonFilename = window.bl.getResource('table_down_arrow');
			var downButton = new cc.MenuItemImage.create(downButtonFilename, downButtonFilename, this.scrollUp, this);
			downButton.setPosition(0, -55);
			this.upDownMenu = new cc.Menu.create(upButton, downButton);
			this.upDownMenu.setPosition(40, 90);
			this.addChild(this.upDownMenu);
			this.upDownMenu.setVisible(false);

			var answerBox = new cc.Sprite();
			answerBox.initWithFile(window.bl.getResource('table_answerbox'));
			answerBox.setPosition(630, 150);
			this.addChild(answerBox);
			this.answerLabel = new cc.LabelTTF.create("", "mikadoBold", 34);
			this.answerLabel.setPosition(answerBox.getAnchorPointInPoints());
			var boxSize = answerBox.getBoundingBox().size;
			this.answerLabel.boundary = cc.SizeMake(boxSize.width - 20, boxSize.height);
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
			var previousNumberOfRows = this.rows.length;
			this.rows = [];
			while (digitValues[power] !== undefined) {
				var digit = digitValues[power];
				if (digit !== 0) {
					this.setupTableRow(digit, power);
				};
				power--;
			};
			var numberOfRows = this.rows.length;
			if (numberOfRows < previousNumberOfRows) {
				var currentYPosition = this.slideNode.getPosition().y;
				var rowCorrector = Math.min(numberOfRows, 3);
				this.slideNode.setPosition(0, Math.min(50 * (numberOfRows - rowCorrector), currentYPosition));
			};
			if (numberOfRows < 4) {
				this.upDownMenu.setVisible(false);
			} else {
				this.upDownMenu.setVisible(true);
			};
			this.setVisibleRows();
			this.answerLabel.setStringAutoFontSize(this.total, 100, 0.1);
		},

		setupTableRow:function(digit, power) {
			var rowNode = new cc.Node();
			rowNode.setPosition(100,this.yPosition);
			this.slideNode.addChild(rowNode);

			var color = constants['colors'].indexWraparound(power);

			var digitBox = new cc.Sprite();
			digitBox.initWithFile(window.bl.getResource('table_box'));
			digitBox.setPosition(150, 0);
			rowNode.addChild(digitBox);
			var digitPower = this.numberTimesPowerOfTenString(digit, power);
			var digitLabel = new cc.LabelTTF.create("", "mikadoBold", "100");
			digitLabel.setColor(color);
			digitLabel.setPosition(digitBox.getAnchorPointInPoints());
			var digitBoxSize = digitBox.getBoundingBox().size;
			digitLabel.boundary = cc.SizeMake(digitBoxSize.width - 6, digitBoxSize.height);
			digitLabel.setStringAutoFontSize(digitPower, 100, 0.1);
			digitBox.addChild(digitLabel);

			var multiply = new cc.Sprite();
			multiply.initWithFile(window.bl.getResource('table_x'));
			multiply.setPosition(75, 0);
			rowNode.addChild(multiply);

			var unitBox = new cc.Sprite();
			unitBox.initWithFile(window.bl.getResource('table_box'))
			// unitBox.setPosition(150, 0);
			rowNode.addChild(unitBox);
			var unit = this.divisor;
			// var unit = this.numberTimesPowerOfTenString(this.divisor, power);
			// var unit = this.numberTimesPowerOfTenString(this.divisor, power);
			var unitLabel = new cc.LabelTTF.create("", "mikadoBold", 100);
			unitLabel.setColor(color);
			var unitBoxSize = unitBox.getBoundingBox().size;
			unitLabel.boundary = cc.SizeMake(unitBoxSize.width - 6, unitBoxSize.height);
			unitLabel.setStringAutoFontSize(unit, 100, 0.1);
			unitLabel.setPosition(unitBox.getAnchorPointInPoints());
			unitBox.addChild(unitLabel);

			var equals = new cc.Sprite();
			equals.initWithFile(bl.getResource('table_='));
			equals.setPosition(225, 0);
			rowNode.addChild(equals);

			var resultBox = new cc.Sprite();
			resultBox.initWithFile(window.bl.getResource('table_box'));
			resultBox.setPosition(300, 0);
			rowNode.addChild(resultBox);
			var result = this.numberTimesPowerOfTenString(this.divisor * digit, power);
			var resultLabel = new cc.LabelTTF.create("", "mikadoBold", 100);
			resultLabel.setColor(color);
			var resultBoxSize = resultBox.getBoundingBox().size;
			resultLabel.boundary = cc.SizeMake(resultBoxSize.width - 6, resultBoxSize.height);
			resultLabel.setStringAutoFontSize(result, 100, 0.1);
			resultLabel.setPosition(resultBox.getAnchorPointInPoints());
			resultBox.addChild(resultLabel);
			this.total = this.addNumberStrings(this.total, result);

			this.yPosition -= 50;
			this.rows.push(rowNode);
		},

		scrollUp:function() {
			if (this.slideNode.getPosition().y < 50 * (this.rows.length - 3)) {
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
				this.setVisibleRows();
			};
		},

		setVisibleRows:function() {
			var slideNodeY = this.slideNode.getPosition().y;
			for (var i = 0; i < this.rows.length; i++) {
				var row = this.rows[i];
				var rowHeight = slideNodeY + row.getPosition().y;
				if (rowHeight > -100 && rowHeight < 300) {
					row.setVisible(true);
				} else {
					row.setVisible(false);
				};
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

		setAnswerCorrect:function(correct) {
			var color = correct ? cc.c3b(0,255,0) : cc.c3b(255, 255, 255);
			this.answerLabel.setColor(color);
		},
	});

	return DivisionTable;
})