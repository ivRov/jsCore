let inputBlock = document.querySelector(".input-block");
let listBlock = document.querySelector(".list-block");
let input = document.createElement("input");
let listUlSearch = document.createElement("ul");
let listLiSearch = document.createElement("li");
let listUlMain = document.createElement("ul");
let listLiMain = document.createElement("li");

listLiMain.textContent = "Список пуст";

inputBlock.appendChild(input);
inputBlock.appendChild(listUlSearch);
listBlock.appendChild(listUlMain);
listUlMain.appendChild(listLiMain);

// удаляем елементы в инпуте при новом значении
function clearChildElem() {
  while (listUlSearch.firstChild) {
    listUlSearch.removeChild(listUlSearch.firstChild);
  }
}

// создаем подсказку для списка что он пуст если в нём нет репозиториев
function addHelpText(){
 if(listBlock.childElementCount == 0){
  listBlock.appendChild(listUlMain)

 }
}


// создаем заготовку из ответа с сервера
function createBlank(arr) {
  arr.forEach((element) => {
    listUlSearch.insertAdjacentHTML(
      "afterbegin",
      `<li class='btn-add'>${element.name}</li>`
    );

    // добавляем элемент в список
    let addbtn = document.querySelector(".btn-add");
    addbtn.addEventListener("click", function () {
      let blank = `
                    <ul>
                    <li class='addedLi'>Name: ${element.name}</li>
                    <li class ='addedLi'>Owner: ${element.owner.login}</li>
                    <li class ='addedLi'>Stars: ${element.stargazers_count}</li>
                    <button class='btn-delete'>x</button>
                    </ul>
                    `;

      listBlock.insertAdjacentHTML("afterBegin", blank);
      input.value = "";
      // вешаем событие на удаление карточки
      document.querySelector('.btn-delete').addEventListener('click',function(e){
        e.target.parentNode.remove()
        // если список пуст добавляем подсказку что он пуст
        addHelpText()
      })
      // если в список добавлен репозиторий очищаем инпут
      clearChildElem();

      // если в список добавлен репозиторий убираем подсказку что он пуст
      if (listBlock.childElementCount >= 1) {
        listUlMain.remove();
      }
    });
    
  });
}

async function getRepo(name) {
  // удаляем э-ты в инпуте при новом запросе
  clearChildElem();

  // если есть символы без пробелов отправляем запрос
  if (name && name.trim() != "") {
    try {
      let getLink = await fetch(
        `https://api.github.com/search/repositories?q=${name}`
      );
      if (getLink.status != 200) {
        throw new Error(getLink.status);
      }
      let toJson = await getLink.json();

      // получаем 5 объектов
      let res = await toJson.items.slice(0, 5);
      createBlank(res);
      addHelpText()
    } catch (e) {
      alert(e);
    }
   
  }

 
}

let updateDebounce = debounce((e) => {
  getRepo(e);
});

function debounce(cb, ms = 1000) {
  let timeStamp;
  return function (...arg) {
    clearTimeout(timeStamp);

    timeStamp = setTimeout(() => {
      cb(...arg);
    }, ms);
  };
 
}

input.addEventListener("input", function (el) {
  updateDebounce(el.target.value);
});

