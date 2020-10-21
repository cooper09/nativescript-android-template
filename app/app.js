const { layout } = require('@nativescript/core/utils');
//app.js
const app = require('tns-core-modules/application');
const Label = require('tns-core-modules/ui/label').Label;
const Button = require('tns-core-modules/ui/button').Button;

const StackLayout = require('tns-core-modules/ui/layouts/stack-layout').StackLayout;

app.run({       //Navigation Entry
    create: () => {

        const layout = new StackLayout();
        layout.className = 'base-layout';

        const label = new Label();
        const button1 = new Button();
        const button2 = new Button();

        label.text = "Stinky"
        label.className="base-color";
        button1.text = "Click Me 1";
        button2.text = "Click Me 2";

        layout.addChild(label)
        layout.addChild(button1)
        layout.addChild(button2)

        
        return layout;
    }

});

