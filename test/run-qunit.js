function waitFor(test, complete, timeout){
  var result, start = new Date().getTime();
  setInterval(function interval(){
    if ((new Date().getTime() - start < timeout) && !result) {
      result = test();
    } else {
      if (!result) {
        phantom.exit(1);
      } else {
        complete();
        clearInterval(interval);
      }
    }
  }, 100);
}


var fs = require('fs'), page = require('webpage').create();
var url = 'file://localhost' + fs.workingDirectory + '/' + phantom.args[0];

page.onConsoleMessage = function(msg) { console.log(msg) }

page.open(url, function(status){
  waitFor(function(){
    return page.evaluate(function(){
      var el = document.getElementById('qunit-testresult');
      return el && el.innerText.match('completed');
    })
  }, function(){
    var failures = page.evaluate(function(){
      var el    = document.getElementById('qunit-testresult'),
          fails = document.getElementsByClassName('fail');

      console.log(document.title);

      for (var i = 0; i < fails.length; i++)
        console.log(fails[i].innerText);

      console.log(el.innerText);

      return parseInt(el.getElementsByClassName('failed')[0].innerHTML);
    });
    phantom.exit(failures > 0 ? 1 : 0);
  }, 10000);
});