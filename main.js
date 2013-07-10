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
        'settingslayer': '../../tools/long_division/settings-layer',
	}
});

define(['exports', 'cocos2d', 'toollayer', 'qlayer', 'numberwheel', 'numberpickerbox', 'barsbox', 'magnifiedbarsbox', 'divisiontable', 'settingslayer', 'constants', 'canvasclippingnode'], function(exports, cocos2d, ToolLayer, QLayer, NumberWheel, NumberPickerBox, BarsBox, MagnifiedBarsBox, DivisionTable, SettingsLayer, constants, CanvasClippingNode) {
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

            var questionBox = new cc.Sprite();
            questionBox.initWithFile(bl.resources['images_long_division_question_tray']);
            questionBox.setPosition(size.width/2, 600);
            this.addChild(questionBox);

            var questionLabel = new cc.LabelTTF.create(dividend + " divided by " + divisor, "mikadoBold", 30);
            questionLabel.setPosition(questionBox.getAnchorPointInPoints());
            questionBox.addChild(questionLabel);

            this.numberPickerBox = new NumberPickerBox();
            this.numberPickerBox.layer = this;
            this.numberPickerBox.setPosition(375, 335);
            this.addChild(this.numberPickerBox);

            var barsBoxNode = new cc.Node();
            barsBoxNode.setPosition(size.width/2, 500);
            this.addChild(barsBoxNode);

            this.barsBox = new BarsBox(dividend, divisor);
            this.barsBox.correctDigits = correctDigits;
            this.barsBox.setPosition(0, -22);
            barsBoxNode.addChild(this.barsBox);
            var barsBoundingBox = this.barsBox.getBoundingBox();

            var lowEdgeLabel = new cc.LabelTTF.create("0", "mikadoBold", 24);
            var barsBoxLeftEdge = barsBoundingBox.origin.x;
            lowEdgeLabel.setPosition(barsBoxLeftEdge, 28);
            lowEdgeLabel.setZOrder(-1);
            barsBoxNode.addChild(lowEdgeLabel);

            var highEdgeLabel = new cc.LabelTTF.create(dividend, "mikadoBold", 24);
            var barsBoxRightEdge = barsBoundingBox.origin.x + barsBoundingBox.size.width;
            highEdgeLabel.setPosition(barsBoxRightEdge, 28);
            highEdgeLabel.setZOrder(-1);
            barsBoxNode.addChild(highEdgeLabel);

            this.magnifiedBarsBox = new MagnifiedBarsBox(dividend, divisor);
            this.magnifiedBarsBox.barsBox.correctDigits = correctDigits;
            this.magnifiedBarsBox.setPosition(850, 325);
            this.addChild(this.magnifiedBarsBox);

            this.divisionTable = new DivisionTable(divisor);
            this.divisionTable.setPosition(size.width/2, this.divisionTable.getContentSize().height/2);
            this.divisionTable.setupTable(this.numberPickerBox.digitValues());
            this.addChild(this.divisionTable);

            var settingsButtonBase = new cc.Sprite();
            settingsButtonBase.initWithFile(bl.resources['images_long_division_settings_settings_button_base']);
            settingsButtonBase.setPosition(settingsButtonBase.getContentSize().width/2, 700);
            this.addChild(settingsButtonBase);

            var settingsButtonFilename = bl.resources['images_long_division_settings_settings_button'];
            var settingsButton = new cc.MenuItemImage.create(settingsButtonFilename, settingsButtonFilename, this.moveSettingsOn, this);
            settingsButton.setPosition(70, 42);

            var settingsButtonMenu = new cc.Menu.create(settingsButton);
            settingsButtonMenu.setPosition(0,0);
            settingsButtonBase.addChild(settingsButtonMenu);

            var settingsPage = new SettingsLayer();
            // settingsPage.setPosition(size.width/2, size.height/2);
            settingsPage.setZOrder(100);
            settingsPage.mainLayer = this;
            this.addChild(settingsPage);
            settingsPage.setTouchPriority(-200);


            //settingsPage.removeFromParent();

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