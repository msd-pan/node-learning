var num1Element = document.getElementById("num1");
var num2Element = document.getElementById("num2");
var buttonElement = document.querySelector("button");
var add = function (num1, num2) { return num1 + num2; };
buttonElement === null || buttonElement === void 0 ? void 0 : buttonElement.addEventListener("click", function () {
    var num1 = num1Element.value;
    var num2 = num2Element.value;
    var result = add(+num1, +num2);
    console.log(result);
});
console.log(add(1, 6));
