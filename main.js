require.config({
	paths: {
        'toollayer': '../../tools/common/toollayer',
        'numberwheel': '../../tools/longdivision/number-wheel',
        'constants': '../../tools/longdivision/constants',
        'canvasclippingnode': '../../tools/common/canvas-clipping-node',
        'numberpickerbox': '../../tools/longdivision/number-picker-box',
        'numberbox': '../../tools/longdivision/number-box',
        'barsbox': '../../tools/longdivision/bars-box',
        'bar': '../../tools/longdivision/bar',
        'magnifiedbarsbox': '../../tools/longdivision/magnified-bars-box',
        'divisiontable': '../../tools/longdivision/division-table',
        'tooltip': '../../tools/common/tool-tip',
        'longdivisionsettingslayer': '../../tools/longdivision/long-division-settings-layer',
        'buttonsprite' :'../../tools/common/button-sprite'
	}
});

define(['exports', 'cocos2d', 'toollayer', 'qlayer', 'numberwheel', 'numberpickerbox', 'barsbox', 'magnifiedbarsbox', 'divisiontable', 'longdivisionsettingslayer', 'constants', 'canvasclippingnode'], function(exports, cocos2d, ToolLayer, QLayer, NumberWheel, NumberPickerBox, BarsBox, MagnifiedBarsBox, DivisionTable, LongDivisionSettingsLayer, constants, CanvasClippingNode) {
	'use strict';

    window.bl.toolTag = 'longdivision';

    var NumberPickerLabels = constants['NumberPickerLabels'];

	var Tool = ToolLayer.extend({

		init:function() {

			this._super();

			this.setTouchEnabled(true);

            this.size = cc.Director.getInstance().getWinSize();
            var size = this.size;

            this.dividend = 10;
            this.divisor = 4;

            this.labelType = NumberPickerLabels.NUMBERS;

            var clc = cc.Layer.create();
            var background = new cc.Sprite();
            background.initWithFile(window.bl.getResource('deep_water_background'));
            background.setPosition(size.width/2, size.height/2);
            clc.addChild(background);
            this.addChild(clc,0);

            var title = new cc.Sprite();
            title.initWithFile(window.bl.getResource('title_longdivision'));
            title.setPosition(size.width/2, 700);
            this.addChild(title);

            this.questionBox = new cc.Sprite();
            this.questionBox.initWithFile(window.bl.getResource('question_tray'));
            this.questionBox.setPosition(size.width/2, 600);
            this.addChild(this.questionBox);

            this.tableNode = new cc.Node();
            this.addChild(this.tableNode);

            this.setupWithNumbers(this.dividend, this.divisor);

            var clearButtonFilename = window.bl.getResource('reset_button');
            var clearButton = new cc.MenuItemImage.create(clearButtonFilename, clearButtonFilename, this.reset, this);
            clearButton.setPosition(460, 310);

            var clearButtonMenu = new cc.Menu.create(clearButton);
            this.addChild(clearButtonMenu);

            this.settingsLayer = new LongDivisionSettingsLayer();

            this.addChild(this.settingsLayer);
            this.settingsLayer.mainLayer = this;
            this.settingsLayer.setNumbers(this.dividend, this.divisor);
            this.settingsLayer.setZOrder(100);

            return this;
		},

        setupWithNumbers:function(dividend, divisor) {
            this.dividend = dividend;
            this.divisor = divisor;

            this.correctDigits = this.calculateCorrectDigits(dividend, divisor);

            this.questionLabel = new cc.LabelTTF.create(dividend + " divided by " + divisor, "mikadoBold", 30);
            this.questionLabel.setPosition(this.questionBox.getAnchorPointInPoints());
            this.questionBox.addChild(this.questionLabel);

            this.numberPickerBoxNode = new cc.Node();
            this.numberPickerBoxNode.setPosition(512, 440);
            this.addChild(this.numberPickerBoxNode);

            this.numberPickerBox = new NumberPickerBox();
            this.numberPickerBox.layer = this;
            this.numberPickerBoxNode.addChild(this.numberPickerBox);
            this.numberPickerBox.setLabelType(this.labelType);

            this.barsBoxNode = new cc.Node();
            this.barsBoxNode.setPosition(this.size.width/2, 260);
            this.addChild(this.barsBoxNode);

            this.barsBox = new BarsBox(dividend, divisor);
            this.barsBox.layer = this;
            this.barsBoxNode.addChild(this.barsBox);
            var barsBoundingBox = this.barsBox.getBoundingBox();

            var lowEdgeLabel = new cc.LabelTTF.create("0", "mikadoBold", 24);
            var barsBoxLeftEdge = barsBoundingBox.origin.x;
            lowEdgeLabel.setPosition(barsBoxLeftEdge, 50);
            lowEdgeLabel.setZOrder(-1);
            this.barsBoxNode.addChild(lowEdgeLabel);

            var highEdgeLabel = new cc.LabelTTF.create(dividend, "mikadoBold", 24);
            var barsBoxRightEdge = barsBoundingBox.origin.x + barsBoundingBox.size.width;
            highEdgeLabel.setPosition(barsBoxRightEdge, 50);
            highEdgeLabel.setZOrder(-1);
            this.barsBoxNode.addChild(highEdgeLabel);

            this.magnifiedBarsBox = new MagnifiedBarsBox(dividend, divisor);
            this.magnifiedBarsBox.barsBox.layer = this;
            this.magnifiedBarsBox.setPosition(880, 110);
            this.addChild(this.magnifiedBarsBox);
            // this.magnifiedBarsBox.setVisible(false);

            this.divisionTable = new DivisionTable(divisor);
            this.divisionTable.setPosition(0, 0);
            this.divisionTable.setupTable(this.numberPickerBox.digitValues());
            this.tableNode.addChild(this.divisionTable);
            if (this.dividend === 0) {
                this.divisionTable.setAnswerCorrect(true);
            };
        },

        reset:function() {
            this.resetWithNumbers(this.dividend, this.divisor);
        },

        resetWithNumbers:function(dividend, divisor) {
            this.clearEverything();
            this.setupWithNumbers(dividend, divisor);
        },

        clearEverything:function() {
            this.questionLabel.removeFromParent();
            this.numberPickerBox.removeFromParent();
            this.barsBoxNode.removeFromParent();
            this.magnifiedBarsBox.removeFromParent();
            this.divisionTable.removeFromParent();
            this.numberPickerBoxNode.removeFromParent();
        },

        onTouchesBegan:function(touches, event) {
            var touchLocation = this.convertTouchToNodeSpace(touches[0]);

            this.numberPickerBox.processTouch(touchLocation);
            //this.testLabel.setString(JSON.stringify(this.numberPickerBox.valueString()));

        },

        onTouchesEnded:function(touches, event) {
            this.numberPickerBox.processEnd();
        },

        processDigitChange:function() {
            var digitValues = this.numberPickerBox.digitValues();
            this.barsBox.setBars(digitValues);
            this.magnifiedBarsBox.setBars(digitValues);
            this.divisionTable.setupTable(digitValues);
            this.divisionTable.setAnswerCorrect(this.correctDigitsSelected(digitValues));
        },

        correctDigitsSelected:function(digitValues) {
            return this.compareDigitsWithAnswer(digitValues) === 0;
        },

        isTooBig:function(digitValues) {
            return this.compareDigitsWithAnswer(digitValues) === 1;
        },

        compareDigitsWithAnswer:function(digitValues) {
            var digitsBeforePoint = this.correctDigits[0];
            var numberOfDigits = digitsBeforePoint.length;
            if (numberOfDigits > 4) {
                return -1;
            };
            for (var i = 0; i < 4 - numberOfDigits; i++) {
                digitsBeforePoint.splice(0, 0, 0);
            };
            for (var i = digitsBeforePoint.length - 1; i >= 0; i--) {
                var enteredDigit = digitValues[i];
                var correctDigit = digitsBeforePoint[3 - i];
                if (enteredDigit > correctDigit) {
                    return 1;
                } else if (enteredDigit < correctDigit) {
                    return -1;
                };
            };
            var index = 0;
            var nonRecurringDigits = this.correctDigits[1];
            var recurringDigits = this.correctDigits[2];
            while (true) {
                if (digitValues[-index-1] === undefined) {
                    if (recurringDigits.length > 1 || recurringDigits[0] !== 0) {
                        return -1;
                    } else {
                        return 0;
                    };

                };
                var enteredDigit = digitValues[-index-1];
                var correctDigit = null;
                if (index < nonRecurringDigits.length) {
                    correctDigit = nonRecurringDigits[index];
                } else {
                    correctDigit = recurringDigits[(index - nonRecurringDigits.length) % recurringDigits.length];
                };
                if (enteredDigit > correctDigit) {
                    return 1;
                } else if (enteredDigit < correctDigit) {
                    return -1;
                };
                index++;
            };
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

        setTableVisible:function(visible) {
            this.tableNode.setVisible(visible);
        },



        setLabelType:function(type) {
            this.labelType = type;
            this.numberPickerBox.setLabelType(type);
        },

	});

	exports.ToolLayer = Tool;
});