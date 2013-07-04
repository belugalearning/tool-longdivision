define([], function() {
	'use strict';

	var NumberBox = cc.Node.extend({
		digit:0,
		power:null,
		digitLabel:null,

		ctor:function() {
			this._super();
			var numberContainer = new cc.Sprite();
			numberContainer.initWithFile(s_number_container);
			this.addChild(numberContainer);

			var upDownMenu = new cc.Menu.create();
			upDownMenu.setPosition(0,0);
			this.addChild(upDownMenu);

            var upButton = new cc.MenuItemImage.create(s_number_box_up, s_number_box_up, this.digitUp, this);
            upButton.setPosition(0, 50);
            upDownMenu.addChild(upButton);

            var downButton = new cc.MenuItemImage.create(s_number_box_down, s_number_box_down, this.digitDown, this);
            downButton.setPosition(0, -58);
            upDownMenu.addChild(downButton);

            this.digitLabel = new cc.LabelTTF.create(this.digit, "mikadobold", 30);
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
		},
	});

	return NumberBox;
})