const fs = require('fs');
const path = './data/equipamentos.json';
const path2 = './data/cromos.json';

function names(obj, caminho = []) {
    let nomes = [];
    if (Array.isArray(obj)) {
        obj.forEach((item, idx) => {
            nomes = nomes.concat(names(item, caminho.concat(`[${idx}]`)));
        });
    } else if (typeof obj === 'object' && obj !== null) {
        for (const key in obj) {
            if (key === 'name') {
                const valor = obj[key];
                if (typeof valor === 'string') {
                    nomes.push({ caminho: caminho.concat([key]).join('.'), valor });
                }
            } else {
                nomes = nomes.concat(names(obj[key], caminho.concat([key])));
            }
        }
    }
    return nomes;
}


const data = JSON.parse(fs.readFileSync(path, 'utf8'));
const nomes = names(data);
console.log('Nomes dos cromos:', nomes);
console.log('Campos HL numéricos convertidos para string.');