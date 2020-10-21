const { layout } = require('@nativescript/core/utils');
//app.js
const app = require('tns-core-modules/application');
const Label = require('tns-core-modules/ui/label').Label;
const Button = require('tns-core-modules/ui/button').Button;

const StackLayout = require('tns-core-modules/ui/layouts/stack-layout').StackLayout;

app.run({       //Navigation Entry
    create: () => {

        const layou = new StackLayout();
        const label = new Label();
        const button = new Button();

        label.text = "Hello";
        
        button.text = "Click Me";

        //layout.addChild(label)
        
        return button;
    }

});

