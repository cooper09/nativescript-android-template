const { CubicBezierAnimationCurve } = require('@nativescript/core/ui/animation');
const { Observable}  = require('tns-core-modules/data/observable')
const model = new Observable();

let bayes = require('ml-naivebayes');

exports.onTap = () => {
    console.log("Bind ME, baby: ", model );
    model.set("data","Hurray it worked!")
    //finishUp();
    runML();
} //end onTap

exports.onLoaded = args => {
    const page = args.object;
    model.set("data", "please click button")
    page.bindingContext = model;
}  //end onLoaded

const finishUp = () =>{
    alert("OK, we're all done here...");
   // const brain = new brain();

}//end finishUp

const runML = () =>{
    alert("Now lets apply our brain...");
  //  const brain = new brain();  
}