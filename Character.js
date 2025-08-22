const $ = (node) => document.querySelector(node);

export class Character {
    constructor(name,hp,attackPower,type) {
        this.name = name;
        this.type = type;
        this.hp = hp;
        this.attackPower = attackPower;
        this.maxHp = hp; // 처음 설정한 hp값을 맥스값으로 저장
        this.state = 'alive';
        this.isWinner;
        this.init();
    }
    //기본 캐릭터생성
    init () {
        const span = document.createElement('span');
        span.classList.add(this.type)
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
        if(this.state == 'dead') {
            alert('이미 주것서요..')
            return
        }
        if(this.isWinner == true) {
            alert('이미 이겼자나요..')
            return
        }

        //때리는 모션
        this.span.classList.add('attack');
        setTimeout(() => {
            this.span.classList.remove('attack')
        }, 850);

        //공격 메시지
        this.attackMessage(target)

        //상대방 hp 깎기
        target.hp -= this.attackPower;
        this.hpUpdate(target);

        //상대방 생존여부 확인
        this.isAlive(target);
    }

    //메시지 컴포넌트
    createMsg(text,magstyle){
        const attackmsg = document.createElement('p')
        attackmsg.classList.add(magstyle)
        attackmsg.innerHTML = `${text}`
        const ground = $('.ground');
        ground.append(attackmsg);
    }

    //공격메시지
    attackMessage(target){
        const msg = `[${this.name}]:${target.name} 공격!`
        const magstyle = 'attack-style'
        this.createMsg(msg,magstyle)
    }

    //hp 정보 업데이트
    hpUpdate(target) {
        const hpState = target.span.querySelector('small');
        hpState.textContent = `${target.hp}`;
    }

    //힐+힐 메시지
    heal () {
        if(this.state == 'dead') {
            alert('이미 주것서요..')
            return
        }
        if(this.isWinner == true) {
            alert('이미 이겼자나요..')
            return
        }
        if(this.hp == this.maxHp) {
            alert('이미 체력만땅')
            return
        };
        this.hp = this.maxHp;
        const msg = `[${this.name}]: 회복!!!`
        const magstyle = 'heal-style'
        this.createMsg(msg,magstyle);
        this.hpUpdate(this)
    }

    //살아있냐죽었냐+메시지
    isAlive (target) {
        if(target.hp <= 0) {
            target.span.style.opacity = 0.2;
            target.span.querySelector('small').style.display = 'none';
            alert(`${this.name} 승리!`)

            target.state = 'dead';
            this.isWinner = true;
        }
    }
}