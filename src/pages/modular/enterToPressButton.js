'use strict';

export function enterToPressButton(field, button) {
    field.addEventListener("keypress",(event)=>{
        if (event.key === "Enter") {
            event.preventDefault();
            button.click();
        }
    });
}
