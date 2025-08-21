const $ = (node) => document.querySelector(node);

export class Character {
    constructor(name,hp,attackPower) {
        this.name = name;
        this.hp = hp;
        this.attackPower = attackPower;
        this.maxHp = hp; // 처음 설정한 hp값을 맥스값으로 저장
        this.init();
    }
    //캐릭터생성
    init () {
        const span = document.createElement('span');
        span.classList.add(this.name)
        span.innerHTML = `
            <small class='hp-state'>${this.hp}</small>
            <img src="./img/${this.name}.svg" alt="${this.name}">
        `
        const ground = $('.fight_zone');
        ground.append(span);

        this.span = span;
    }

    //공격
    attack(target) {
        if(target.hp <= 0) return;

        //때리는 모션
        this.span.classList.add('attack');
        setTimeout(() => {
            this.span.classList.remove('attack')
        }, 850);

        //공격 메시지
        this.attackMessage(target)

        //hp 깎기
        target.hp -= this.attackPower;
        this.hpUpdate(target);

        this.isAlive(target);
    }

    //메시지 컴포넌트
    createMsg(text){
        const attackmsg = document.createElement('p')
        attackmsg.innerHTML = `${text}`
        const ground = $('.ground');
        ground.append(attackmsg);
    }

    //공격메시지
    attackMessage(target){
        const msg = `[${this.name}]:${target.name} 공격!`
        this.createMsg(msg)
    }

    //hp 업데이트
    hpUpdate(target) {
        const hpState = target.span.querySelector('small');
        hpState.textContent = `${target.hp}`;
    }

    //힐+힐 메시지
    heal () {
        if(this.hp == this.maxHp) {
            alert('이미 체력만땅')
            return
        };
        this.hp = this.maxHp;
        const msg = `[${this.name}]: 회복!!!`
        this.createMsg(msg);
        this.hpUpdate(this)
    }

    //살아있냐죽었냐+메시지
    isAlive (target) {
        if(target.hp <= 0) {
            target.span.style.opacity = 0.2;
            target.span.querySelector('small').style.display = 'none';
            alert(`${this.name} 승리!`)
        }
    }
}