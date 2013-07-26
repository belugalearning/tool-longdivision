define(['numberwheel', 'settingslayer', 'buttonsprite', 'constants'], function(NumberWheel, SettingsLayer, ButtonSprite, constants) {
	'use strict';

	var NumberPickerLabels = constants['NumberPickerLabels'];

	var LongDivisionSettingsLayer = SettingsLayer.extend({
		
		backgroundFilename:'long_div_settings_bg',
		settingsButtonPosition:cc.p(56, 700),

		ctor:function() {
			this._super();

			this.setTouchEnabled(true);

			var size = this.size;

			var dividendLabel = new cc.LabelTTF.create("Dividend", "mikadoBold", 34);
			dividendLabel.setPosition(300, 675);
			this.background.addChild(dividendLabel);

			this.dividendWheel = new NumberWheel(4);
			this.dividendWheel.setPosition(300, 500);
			this.background.addChild(this.dividendWheel);

			var divisorLabel = new cc.LabelTTF.create("Divisor", "mikadoBold", 34);
			divisorLabel.setPosition(750, 675);
			this.background.addChild(divisorLabel);

			this.divisorWheel = new NumberWheel(4);
			this.divisorWheel.setPosition(750, 500);
			this.background.addChild(this.divisorWheel);

			this.tableButton = new ButtonSprite();
			this.tableButton.initWithFile(window.bl.getResource('settings_table_on'));
            this.tableButton.setPosition(size.width/2, 125);
            this.tableButton.pressFunction = this.toggleTable;
            this.tableButton.target = this;
            this.background.addChild(this.tableButton);

            this.tableVisible = true;

            this.wordsButton = new ButtonSprite();
            this.wordsButton.initWithFile(window.bl.getResource('settings_label_off'));
            this.wordsButton.setPosition(290, 225);
            this.wordsButton.pressFunction = this.wordsVisible;
            this.wordsButton.target = this;
            this.background.addChild(this.wordsButton);

            this.powersButton = new ButtonSprite();
            this.powersButton.initWithFile(window.bl.getResource('settings_powers_off'));
            this.powersButton.setPosition(500, 225);
            this.powersButton.pressFunction = this.powersVisible;
            this.powersButton.target = this;
            this.background.addChild(this.powersButton);

            this.numbersButton = new ButtonSprite();
            this.numbersButton.initWithFile(window.bl.getResource('settings_numbers_on'));
            this.numbersButton.setPosition(710, 225);
            this.numbersButton.pressFunction = this.numbersVisible;
            this.numbersButton.target = this;
            this.background.addChild(this.numbersButton);

            this.touchProcessors = this.touchProcessors.concat([this.dividendWheel, this.divisorWheel, this.tableButton, this.wordsButton, this.powersButton, this.numbersButton]);
		},

		registerWithTouchDispatcher:function() {
            cc.Director.getInstance().getTouchDispatcher().addTargetedDelegate(this, this._touchPriority, true);
		},

		toggleTable:function() {
			this.tableVisible = !this.tableVisible;
			var filename = this.tableVisible ? window.bl.getResource('settings_table_on') : window.bl.getResource('settings_table_off');
			this.tableButton.setTextureWithFilename(filename);
			this.mainLayer.setTableVisible(this.tableVisible);
		},

		processCloseSettings:function() {
			var dividend = this.dividendWheel.value();
			var divisor = this.divisorWheel.value();
			if (divisor === 0) {
				this.dividendWheel.freakOut();
				this.divisorWheel.freakOut();
				this.freakOut();
			} else {
				if (dividend !== this.dividend || divisor !== this.divisor) {
					this.dividend = dividend;
					this.divisor = divisor;
					this.mainLayer.resetWithNumbers(dividend, divisor);
				};
				this._super();
			};
		},

		setNumbers:function(dividend, divisor) {
			this.dividend = dividend;
			this.divisor = divisor;
			this.setWheelNumbers();
		},	

		setWheelNumbers:function() {
			this.dividendWheel.setNumber(this.dividend);
			this.divisorWheel.setNumber(this.divisor);
		},

		wordsVisible:function() {
			this.setLabelType(NumberPickerLabels.WORDS);
		},

		powersVisible:function() {
			this.setLabelType(NumberPickerLabels.POWERS);
		},

		numbersVisible:function() {
			this.setLabelType(NumberPickerLabels.NUMBERS);
		},

		setLabelType:function(type) {
			this.mainLayer.setLabelType(type);
			this.wordsButton.setTextureWithFilename(window.bl.getResource('settings_label_off'));
			this.powersButton.setTextureWithFilename(window.bl.getResource('settings_powers_off'));
			this.numbersButton.setTextureWithFilename(window.bl.getResource('settings_numbers_off'));
			switch (type) {
				case NumberPickerLabels.WORDS:
					this.wordsButton.setTextureWithFilename(window.bl.getResource('settings_label_on'));
					break;
				case NumberPickerLabels.POWERS:
					this.powersButton.setTextureWithFilename(window.bl.getResource('settings_powers_on'));
					break;
				case NumberPickerLabels.NUMBERS:
					this.numbersButton.setTextureWithFilename(window.bl.getResource('settings_numbers_on'));
					break;
			}
		},
	});

	return LongDivisionSettingsLayer;
})