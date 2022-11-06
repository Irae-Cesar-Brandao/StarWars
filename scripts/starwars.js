/*STARWARS.JS - CÓDIGO DE CRIAÇÃO DO JOGO STAR WARS
EM JAVASCRIPT REF CURSO IFTO: PROGRAMADOR WEB 2022
ALUNO:  IRAÊ CÉSAR BRANDÃO*/

// CRIAR FUNÇÃO PARA CRIAR UM ELEMENTO NO HTML  TAG, CLASSE E O CONTEUDO
function randomInt(mx) {
    return Math.round(Math.random() * max);
}
function element(tagName, className = '', innerHTML = '') {
    const element = document.createElement(tagName);
    element.className = className;
    element.innerHTML = innerHTML;
    return element;
}


//CLASSE DA TELA DE BLOQUEIO DO  JOGO
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
            if (keyCode === event.keyCode) {
                this.#element.remove();
                fn();
            }
        }
    }
}

//CLASSE DE SELEÇÃO DAS NAVES 
class SelectSpaceship{
    #element;
    constructor(game, spaceships, fn) {
        this.#element = element('div', 'select-spaceship');
        this.#element.appendChild(element('span', '', 'Selecione sua nave para a batalha!'));
        game.appendChild(this.#element);
        this.#element.appendChild(
            this.#createSpaceships(spaceships, fn)
        );      
    }

    #createSpaceships(spaceships, fn) {
        const container = element('div', 'spaceships');
        spaceships.forEach(item => {
            const a = element('a');
            a.href = '#';
            const div = Spaceship.createSpaceship(item.type);
            a.appendChild(div);
            container.appendChild(a);
            a.onclick = () => {  // AERO FUNCTION
                fn(item);
                this.#element.remove(); 
            }
        });
        return container;
        
    }

}
// CLASSE UFO - ESPAÇONAVE REBELDE
class UFO{
    #game;
    #element;
    #top;
    constructor(game, element, top = true) {
        this.#game = game;
        this.#element = element;
        this.#game.appendChild(this.#element);
        this.#top = top;
    }
        // ELEMENTO QUE RETORNA TODAS AS PROPRIEDADES DE UM  modelETO
        //(getBoundingClientRect() retorna tamanho e posição de um elemento)
    get x() {return this.#element.getBoundingClientRect().left;}
    get y() {return this.#element.getBoundingClientRect().top;}
    get width() {return this.#element.getBoundingClientRect().width;}
    get height() {return this.#element.getBoundingClientRect().height;}
    get maxWidth() {return this.#game.clientWidth;}
    get maxHeight() { return this.#game.clientHeight; }
    set x(x) { this.#element.style.left = `${x}px`;}       //TEMPLATE STRING
    set y(y) { this.#element.style.top = `${y}px`; }       // TEMPLATE STRING
    
    checkArea() {
        if (this.y + this.height < 0 || this.y > this.maxHeight){
            return false;
        }
        return true;
    
    }
    animation(mov) {
        this.y += (this.#top) ? -mov : mov;  // MOVIMENTO DA NAVE
        if (!this.checkArea()) {
            this.remove();
            return false;
        }
        return true;
    }

    remove() {
        this.#element.remove();
    }
}


// CLASSE ESPAÇONAVE COM AS MESMAS CARACTERÍSTICAS DE UFO
class Spaceship extends UFO{
    #guns;
    #gun_use;
    #type;
    constructor(game, model, type = 'imperial') {
        const top = type !== 'imperial';
        const element = Spaceship.createSpaceship(model.type);
        super(game, element, top);
        // SETANDO O VALOR DE Y PARA POSICIONAR A NAVE ALIADA NA BASE DA TELA DISTANCIANDO
        this.y = this.maxHeight - this.height - 30;
        this.x = (this.maxWidth - this.width) / 2;
        this.#guns = model.guns;
        this.#gun_use = -1;
        this.#type = type;
    }
    static createSpaceship(type) {
        const div = element('div', 'spaceship ' + type);
        const img = element('img');
        img.src = `images/${type}.png`;         //TEMPLATE STRING
        div.appendChild(img);
        return div;
    }
    // CRIAÇÃO DO MÉTODO FIRE
    fire(game) {
        this.#gun_use++;
        this.#gun_use = (this.#gun_use >= this.#guns.length) ? 0 : this.#gun_use; //OPERADOR TERNÁRIO
        const gun = this.#guns[this.#gun_use];  // ARMAZENADO O CANHÃO QUE ESTÁ EM USO
        const newx = this.x + gun.x;
        const newy = this.y + gun.y;
        return new Laser(game, this.#type, newx, newy);
    }
}

// CLASSE LASER UFO (LASER NAVE REBELDE)
class Laser extends UFO{
    constructor(game, type, x, y) {
        const top = type !== 'imperial';
        super(game, element('div', 'laser ' + type),top);
        this.x = x;
        this.y = y;
    }
}

//CLASSE DA ESPAÇONAVE REBELDE
class RebeldsSpaceship extends Spaceship{
    #direction;
    set direction(direction) {
        this.#direction = direction;
    }
    animation(mov) {
        let newx = this.x + (mov * this.#direction);
        if (newx < 0) {
            newx = 0;
        } else if (newx > this.maxWidth - this.width) {
            newx = this.maxWidth - this.width;
        }
        this.x = newx;
        
    }
}

//CLASSE ESPAÇONASVES INIMIGAS
class EnemySpaceship extends Spaceship{
    raffle() {
        this.x = randomInt(this.maxWidth - this.width);
        this.y = randomInt(-2000)-200;
    }
    checkArea() {
        if (this.y > this.maxHeight+20){
            this.raffle();
        }
        return true;
    
    }
}

//CLASSE QUE GERENCIA O JOGO
class StarWars{
    #game;                          // TELA DO JOGO
    
    #rebelds_models = [          // OPÇÕES DAS ESPAÇONAVES
        {type: 'xw',
            guns: [
                //{ x: 47, y: -17 },  // CANHÃO DO CENTRO
                { x: 0, y: 40 },    // CANHÃO DA ESQUERDA
                { x: 97, y: 40 }    // CANHÃO DA DIREITA
            ]
        },
        
        {type: 'mf',
            guns: [
                { x: 40 , y: -16 }, // CANHÃO DA ESQUERDA
                { x: 57, y: -16 }    // CANHÃO DA DIREITA
            ]
        },

    ];   


    #rebeld_spaceship;             // ESPAÇONAVES INIMIGAS
    #rebelds_lasers;            // LASER INIMIGOS


    #enemies_models = [          // OPÇÕES DAS ESPAÇONAVES
    {type: 'ief',
        guns: [            { x: 29, y: 130 },    // CANHÃO DA ESQUERDA
            { x: 68, y: 130 }    // CANHÃO DA DIREITA
        ]
    },
    
    {type: 'tfa',
    guns: [
            { x: 5, y: 85 },    // CANHÃO DA ESQUERDA
            { x: 93, y: 85 }    // CANHÃO DA DIREITA
    ]
},
];   


#enemies_spaceships;         // ESPAÇONAVES INIMIGAS
#enemies_lasers;            // LASER INIMIGOS
#enemies_max = 5;           // NUMERO MÁXIMO DE IINIMIGOS.


    #interval;                  //  ARMAZENAR O MOTOR DO JOGO
    #mov = 5;                   // DESLOCAMENTO PADRÃO DOS OBJETOS DO JOGO
    constructor() {
    this.#game = document.querySelector('body');      //TELA PRINCIPAL DO JOGO (BODY)
       new LookScreen(this.#game, 'Aperte Enter', 13,
            () => new SelectSpaceship(
            this.#game,
            this.#rebelds_models,
                (type) => this.createSpaceship(type)
            )
        );
     /*   this.#testeModel(this.#enemies_models[1]);   TESTADOR DOS MODELOS  DE NAVES*/
    }

    createSpaceship(type) {
        this.#rebeld_spaceship = new RebeldsSpaceship(this.#game, type);
        this.#rebelds_lasers = [];
        this.#enemies_spaceships = [];
        this.#enemies_lasers = [];
        this.start();
    }
    start() {               // FUNÇÃO DE INICIAR JOGO
        this.#gameControlls();
        this.#interval = setInterval(() => {
            if (this.#enemies_max > this.#enemies_spaceships.length) {
                const nmodel = randomInt(this.#enemies_models.length-1);
                const model = this.#enemies_models[nmodel];
                this.#enemies_spaceships.push(new EnemySpaceship(this.#game, model)); 
            }
            this.#animation();
        }, 20);
        
    }
    pause() {                // FUNÇÃO DE PAUSA DO JOGO
        clearInterval(this.#interval);
        new LookScreen(this.#game, 'Aperte Pause p/continuar...', 19,
            () => {
                this.start();
            }
        );
    }

    #animation() {           // FUNÇÃO DE ANIMAÇÃO DO JOGO
        this.#rebeld_spaceship.animation(this.#mov)
        this.#rebelds_lasers.forEach((laser, index) => {
            if (!laser.animation(this.#mov)) {       // APAGAR LASERS ARMAZENADOS
                this.#rebelds_lasers.splice(index, 1);
            }
        });
        this.#enemies_spaceships.forEach((enemy) => {
            enemy.animation(this.#mov);
        });
    }

    // CONTROLES DO JOGO
    #gameControlls() {
        window.onkeyup = (event) => {   // AEROFUNCTION
            switch (event.keyCode) {     // CRIAÇÃO SWITCH
                case 32:
                    const laser = this.#rebeld_spaceship.fire(this.#game);
                    this.#rebelds_lasers.push(laser);
                    break;
                case 19:       
                    this.pause();
                    break;
                case 37:
                case 39:
                    this.#rebeld_spaceship.direction = 0;
                    break;
                case 73:     // TECLA I PRESSIONADA INFORMA NO CONCOLE OS LASER ARMAZENADOS
                    console.log(this.#rebelds_lasers);
                    break;
                default:
                    console.log("Controle não ativo: " + event.keyCode);
                    break;
            }
        }
        window.onkeydown = (event) => {
            switch (event.keyCode) {
                case 37:
                    this.#rebeld_spaceship.direction = -1;
                    break;
                case 39:
                    this.#rebeld_spaceship.direction = 1;
                    break;
            }
        }
    }
    #testeModel(model, type = 'imprerial') {
        const spaceship = new Spaceship(this.#game, model, type);
        spaceship.x = 200;
        spaceship.y = 200;
        model.guns.forEach(() => {
            spaceship.fire(this.#game);
        })
    }
}
new StarWars;


