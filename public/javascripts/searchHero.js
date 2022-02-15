const searchBtn = document.querySelector('#searchBtn');
searchBtn.addEventListener('click', fetchHero);

var inputTrigger = document.getElementById('heroInput');

inputTrigger.addEventListener('keyup', function (event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        document.getElementById('searchBtn').click();
    }
});

function fetchHero() {
    const heroInput = document.querySelector('#heroInput');
    const heroCard = document.querySelector('#cards');

    heroCard.replaceChildren([]);

    let API_Call = 'https://www.superheroapi.com/api.php/906492110137146/search/' + heroInput.value;
    fetch(API_Call)
        .then((res) => {
            if (!res.ok) console.error('issue with request', res);
            return res.json();
        })
        .then((data) => {
            console.log(data);
            let dataArray = data.results;
            console.log(dataArray);
            if (dataArray.length < 50) {
                for (let i = 0; i < dataArray.length; i++) {
                    let card = createCard(dataArray, i);
                    heroCard.appendChild(card);
                }
            }
            else {
                for (let i = 0; i < 50; i++) {
                    let card = createCard(dataArray, i);
                    heroCard.appendChild(card);
                }
            }
        })
        .catch((error) => {
            console.error('error:', error);
        })
}

function createCard(dataArray, i) {
    let container = createElementWithClass('div', '');
    let card = createElementWithClass('div', 'card');
    container.appendChild(card);



    let cardHead = createElementWithClass('div', '');
    cardHead.style.backgroundColor = '#8b2d2d'
    cardHead.style.color = '#F2F2F2';
    cardHead.innerHTML = `<h2 class="text-center"> ${dataArray[i].name}</h2>`;
    card.appendChild(cardHead);

    let cardImage = createElementWithClass('div', 'img');
    cardImage.innerHTML = `<a href="/heroes/byapi/${dataArray[i].name}"> <img src="${dataArray[i].image.url}" class="img-thumbnail mx-auto d-block"> </a>`;
    cardHead.appendChild(cardImage);
    return container;
}


function createElementWithClass(type, classes) {
    let element = document.createElement(type);
    element.classname = classes;
    return element;
}