define(['numberwheel', 'constants'], function(NumberWheel, constants) {
	'use strict';

	var NumberPickerLabels = constants['NumberPickerLabels'];

	var SettingsLayer = cc.Layer.extend({
		ctor:function() {
			this._super();

			this.setTouchEnabled(true);

			this.active = false;

			var size = cc.Director.getInstance().getWinSize();
			this.size = size;

			var background = new cc.Sprite();
			this.background = background;
			background.initWithFile(bl.resources['images_long_division_settings_long_div_settings_bg']);
			background.setPosition(size.width/2, size.height/2);
			this.addChild(background);

			var dividendLabel = new cc.LabelTTF.create("Dividend", "mikadoBold", 34);
			dividendLabel.setPosition(300, 675);
			background.addChild(dividendLabel);

			this.dividendWheel = new NumberWheel(4);
			this.dividendWheel.setPosition(300, 500);
			background.addChild(this.dividendWheel);

			var divisorLabel = new cc.LabelTTF.create("Divisor", "mikadoBold", 34);
			divisorLabel.setPosition(750, 675);
			background.addChild(divisorLabel);

			this.divisorWheel = new NumberWheel(4);
			this.divisorWheel.setPosition(750, 500);
			background.addChild(this.divisorWheel);

			this.tableButton = new cc.Sprite();
			this.tableButton.initWithFile(bl.resources['images_long_division_settings_table_on']);
            this.tableButton.setPosition(size.width/2, 125);
            this.tableButton.processTouch = this.toggleTable;
            background.addChild(this.tableButton);

            this.tableVisible = true;

            this.closeButton = new cc.Sprite();
            this.closeButton.initWithFile(bl.resources['images_long_division_settings_free_form_closebutton']);
            this.closeButton.setPosition(960, 710);
            this.closeButton.processTouch = this.processCloseSettings;
            background.addChild(this.closeButton);

            this.wordsButton = new cc.Sprite();
            this.wordsButton.initWithFile(bl.resources['images_long_division_settings_label_off']);
            this.wordsButton.setPosition(290, 225);
            this.wordsButton.processTouch = this.wordsVisible;
            background.addChild(this.wordsButton);

            this.powersButton = new cc.Sprite();
            this.powersButton.initWithFile(bl.resources['images_long_division_settings_powers_off']);
            this.powersButton.setPosition(500, 225);
            this.powersButton.processTouch = this.powersVisible;
            background.addChild(this.powersButton);

            this.numbersButton = new cc.Sprite();
            this.numbersButton.initWithFile(bl.resources['images_long_division_settings_numbers_on']);
            this.numbersButton.setPosition(710, 225);
            this.numbersButton.processTouch = this.numbersVisible;
            background.addChild(this.numbersButton);

            this.buttons = [this.tableButton, this.closeButton, this.wordsButton, this.powersButton, this.numbersButton];
		},

		registerWithTouchDispatcher:function() {
            cc.Director.getInstance().getTouchDispatcher().addTargetedDelegate(this, this._touchPriority, true);
		},

		onTouchBegan:function(touch, event) {
			if (this.active) {
				var touchLocation = this.convertTouchToNodeSpace(touch);
				this.dividendWheel.processTouch(touchLocation);
				this.divisorWheel.processTouch(touchLocation);
				for (var i = 0; i < this.buttons.length; i++) {
					var button = this.buttons[i];
					if (button.touched(touchLocation)) {
						button.processTouch.call(this);
					};
				};
			};
			return this.active;
		},

		toggleTable:function() {
			this.tableVisible = !this.tableVisible;
			var filename = this.tableVisible ? bl.resources['images_long_division_settings_table_on'] : bl.resources['images_long_division_settings_table_off'];
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
				this.mainLayer.moveSettingsOff();
			};
		},

		freakOut:function() {
			this.freakOutsRemaining = 100;
			this.oneRandom();
		},

		oneRandom:function() {
			if (!this.moving) {			
				if (this.freakOutsRemaining > 0) {
					var randomX = Math.floor(Math.random() * 10 - 5);
					var randomY = Math.floor(Math.random() * 10 - 5);
					var action = cc.MoveTo.create(0.01, cc.p(this.size.width/2 + randomX, this.size.height/2 + randomY));
					this.background.runAction(action);
					var that = this;
					var timeOut = setTimeout(function() {that.oneRandom()}, 50);
					this.freakOutsRemaining--;
				};
			}
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
			this.wordsButton.setTextureWithFilename(bl.resources['images_long_division_settings_label_off']);
			this.powersButton.setTextureWithFilename(bl.resources['images_long_division_settings_powers_off']);
			this.numbersButton.setTextureWithFilename(bl.resources['images_long_division_settings_numbers_off']);
			switch (type) {
				case NumberPickerLabels.WORDS:
					this.wordsButton.setTextureWithFilename(bl.resources['images_long_division_settings_label_on']);
					break;
				case NumberPickerLabels.POWERS:
					this.powersButton.setTextureWithFilename(bl.resources['images_long_division_settings_powers_on']);
					break;
				case NumberPickerLabels.NUMBERS:
					this.numbersButton.setTextureWithFilename(bl.resources['images_long_division_settings_numbers_on']);
					break;
			}
		},
	});

	return SettingsLayer;
})

/*setupSettingsPage:function() {
            var settingsBackground = new cc.Sprite();
            settingsBackground.initWithFile(bl.resources['images_long_division_settings_free_form_bg']);
            settingsBackground.setPosition(this.size.width/2, this.size.height/2);
            this.addChild(settingsBackground);

            var dividendLabel = new cc.LabelTTF.create("Dividend:", "mikadoBold", 34);
            dividendLabel.setPosition(125, 575);
            settingsBackground.addChild(dividendLabel);

            this.dividendNumberWheel = new NumberWheel(4);
            this.dividendNumberWheel.setPosition(375, 575);
            settingsBackground.addChild(this.dividendNumberWheel);

            var divisorLabel = new cc.LabelTTF.create("Divisor:", "mikadoBold", 34);
            divisorLabel.setPosition(125, 250);
            settingsBackground.addChild(divisorLabel);

            this.divisorNumberWheel = new NumberWheel(4);
            this.divisorNumberWheel.setPosition(375, 250);
            settingsBackground.addChild(this.divisorNumberWheel);

            var tableLabel = new cc.LabelTTF.create("Table:", "mikadoBold", 34);
            tableLabel.setPosition(700, 400);
            settingsBackground.addChild(tableLabel);

            
        },*/