require.config({
	paths: {
        'toollayer': '../../tools/common/toollayer',
        'numberwheel': '../../tools/long_division/number-wheel',
        'constants': '../../tools/long_division/constants',
        'canvasclippingnode': '../../tools/long_division/canvas-clipping-node',
        'numberpickerbox': '../../tools/long_division/number-picker-box',
        'numberbox': '../../tools/long_division/number-box',
        'barsbox': '../../tools/long_division/bars-box',
        'bar': '../../tools/long_division/bar',
        'magnifiedbarsbox': '../../tools/long_division/magnified-bars-box',
        'divisiontable': '../../tools/long_division/division-table',
	}
});

define(['exports', 'cocos2d', 'toollayer', 'qlayer', 'numberwheel', 'numberpickerbox', 'barsbox', 'magnifiedbarsbox', 'divisiontable', 'constants', 'canvasclippingnode'], function(exports, cocos2d, ToolLayer, QLayer, NumberWheel, NumberPickerBox, BarsBox, MagnifiedBarsBox, DivisionTable, constants, CanvasClippingNode) {
	'use strict';

	var Tool = ToolLayer.extend({

		init:function() {

			this._super();

			this.setTouchEnabled(true);

            var dividend = 22;
            var divisor = 7;
            var correctDigits = this.calculateCorrectDigits(dividend, divisor);

            this.size = cc.Director.getInstance().getWinSize();
            var size = this.size;

            var clc = cc.Layer.create();
            var background = new cc.Sprite();
            background.initWithFile(bl.resources['images_deep_water_background']);
            background.setPosition(size.width/2, size.height/2);
            clc.addChild(background);
            this.addChild(clc,0);

            var title = new cc.Sprite();
            title.initWithFile(bl.resources['images_long_division_title_longdivision']);
            title.setPosition(size.width/2, 700);
            this.addChild(title);

            var questionLabel = new cc.LabelTTF.create(dividend + " divided by " + divisor, "mikadoBold", 30);
            questionLabel.setPosition(size.width/2, 625);
            this.addChild(questionLabel);

            this.numberPickerBox = new NumberPickerBox();
            this.numberPickerBox.layer = this;
            this.numberPickerBox.setPosition(375, 400);
            this.addChild(this.numberPickerBox);

            this.barsBox = new BarsBox(dividend, divisor);
            this.barsBox.correctDigits = correctDigits;
            this.barsBox.setPosition(size.width/2, 575);
            this.addChild(this.barsBox);

            this.magnifiedBarsBox = new MagnifiedBarsBox(dividend, divisor);
            this.magnifiedBarsBox.barsBox.correctDigits = correctDigits;
            this.magnifiedBarsBox.setPosition(850, 390);
            this.addChild(this.magnifiedBarsBox);

            this.divisionTable = new DivisionTable(divisor);
            this.divisionTable.setPosition(size.width/2, this.divisionTable.getContentSize().height/2);
            this.divisionTable.setupTable(this.numberPickerBox.digitValues());
            this.addChild(this.divisionTable);

/*            this.testLabel = new cc.LabelTTF.create("HELLO", "mikadoBold", 24);
            this.testLabel.setPosition(size.width/2, 200);
            this.addChild(this.testLabel);
*/
            return this;
		},

        onTouchesBegan:function(touches, event) {
            var touchLocation = this.convertTouchToNodeSpace(touches[0]);
            //this.testLabel.setString(JSON.stringify(this.numberPickerBox.valueString()));
        },

        processDigitChange:function() {
            var digitValues = this.numberPickerBox.digitValues();
            this.barsBox.setBars(digitValues);
            this.magnifiedBarsBox.setBars(digitValues);
            this.divisionTable.setupTable(digitValues);
        },

        calculateCorrectDigits:function(dividend, divisor) {
            var digitsBeforePoint = [];
            var digitsAfterPoint = [];
            var dividendString = dividend + "";
            var remainder = 0;
            while (dividendString !== "") {
                remainder = 10 * remainder + parseInt(dividendString[0]);
                var digit = Math.floor(remainder/divisor);
                remainder %= divisor;
                digitsBeforePoint.push(digit);
                dividendString = dividendString.slice(1);
            }
            digitsAfterPoint = this.calculateCorrectDigitsAfterPoint(remainder, divisor);
            return [digitsBeforePoint, digitsAfterPoint[0], digitsAfterPoint[1]];
        },

        calculateCorrectDigitsAfterPoint:function(dividend, divisor) {
            var nonRecurringDigits = [];
            var recurringDigits = [];
            var remainders = [];
            var remainder = dividend;
            while (true) {
                var index = remainders.indexOf(remainder);
                if (index === -1) {
                    remainders.push(remainder);
                    remainder *= 10;
                    nonRecurringDigits.push(Math.floor(remainder/divisor));
                    remainder %= divisor;
                } else {
                    recurringDigits = nonRecurringDigits.slice(index);
                    nonRecurringDigits = nonRecurringDigits.slice(0, index);
                    break;
                };
            }
            return [nonRecurringDigits, recurringDigits];
        },

	});

	exports.ToolLayer = Tool;
});