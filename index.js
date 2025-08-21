import { Character } from "./Character.js";

const $ = (node) => document.querySelector(node);

const hero = new Character('hero',100,20);
const monster = new Character('monster',90,20);

const AttackBtn = document.querySelectorAll('.attack-btn');
AttackBtn.forEach((btn)=>{
    btn.addEventListener('click',(e)=>{
        const TargetChars = e.currentTarget.dataset.control;
        switch (TargetChars) {
            case 'hero':
                if(hero.hp > 0) {
                    hero.attack(monster)
                } else {
                    alert('이미 주것서요..')
                }
                break;
            case 'monster':
                if(monster.hp > 0) {
                    monster.attack(hero)
                } else {
                    alert('이미 주것서요..')
                }
                break;
            default :
                hero.attack();
                break
        }
    })
})
const HealBtn = document.querySelectorAll('.heal-btn');
HealBtn.forEach((btn)=>{
    btn.addEventListener('click',(e)=>{
        const TargetChars = e.currentTarget.dataset.control;
        switch (TargetChars) {
            case 'hero':
                if(hero.hp > 0) {
                    hero.heal()
                } else {
                    alert('이미주것서요..')
                }
                break;
            case 'monster':
                if(monster.hp > 0) {
                    monster.heal()
                } else {
                    alert('이미주것서요..')
                }
                break;
            default :
                hero.heal();
                break
        }
    })
})