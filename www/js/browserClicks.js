var touches = function (event) {
  var element = document.body;
  console.losg('In Browser');
  element.addEventListener('click', function (e) {
    console.log(e.target.href);
  })
}
