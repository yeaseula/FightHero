const $ = (node) => document.querySelector(node);

export class Character {
    constructor(name,hp,attackPower,type,koName) {
        this.name = name;
        this.koName = koName;
        this.type = type;
        this.attackPower = attackPower;
        this.hp = hp;
        this.count = 1;
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
            <img src="./assets/img/${this.name}.png" alt="${this.name}" id="${this.name}-image">
        `
        const ground = $('.fight_zone');
        ground.append(span);

        this.span = span;
    }

    //공격
    attack({target, isPower}) {
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
        this.attackMessage(target,isPower)

        //상대방 hp 깎기
        if(this.count > 0){
            target.reciveDamage(this.attackPower, this)
            this.hpUpdate(target);
        }
        this.count++;

        //상대방 생존여부 확인
        this.isAlive(target);

    }

    //데미지 함수
    reciveDamage(damage,attacker){
        const realDamage = damage;
        this.hp -= damage;
    }

    //메시지 컴포넌트
    createMsg(text,magstyle){
        const attackmsg = document.createElement('p')
        attackmsg.classList.add(magstyle)
        attackmsg.innerHTML = `${text}`
        const messageZone = $('.message-zone');
        messageZone.append(attackmsg);
    }

    //공격메시지
    attackMessage(target,isPower){
        const attackType = isPower? '필살기 공격!' : '공격!'
        const msg = `[${this.koName}]:${target.koName}에게 ${attackType}!`
        const magstyle = isPower? 'power-attack-style' :'attack-style'
        this.createMsg(msg,magstyle)
    }

    //hp 정보 업데이트
    hpUpdate(target) {
        const hpState = target.span.querySelector('small');
        hpState.textContent = `${target.hp}`;
    }

    //힐+힐 메시지
    // heal () {
    //     if(this.state == 'dead') {
    //         alert('이미 주것서요..')
    //         return
    //     }
    //     if(this.isWinner == true) {
    //         alert('이미 이겼자나요..')
    //         return
    //     }
    //     if(this.hp == this.maxHp) {
    //         alert('이미 체력만땅')
    //         return
    //     };
    //     this.hp = this.maxHp;
    //     const msg = `[${this.name}]: 회복!!!`
    //     const magstyle = 'heal-style'
    //     this.createMsg(msg,magstyle);
    //     this.hpUpdate(this)
    // }

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

export class Hero extends Character {
    attack({target,isPower}) {
        isPower = Math.random() < 0.3;
        const damage = isPower ? this.attackPower * 2 : this.attackPower;
        const originAttackpower = this.attackPower;
        this.attackPower = damage;
        super.attack({target, isPower});
        this.attackPower = originAttackpower;
    }
}

export class Wizard extends Character {
    attack({target,isPower}) {
        super.attack({target, isPower});
        this.shield(target);
    }

    //1회 공격 무효화
    shield(target) {
        target.count = 0;
    }

    //오버라이드
    attackMessage(target,isPower){
        isPower = true;
        const attackType = isPower? '공격 1회 무효화!' : '공격!'
        const msg = `[${this.koName}]:${target.koName}에게 공격! ${target.koName}의 ${attackType}!`
        const magstyle = isPower? 'shield-style':'attack-style'
        this.createMsg(msg,magstyle)
    }
}

export class Tanker extends Character {
    attack({target,isPower}) {
        super.attack({target,isPower});
    }
    reciveDamage(damage,attacker){
        const realDamage = damage / 2;
        this.hp -= realDamage;
        this.revieveattackMessage(attacker)
    }
    revieveattackMessage(attacker){
        const msg = `${attacker.koName} 공격력 절반으로 감소!!`
        const magstyle = 'to-tanker-attack-style'
        this.createMsg(msg,magstyle)
    }
}

export class Healer extends Character {
    attack({target,isPower}) {
        super.attack({target,isPower})
        this.reciveDamage(damage,attacker,isPower)
    }
    reciveDamage(damage,attacker,isPower){
        isPower = Math.random() < 0.55;
        console.log(isPower)
        //3의 배수일 때 마다 랜덤확률로 힐
        if(attacker.count == 3 && isPower) {
            this.hp = this.maxHp;
            this.revieveattackMessage()
            return attacker.count = 0;
        } else {
            this.hp -= damage
        }
    }
    revieveattackMessage(){
        const msg = `${this.koName} 힐러의 HP가 충전됐습니다.`
        const magstyle = 'heal-style'
        this.createMsg(msg,magstyle)
    }
}

export class Demon extends Character {
    attack({target,isPower}) {
        isPower = Math.random() < 0.25;
        const damage = isPower ? this.attackPower * 2 : this.attackPower;
        const originAttackpower = this.attackPower;
        this.attackPower = damage;
        super.attack({target, isPower});
        this.attackPower = originAttackpower;
    }
}

export class Cat extends Character {
    attack({target,isPower}) {
        isPower = Math.random() < 0.33;
        const fullPower = target.hp;
        const damage = isPower ? fullPower : this.attackPower;
        const originAttackpower = this.attackPower;
        this.attackPower = damage;
        super.attack({target, isPower});
        this.attackPower = originAttackpower;
    }
    attackMessage(target,isPower){
        const attackType = isPower? '즉살기 [냥냥펀치] 공격!' : '공격!'
        const msg = `[${this.koName}]:${target.koName}에게 ${attackType}!`
        const magstyle = isPower? 'full-attack-style' : '';
        this.createMsg(msg,magstyle)
    }
}

export class Undead extends Character {
    attack({target,isPower}) {
        super.attack({target,isPower})
        this.recoveryHP()
        this.recoveryHpUpdate()
        //console.log(this.hp)
    }
    recoveryHP(){
        this.hp += Math.round(Math.random() * 10);
        this.recoveryMessage()
    }
    recoveryHpUpdate(){
        const hpState = this.span.querySelector('small');
        hpState.textContent = `${this.hp}`;
    }
    recoveryMessage(){
        const msg = `${this.koName}의 HP가 +${Math.round(Math.random() * 10)} 증가했습니다.`
        const magstyle = 'heal-style'
        this.createMsg(msg,magstyle)
    }
}

export class Slime extends Character {
    constructor(name,hp,attackPower,type,koName){
        super(name,hp,attackPower,type,koName)
        setInterval(()=>{
            this.hp += 1;
            this.hpUpdate(this)
        },800)
    }
}