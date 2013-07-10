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

		},

		onEnter:function() {
			this._super();
		},

		registerWithTouchDispatcher:function() {
            cc.Director.getInstance().getTouchDispatcher().addTargetedDelegate(this, this._touchPriority, true);
		},

		onTouchBegan:function(touch, event) {
			var touchLocation = this.convertTouchToNodeSpace(touch);
			this.dividendWheel.processTouch(touchLocation);
			this.divisorWheel.processTouch(touchLocation);
			return true;
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

            var tableOn = new cc.MenuItemFont.create("On", this.tableOn, this);
            tableOn.setPosition(700, 350);

            var tableOff = new cc.MenuItemFont.create("Off", this.tableOff, this);
            tableOff.setPosition(700, 300);

            var tableMenu = new cc.Menu.create(tableOn, tableOff);
            tableMenu.setPosition(0,0);
            settingsBackground.addChild(tableMenu);
        },*/