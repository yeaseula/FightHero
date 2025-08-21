import { Character } from "./Character.js";

const $ = (node) => document.querySelector(node);

const hero = new Character('hero',100,20)
const monster = new Character('monster',90,20)
const characterArr = [hero,monster]

const ActionBtn = document.querySelectorAll('.control-btn')
ActionBtn.forEach((btn)=>{
    btn.addEventListener('click',(e)=>{
        const cahrsName = characterArr[e.currentTarget.dataset.index];
        const action = e.currentTarget.dataset.action; // attack or heal

        if(action == 'attack') {
            const attackTarget = characterArr[e.currentTarget.dataset.to]
            cahrsName[action](attackTarget);
        } else {
            cahrsName[action]();
        }
    })
})