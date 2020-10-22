const { Observable}  = require('tns-core-modules/data/observable')
const model = new Observable();

exports.onTap = () => {
    console.log("Bind ME, baby: ", model );
    model.set("data","Hurray it worked!")
    finishUp();
} //end onTap

exports.onLoaded = args => {
    const page = args.object;
    model.set("data", "please click button")
    page.bindingContext = model;
}  //end onLoaded

const finishUp = () =>{
    alert("OK, we're all done here...")
}//end finishUp