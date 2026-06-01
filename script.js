const canvas = document.getElementById('fons-flors');
const ctx = canvas.getContext('2d');

let llimitTextY = 0;
// Aquí guardarem la posició exacta del logo a la pantalla
let caixaLogo = { xMin: 0, xMax: 0, yMin: 0, yMax: 0 };

function ajustarPantalla() {
    const portada = document.querySelector('.pantalla-inici');
    const sobreMi = document.querySelector('.sobre-mi');
    const logo = document.querySelector('.logo') || document.querySelector('.logo-container');
    
    canvas.width = window.innerWidth;
    
    const portadaHeight = portada ? portada.offsetHeight : window.innerHeight;
    canvas.height = portadaHeight + 150; 

    // 1. ZONA TEXT: Calculem el límit de la introducció
    if (sobreMi) {
        const rect = sobreMi.getBoundingClientRect();
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        llimitTextY = rect.top + scrollTop - 40; 
    } else {
        llimitTextY = portadaHeight + 100;
    }

    // 2. ZONA LOGO: Calculem les coordenades exactes del logo a la pantalla
    if (logo) {
        const rectLogo = logo.getBoundingClientRect();
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const scrollLeft = window.scrollX || document.documentElement.scrollLeft;

        // Guardem els 4 costats del logo afegint un petit marge extra de 30px perquè cap flor s'hi acosti
        caixaLogo = {
            xMin: rectLogo.left + scrollLeft - 30,
            xMax: rectLogo.right + scrollLeft + 30,
            yMin: rectLogo.top + scrollTop - 30,
            yMax: rectLogo.bottom + scrollTop + 30
        };
    }
}

ajustarPantalla();
window.addEventListener('resize', ajustarPantalla);

// 1. LLISTA DE LES TEVES FLORS
const rutesFlors = [
    'imatges/flor1.png',
    'imatges/flor2.png',
    'imatges/flor3.png',
    'imatges/flor4.png',
    'imatges/flor5.png',
    'imatges/flor6.png',
    'imatges/flor7.png',
    'imatges/flor8.png',
    'imatges/flor9.png',
];

const imatgesFlors = [];
let imatgesCarregades = 0;

rutesFlors.forEach(ruta => {
    const img = new Image();
    img.src = ruta;
    img.onload = () => {
        imatgesFlors.push(img);
        imatgesCarregades++;
        if (imatgesCarregades === rutesFlors.length) {
            iniciarPlujaDeFlors();
        }
    };
});

// 2. CONFIGURACIÓ DE L'ANIMACIÓ
const totalFlors = 150;    
const velocitat = 30; 
let florsDibuixades = 0;

function iniciarPlujaDeFlors() {
    ajustarPantalla();
    
    const interval = setInterval(() => {
        if (florsDibuixades >= totalFlors) {
            clearInterval(interval);
            return;
        }
        dibuixarFlorAleatoria();
        florsDibuixades++;
    }, velocitat);
}

// 3. FUNCIÓ PER DIBUIXAR SENSE TAPAR EL LOGO NI EL TEXT
function dibuixarFlorAleatoria() {
    if (imatgesFlors.length === 0) return;
    
    const florAleatoria = imatgesFlors[Math.floor(Math.random() * imatgesFlors.length)];
    const mida = 60 + Math.random() * 100; 

    let x, y;
    let límitMaxim = llimitTextY - (mida / 2);
    if (límitMaxim <= 100) {
        const portada = document.querySelector('.pantalla-inici');
        límitMaxim = portada ? portada.offsetHeight : window.innerHeight;
    }

    // BUCLE MÀGIC: Tria coordenades a l'atzar i, si cauen a sobre del logo, en torna a triar unes altres
    let intents = 0;
    while (intents < 50) { // Posem un límit d'intents per seguretat
        x = (mida / 2) + Math.random() * (canvas.width - mida);
        y = Math.random() * límitMaxim;

        // Comprovem si els extrems de la flor entren dins de la zona del logo
        const tocaLogoX = (x + mida/2 > caixaLogo.xMin && x - mida/2 < caixaLogo.xMax);
        const tocaLogoY = (y + mida/2 > caixaLogo.yMin && y - mida/2 < caixaLogo.yMax);

        // Si NO està tocant el logo, la posició és bona i sortim del bucle
        if (!(tocaLogoX && tocaLogoY)) {
            break;
        }
        intents++;
    }

    const angle = Math.random() * Math.PI * 2;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.drawImage(florAleatoria, -mida / 2, -mida / 2, mida, mida);
    ctx.restore();
}