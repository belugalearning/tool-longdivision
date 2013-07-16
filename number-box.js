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
			var numberContainer = new cc.Sprite();
			numberContainer.initWithFile(window.bl.getResource('numberbox'));
			this.addChild(numberContainer);

			this.upDownMenu = new cc.Menu.create();
			this.upDownMenu.setPosition(0,0);
			this.addChild(this.upDownMenu);

			var upButtonFilename = window.bl.getResource('numberpicker_up_arrow');
            var upButton = new cc.MenuItemImage.create(upButtonFilename, upButtonFilename, this.digitUp, this);
            upButton.setPosition(0, 50);
            this.upDownMenu.addChild(upButton);

            var downButtonFilename = window.bl.getResource('numberpicker_down_arrow');
            var downButton = new cc.MenuItemImage.create(downButtonFilename, downButtonFilename, this.digitDown, this);
            downButton.setPosition(0, -58);
            this.upDownMenu.addChild(downButton);

            this.digitLabel = new cc.LabelTTF.create(this.digit, "mikadoBold", 30);
            this.digitLabel.setPosition(cc.pAdd(this.getAnchorPointInPoints(), cc.p(-1,1)));
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