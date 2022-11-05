{/*    <div class="page-wrapper">
    <h4>Star Wars</h4>
    <span>Aperte pause para continuar</span>
</div> */}


// CRIAR FUNÇÃO PARA CRIAR UM ELEMENTO NO HTML  TAG, CLASSE E O CONTEUDO
function element(tagName, className = '', innerHTML = '') {
    const element = document.createElement(tagName);
    element.className = className;
    element.innerHTML = innerHTML;
    return element;
}


//CRIANDO A TELA DE BLOQUEIO DO  JOGO
class LookScreen{
    #element;
    constructor(game, msg, keyCode, fn) {
        this.#element = element('div', 'page-wrapper');
        this.#element.appendChild(element('h4', '', 'Star Wars'));
        this.#element.appendChild(element('span', '', msg));
        game.appendChild(this.#element);
        this.controllers(keyCode, fn);      
    }
    controllers(keyCode, fn) {
        window.onkeyup = (event) => {
            // PARA IDENTIRFICAR A TECLA PRESSIONADO
            console.log(event.keyCode);

            if (keyCode === event.keyCode) {
                this.#element.remove();
                fn();
            }
        }
    }
}


{/*

<div class="select-spaceship">
    <span>Selecione sua nave para a batalha</span>
    <div class="spaceships">
        <a href="#">
            <div class="sapaceship xw">
                <img src="images/xw.png" alt="">
            </div>
        </a>
        <a href="#">
            <div class="spaceship mf">
                <img src="images/mf.png" alt="">
            </div>
        </a>
    </div>
</div>
*/}

class SeletcSpaceship{
    #element;
    constructor(game) {
        this.#element = element('div', 'select-spaceship');
        this.#element.appendChild(element('span', '', 'Selecione sua nave para a batalha!'));
        game.appendChild(this.#element);
        
    }

}


//TELA PRINCIPAL DO JOGO (BODY)
const game = document.querySelector('body');
//game.appendChild(element('div', 'page-wrapper', 'Irae'));
new LookScreen(game, 'Aperte Enter',13,()=>new SeletcSpaceship(game));