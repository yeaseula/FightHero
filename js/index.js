import {
  Hero,
  Wizard,
  Tanker,
  Healer,
  Demon,
  Cat,
  Undead,
  Slime,
} from "./Character.js";

const $ = (node) => document.querySelector(node);

//캐릭터 선택
async function loadCharacters() {
  setTimeout(() => {
    $(".skeleton-overlay").classList.add("off");
    $(".skeleton-overlay").setAttribute("aria-hidden", "true");
  }, 2500);

  try {
    const res = await fetch("./character.json");
    const data = await res.json();
    renderGroup(
      data.heroes,
      "heroteam",
      "hero-container",
      "몬스터를 토벌하는 용사를 선택하세요!",
      "true",
    );
    renderGroup(
      data.monsters,
      "monsterteam",
      "monster-container",
      "용사와 싸우는 몬스터를 선택하세요!",
      "false",
    );

    if (!res.ok) {
      throw new Error("error 발생");
    }
  } catch (err) {
    alert("일시적으로 데이터 패치에 실패했습니다.");
  }

  const selectBtnPrev = $(".prev-btn");
  const selectBtnNext = $(".next-btn");

  // 1페이지에서 이전 버튼 비활성화
  // 2페이지에서 다음 버튼이 Go Fight 텍스트로 변경
  // 1페이지에서 선택을 해야 다음 버튼 누르기 가능

  //초기 '이전'버튼은 비활성화, monster는 스크린리더 숨김
  selectBtnPrev.disabled = true;

  //riado 버튼 선택시 선택값이 input 필드로 넘어가도록
  const heroAction = document.querySelectorAll('input[name="heroteam"]');
  const heroInput = document.getElementById("heroteam-input");

  const monsterAction = document.querySelectorAll('input[name="monsterteam"]');
  const monsterInput = document.getElementById("monsterteam-input");

  function CharsSelectFunc(Action, Input) {
    Action.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const charstype = e.currentTarget.value;
        Input.value = charstype;
      });
    });
  }

  CharsSelectFunc(heroAction, heroInput);
  CharsSelectFunc(monsterAction, monsterInput);

  //next 버튼 클릭
  selectBtnNext.addEventListener("click", (e) => {
    const isReady = e.currentTarget.classList.contains("go-btn");

    //1페이지에서
    if (!isReady) {
      if (heroInput.value.length == 0) {
        const winMessage = `
                    <p id="modal-title">용사팀 캐릭터를 골라야합니다</p>
                    <button type="button" class="com-btn dark" id="close-msg-btn">닫기</button>
                `;
        modalCom(winMessage);
        return;
      }

      ChangeContainer();
      selectBtnPrev.disabled = false;
      selectBtnNext.classList.add("go-btn");
      e.currentTarget.textContent = "결투하러 가기";

      Accessibility("hero-container", "monster-container");
    }

    //2페이지에서
    if (isReady) {
      if (monsterInput.value.length == 0) {
        const winMessage = `
                    <p id="modal-title">몬스터팀 캐릭터를 골라야합니다</p>
                    <button type="button" class="com-btn dark" id="close-msg-btn">닫기</button>
                `;
        modalCom(winMessage);
        return;
      }
      $(".character-select").remove();
      $("body").classList.add("on");
      $(".game-title").classList.add("on");
      $(".ground").classList.add("on");
      const heroValue = heroInput.value;
      const monsterValue = monsterInput.value;
      CharsObjectInit(heroValue, monsterValue);
    }
  });

  function modalCom(message) {
    const isWinnerMsg = document.querySelector(".ischoose-msg");
    isWinnerMsg.classList.add("on");
    isWinnerMsg.innerHTML = message;

    // TabCloser(isWinnerMsg)

    $("#close-msg-btn").addEventListener("click", () => {
      isWinnerMsg.classList.remove("on");
    });
  }

  function TabCloser(modal) {
    const focusable = modal.querySelectorAll("button");
    const firstEl = focusable[0];
    const lastEl = focusable[focusable.length - 1];

    modal.addEventListener("keydown", (e) => {
      if (e.key !== "Tab") return;

      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    });
  }

  //prev 버튼 클릭
  selectBtnPrev.addEventListener("click", (e) => {
    ChangeContainer();
    selectBtnPrev.disabled = true;
    selectBtnNext.classList.remove("go-btn");
    selectBtnNext.textContent = "다음";
    Accessibility("monster-container", "hero-container");
  });

  function ChangeContainer() {
    const selectContainer = document.querySelectorAll(".select-container");
    selectContainer.forEach((cont) => {
      if (cont.classList.contains("on")) {
        cont.classList.remove("on");
      } else {
        cont.classList.add("on");
      }
    });
  }

  //선택한 캐릭터 객체 생성
  function CharsObjectInit(heroValue, monsterValue) {
    const heroTeam = {
      hero: {
        chars: Hero,
        hp: 98,
        attackPower: 20,
        type: "hero",
        koName: "용사",
      },
      wizard: {
        chars: Wizard,
        hp: 88,
        attackPower: 15,
        type: "hero",
        koName: "마법사",
      },
      tanker: {
        chars: Tanker,
        hp: 100,
        attackPower: 18,
        type: "hero",
        koName: "탱커",
      },
      healer: {
        chars: Healer,
        hp: 85,
        attackPower: 12,
        type: "hero",
        koName: "힐러",
      },
    };

    const monsterTeam = {
      demon: {
        chars: Demon,
        hp: 100,
        attackPower: 20,
        type: "monster",
        koName: "악마",
      },
      cat: {
        chars: Cat,
        hp: 97,
        attackPower: 18,
        type: "monster",
        koName: "괴수",
      },
      undead: {
        chars: Undead,
        hp: 85,
        attackPower: 12,
        type: "monster",
        koName: "언데드",
      },
      slime: {
        chars: Slime,
        hp: 72,
        attackPower: 9,
        type: "monster",
        koName: "슬라임",
      },
    };

    function createCharacter(map, key) {
      const Chars = map[key];
      return new Chars.chars(
        key,
        Chars.hp,
        Chars.attackPower,
        Chars.type,
        Chars.koName,
      );
    }

    const HeroGet = createCharacter(heroTeam, heroValue);
    const MonsterGet = createCharacter(monsterTeam, monsterValue);

    const characterArr = [HeroGet, MonsterGet];

    const btnInfo = [
      //히어로-필살기(랜덤확률로 2배 공격력)
      //마법사-상대방 공격 못하게 마법 (버튼 누르면 턴 1회 후 상대 공격은 안먹힘)
      //탱커-공격받아도 데미지 절반
      //힐러-자신의 hp 회복 (랜덤확률로 상대방 hp 강도질)
      //악마-필살기(랜덤확률로 2배 공격력)
      //괴수-필살공격으로 즉살기(랜덤확률로 발동)
      //언데드-공격후 hp 회복(회복점수는 랜덤)?
      //슬라임-공격력은 약하지만 점점 hp 회복
    ];

    const ActionBtn = document.querySelectorAll(".control-btn");
    ActionBtn.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const cahrsName = characterArr[e.currentTarget.dataset.index];
        const action = e.currentTarget.dataset.action; // attack or heal

        if (action == "attack") {
          const attackTarget = characterArr[e.currentTarget.dataset.to];
          cahrsName[action]({ target: attackTarget, isPower: false });
        } else {
          cahrsName[action]();
        }
      });
    });
  }
}

function renderGroup(list, groupName, containerId, titleText, active) {
  const container = document.getElementById(containerId);
  container.innerHTML = `
    <p>${titleText}</p>
    <div class="label-container">
        ${list
          .map(
            (item) => `
            <label for="${item.id}">
            <input type="radio" value="${item.value}" id="${item.id}" name="${groupName}" tabindex=${active === "true" ? 1 : -1}>
            <div class="img-box">
                <img src="${item.img}" alt="${item.alt}">
                <div class="hover-contents">
                <p class="hover-title">${item.title}</p>
                <p class="hover-cont">${item.desc}</p>
                <p class="hover-infor">HP : ${item.hp}<br> attack power: ${item.atk}</p>
                </div>
            </div>
            <span>${item.name}</span>
            </label>
        `,
          )
          .join("")}
        </div>
    `;
}

function Accessibility(nonActiveSection, activeSection) {
  const nonActiveSectionName = document.getElementById(nonActiveSection);
  nonActiveSectionName
    .querySelectorAll('input[type="radio"]')
    .forEach((ele) => {
      ele.setAttribute("tabindex", -1);
    });
  nonActiveSectionName.setAttribute("aria-hidden", "true");

  const activeSectionName = document.getElementById(activeSection);
  activeSectionName.querySelectorAll('input[type="radio"]').forEach((ele) => {
    ele.setAttribute("tabindex", 1);
  });
  activeSectionName.setAttribute("aria-hidden", "false");
}

loadCharacters();
