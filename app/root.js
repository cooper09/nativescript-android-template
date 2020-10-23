const { CubicBezierAnimationCurve } = require('@nativescript/core/ui/animation');
const { Observable}  = require('tns-core-modules/data/observable')
const model = new Observable();

const bayes = require('ml-naivebayes');
const natural = require('natural');


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
   


}//end finishUp

const runML = () =>{
    alert("Let the Swami predict...");
    const classifier = new natural.BayesClassifier();

    //Traning Data
    classifier.addDocument("life is but a dream","true")
    classifier.addDocument("life is but peanut butter","false")
    //Train
    classifier.train();

    //Predict
    console.log("I predict: " + classifier.classify("a dream is stinky"))
}