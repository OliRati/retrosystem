import {
    createWindow,
    newSystemStatus,
    WINMASK_CLOSABLE,
    WINMASK_RESIZABLE,
    WINMASK_MOVABLE
} from "./windows.js";

let origX = -1;
let origY = -1;

let calculatorShown = false;

function calculatorWindow() {

    if (!calculatorShown) {
        // Defines vars for calculator

        let operator = "";
        let valueLast = "";
        let value = "";

        // Defines callback functions

        function clearMemory() {
            valueLast = "";
            operator = "";
            value = "";
            updateLcdDisplay("");
        }

        function calcPercent() {
            if (value) {
                if (operator) {
                    let newvalue = eval(valueLast + operator + "(" + value + "/100)");
                    value = newvalue.toString();
                }
                valueLast = "";
                operator = "";
                updateLcdDisplay(value);
            }
        }

        function calcDivide() {
            if (value) {
                if (operator) {
                    let newvalue = eval(valueLast + operator + value);
                    value = newvalue.toString();
                }
                valueLast = value;
                operator = "/";
                value = "";
                updateLcdDisplay(valueLast);
            }
        }

        function calcMultiply() {
            if (value) {
                if (operator) {
                    let newvalue = eval(valueLast + operator + value);
                    value = newvalue.toString();
                }
                valueLast = value;
                operator = "*";
                value = "";
                updateLcdDisplay(valueLast);
            }
        }

        function calcSubstract() {
            if (value) {
                if (operator) {
                    value = num.toString((valueLast + operator + value));
                }
                valueLast = value;
                operator = "-";
                value = "";
                updateLcdDisplay(valueLast);
            }
        }

        function calcAddition() {
            if (value) {
                if (operator) {
                    let newvalue = eval(valueLast + operator + value);
                    value = newvalue.toString();
                }
                valueLast = value;
                operator = "+";
                value = "";
                updateLcdDisplay(valueLast);
            }
        }

        function calcEval() {
            if (value) {
                if (operator) {
                    let newvalue = eval(valueLast + operator + value);
                    value = newvalue.toString();
                }
                valueLast = "";
                operator = "";
                updateLcdDisplay(value);
            }
        }

        function calcNumpad0() {
            if (value != "") {
                value += "0";
                updateLcdDisplay(value);
            }
        }

        function calcNumpad1() {
            value += "1";
            updateLcdDisplay(value);
        }

        function calcNumpad2() {
            value += "2";
            updateLcdDisplay(value);
        }

        function calcNumpad3() {
            value += "3";
            updateLcdDisplay(value);
        }

        function calcNumpad4() {
            value += "4";
            updateLcdDisplay(value);
        }

        function calcNumpad5() {
            value += "5";
            updateLcdDisplay(value);
        }

        function calcNumpad6() {
            value += "6";
            updateLcdDisplay(value);
        }

        function calcNumpad7() {
            value += "7";
            updateLcdDisplay(value);
        }

        function calcNumpad8() {
            value += "8";
            updateLcdDisplay(value);
        }

        function calcNumpad9() {
            value += "9";
            updateLcdDisplay(value);
        }

        function calcDecimal() {
            if (value != "") {
                if (!value.includes('.')) {
                    value += ".";
                    updateLcdDisplay(value);
                }
            }
            else {
                value += "0.";
                updateLcdDisplay(value);
            }
        }

        function onCloseCalculator() {
            calculatorShown = false;

            // Free all event listeners
            document.getElementById("calcClear").removeEventListener('click', clearMemory);
            document.getElementById("calcPercent").removeEventListener('click', calcPercent);
            document.getElementById("calcDivide").removeEventListener('click', calcDivide);
            document.getElementById("calcMutiply").removeEventListener('click', calcMultiply);
            document.getElementById("calcSubstract").removeEventListener('click', calcSubstract);
            document.getElementById("calcAdd").removeEventListener('click', calcAddition);
            document.getElementById("calcEval").removeEventListener('click', calcEval);
            document.getElementById("calc0").removeEventListener('click', calcNumpad0);
            document.getElementById("calc2").removeEventListener('click', calcNumpad2);
            document.getElementById("calc1").removeEventListener('click', calcNumpad1);
            document.getElementById("calc3").removeEventListener('click', calcNumpad3);
            document.getElementById("calc4").removeEventListener('click', calcNumpad4);
            document.getElementById("calc5").removeEventListener('click', calcNumpad5);
            document.getElementById("calc6").removeEventListener('click', calcNumpad6);
            document.getElementById("calc7").removeEventListener('click', calcNumpad7);
            document.getElementById("calc8").removeEventListener('click', calcNumpad8);
            document.getElementById("calc9").removeEventListener('click', calcNumpad9);
            document.getElementById("calcDecimal").removeEventListener('click', calcDecimal);

            // Allow window to close
            return true;
        }

        let newWin = createWindow("calculatorWindow", "Calculator",
            origX, origY, 290, 430,
            WINMASK_MOVABLE | WINMASK_CLOSABLE,
            onCloseCalculator
        );

        /* Initialize keypad interactions */

        function updateLcdDisplay(val) {
            if (val != "")
                document.getElementById("calcLcd").innerText = val;
            else
                document.getElementById("calcLcd").innerText = "0";
        }

        document.getElementById("calcClear").addEventListener('click', clearMemory);
        document.getElementById("calcPercent").addEventListener('click', calcPercent);
        document.getElementById("calcDivide").addEventListener('click', calcDivide);
        document.getElementById("calcMutiply").addEventListener('click', calcMultiply);
        document.getElementById("calcSubstract").addEventListener('click', calcSubstract);
        document.getElementById("calcAdd").addEventListener('click', calcAddition);
        document.getElementById("calcEval").addEventListener('click', calcEval);
        document.getElementById("calc0").addEventListener('click', calcNumpad0);
        document.getElementById("calc1").addEventListener('click', calcNumpad1);
        document.getElementById("calc2").addEventListener('click', calcNumpad2);
        document.getElementById("calc3").addEventListener('click', calcNumpad3);
        document.getElementById("calc4").addEventListener('click', calcNumpad4);
        document.getElementById("calc5").addEventListener('click', calcNumpad5);
        document.getElementById("calc6").addEventListener('click', calcNumpad6);
        document.getElementById("calc7").addEventListener('click', calcNumpad7);
        document.getElementById("calc8").addEventListener('click', calcNumpad8);
        document.getElementById("calc9").addEventListener('click', calcNumpad9);
        document.getElementById("calcDecimal").addEventListener('click', calcDecimal);

        newSystemStatus("Opening calculator...");

        origX += 30;
        origY += 30;
        if (origX > 400) {
            origX = 50;
            origY = 50;
        }
        calculatorShown = true;
    }
}

export { calculatorWindow };