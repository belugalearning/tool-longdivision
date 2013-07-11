define(['numberwheel'], function(NumberWheel) {
	'use strict';

	var SettingsLayer = cc.Layer.extend({
		ctor:function() {
			this._super();

			this.setTouchEnabled(true);

			var size = cc.Director.getInstance().getWinSize();

			var background = new cc.Sprite();
			background.initWithFile(bl.resources['images_long_division_settings_free_form_bg']);
			background.setPosition(size.width/2, size.height/2);
			this.addChild(background);

			var dividendLabel = new cc.LabelTTF.create("Dividend:", "mikadoBold", 34);
			dividendLabel.setPosition(125, 575);
			background.addChild(dividendLabel);

			this.dividendWheel = new NumberWheel(4);
			this.dividendWheel.setPosition(375, 575);
			background.addChild(this.dividendWheel);

			var divisorLabel = new cc.LabelTTF.create("Divisor:", "mikadoBold", 34);
			divisorLabel.setPosition(125, 250);
			background.addChild(divisorLabel);

			this.divisorWheel = new NumberWheel(4);
			this.divisorWheel.setPosition(375, 250);
			background.addChild(this.divisorWheel);

			var tableLabel = new cc.LabelTTF.create("Table:", "mikadoBold", 34);
			tableLabel.setPosition(700, 400);
			background.addChild(tableLabel);

			this.tableButton = new cc.Sprite();
			this.tableButton.initWithFile(bl.resources['images_clock_settings_digital_button_on']);
            this.tableButton.setPosition(700, 350);
            background.addChild(this.tableButton);

            this.tableVisible = true;

            this.closeButton = new cc.Sprite();
            this.closeButton.initWithFile(bl.resources['images_long_division_settings_free_form_closebutton']);
            this.closeButton.setPosition(960, 710);
            background.addChild(this.closeButton);

		},

		registerWithTouchDispatcher:function() {
            cc.Director.getInstance().getTouchDispatcher().addTargetedDelegate(this, this._touchPriority, true);
		},

		onTouchBegan:function(touch, event) {
			var touchLocation = this.convertTouchToNodeSpace(touch);
			this.dividendWheel.processTouch(touchLocation);
			this.divisorWheel.processTouch(touchLocation);
			if (this.tableButton.touched(touchLocation)) {
				this.toggleTable();
			};
			if (this.closeButton.touched(touchLocation)) {
				this.processCloseSettings();
			};
			return true;
		},

		toggleTable:function() {
			this.tableVisible = !this.tableVisible;
			var filename = this.tableVisible ? bl.resources['images_clock_settings_digital_button_on'] : bl.resources['images_clock_settings_digital_button_off'];
			this.tableButton.setTextureWithFilename(filename);
			this.mainLayer.setTableVisible(this.tableVisible);
		},

		processCloseSettings:function() {
			var dividend = this.dividendWheel.value();
			var divisor = this.divisorWheel.value();
			this.mainLayer.setupWithNumbers(dividend, divisor);
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