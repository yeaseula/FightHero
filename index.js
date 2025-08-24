import { Character, Tanker, Healer, Cat, Undead, Slime } from "./Character.js";
import { Hero } from "./Character.js";
import { Demon } from "./Character.js";
import { Wizard } from "./Character.js";

const $ = (node) => document.querySelector(node);

//캐릭터 선택

const selectBtnPrev = $('.prev-btn');
const selectBtnNext = $('.next-btn');

// 1페이지에서 이전 버튼 비활성화
// 2페이지에서 다음 버튼이 Go Fight 텍스트로 변경
// 1페이지에서 선택을 해야 다음 버튼 누르기 가능

//초기 '이전'버튼은 비활성화
selectBtnPrev.disabled = true;


//riado 버튼 선택시 선택값이 input 필드로 넘어가도록
const heroAction = document.querySelectorAll('input[name="heroteam"]');
const heroInput = document.getElementById('heroteam-input')

const monsterAction = document.querySelectorAll('input[name="monsterteam"]');
const monsterInput = document.getElementById('monsterteam-input')

function CharsSelectFunc(Action,Input) {
    Action.forEach((btn)=>{
        btn.addEventListener('click',(e)=>{
            const charstype = e.currentTarget.value;
            Input.value = charstype
        })
    })
}

CharsSelectFunc(heroAction,heroInput);
CharsSelectFunc(monsterAction,monsterInput);

//next 버튼 클릭
selectBtnNext.addEventListener('click',(e)=>{
    const isReady = e.currentTarget.classList.contains('go-btn');

    //1페이지에서
    if(!isReady){
        if(heroInput.value.length == 0) {
            alert('용사팀 캐릭터를 골라야함');
            return;
        };

        ChangeContainer();
        selectBtnPrev.disabled = false;
        selectBtnNext.classList.add('go-btn');
        e.currentTarget.textContent = '결투하러 가기'
    }

    //2페이지에서
    if(isReady) {
        if(monsterInput.value.length == 0){
            alert('몬스터팀 캐릭터를 골라야함');
            return;
        }
        $('.character-select').remove();

        const heroValue = heroInput.value;
        const monsterValue = monsterInput.value;
        CharsObjectInit(heroValue,monsterValue);
    }
})

//prev 버튼 클릭
selectBtnPrev.addEventListener('click',(e)=>{
    ChangeContainer();
    selectBtnPrev.disabled = true;
    selectBtnNext.classList.remove('go-btn');
    selectBtnNext.textContent = '다음'
})

function ChangeContainer() {
    const selectContainer = document.querySelectorAll('.select-container');
    selectContainer.forEach((cont)=>{
        if(cont.classList.contains('on')) {
            cont.classList.remove('on')
        } else {
            cont.classList.add('on')
        }
    })
}

//선택한 캐릭터 객체 생성
function CharsObjectInit(heroValue,monsterValue){
    const characterArr = []

    if(heroValue == 'hero'){
        const hero = new Hero('hero',98,20,'hero')
        characterArr[0] = hero
    } else if(heroValue == 'wizard') {
        const wizard = new Wizard('wizard',88,15,'hero')
        characterArr[0] = wizard
    } else if(heroValue == 'tanker') {
        const tanker = new Tanker('tanker',100,18,'hero')
        characterArr[0] = tanker
    } else if(heroValue[0] == 'healer') {
        const healer = new Healer('healer',85,12,'hero')
        characterArr[0] = healer
    }

    if(monsterValue == 'demon') {
        const demon = new Demon('demon',100,20,'monster')
        characterArr[1] = demon
    } else if(monsterValue == 'cat') {
        const cat = new Cat('cat',97,18,'monster')
        characterArr[1] = cat
    } else if(monsterValue == 'undead') {
        const undead = new Undead('undead',85,12,'monster')
        characterArr[1] = undead
    } else if(monsterValue == 'slime') {
        const slime = new Slime('slime',72,8,'monster')
        characterArr[1] = slime
    }

    const btnInfo = [
        //히어로-필살기(랜덤확률로 2배 공격력)
        //마법사-상대방 공격 못하게 마법 (버튼 누르면 턴 1회 후 상대 공격은 안먹힘)
        //탱커-공격받아도 데미지 절반
        //힐러-자신의 hp 회복 (랜덤확률로 상대방 hp 강도질)

        //악마-필살기(랜덤확률로 2배 공격력)
        //괴수-필살공격으로 즉살기(랜덤확률로 발동)
        //언데드-공격후 hp 회복(회복점수는 랜덤)?
        //슬라임-공격력은 약하지만 점점 hp 회복
    ]

    const ActionBtn = document.querySelectorAll('.control-btn')
    ActionBtn.forEach((btn)=>{
        btn.addEventListener('click',(e)=>{
            const cahrsName = characterArr[e.currentTarget.dataset.index];
            const action = e.currentTarget.dataset.action; // attack or heal

            if(action == 'attack') {
                const attackTarget = characterArr[e.currentTarget.dataset.to]
                cahrsName[action]({ target:attackTarget, isPower:true});
            } else {
                cahrsName[action]();
            }
        })
    })
}