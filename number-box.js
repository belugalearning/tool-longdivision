define([], function() {
	'use strict';

	var NumberBox = cc.Node.extend({
		digit:0,
		power:null,
		digitLabel:null,
		upDownMenu:null,
		numberPickerBox:null,

		ctor:function() {
			this._super();

			var background = new cc.Sprite();
			background.initWithFile(window.bl.getResource('numberpicker_number_bg'));
			background.setPosition(0, 20);
			this.addChild(background);

			this.upDownMenu = new cc.Menu.create();
			this.upDownMenu.setPosition(0,0);
			this.addChild(this.upDownMenu);

			var upButtonFilename = window.bl.getResource('digitchangehitzone');
            var upButton = new cc.MenuItemImage.create(upButtonFilename, upButtonFilename, this.digitUp, this);
            upButton.setPosition(0, 50);
            this.upDownMenu.addChild(upButton);
            var upSprite = new cc.Sprite();
            upSprite.initWithFile(window.bl.getResource('numberpicker_up_arrow'));
            upSprite.setPosition(upButton.getAnchorPointInPoints());
            upButton.addChild(upSprite);

            var downButtonFilename = window.bl.getResource('digitchangehitzone');
            var downButton = new cc.MenuItemImage.create(downButtonFilename, downButtonFilename, this.digitDown, this);
            downButton.setPosition(0, -58);
            this.upDownMenu.addChild(downButton);
            var downSprite = new cc.Sprite();
            downSprite.initWithFile(window.bl.getResource('numberpicker_down_arrow'));
            downSprite.setPosition(downButton.getAnchorPointInPoints());
            downButton.addChild(downSprite);

            this.digitLabel = new cc.LabelTTF.create(this.digit, "mikadoBold", 70);
            this.digitLabel.setPosition(cc.pAdd(this.getAnchorPointInPoints(), cc.p(-3,1)));
            this.addChild(this.digitLabel);
		},

		digitUp:function() {
			this.digit++;
			this.processDigitChange();
		},

		digitDown:function() {
			this.digit--;
			this.processDigitChange();
		},

		processDigitChange:function() {
			this.digit = this.digit.numberInCorrectRange(0, 10);
			this.digitLabel.setString(this.digit);
			this.numberPickerBox.processDigitChange();
		},

		boxVisible:function(visible) {
			this.setVisible(visible);
		},

		boxEnabled:function(enabled) {
			this.upDownMenu.setEnabled(enabled);
		},

		setDigitColor:function(color) {
			this.digitLabel.setColor(color);
		},
	});

	return NumberBox;
})