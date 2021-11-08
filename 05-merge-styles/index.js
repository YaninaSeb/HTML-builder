const path = require('path');
const fs = require('fs');
const fsPromises = require('fs/promises');

//файл, в который будут записываться данные
const outputStream = fs.createWriteStream(path.join(__dirname, 'project-dist', 'bundle.css'));

//сортировка файлов, которые нужно прочитать 
async function createCSS() {
    try {
        const files =  await fsPromises.readdir(path.join(__dirname, 'styles'), {withFileTypes: true});
        for (const file of files) {
    
            if (file.isFile() && path.extname(file.name)=='.css') { //проверка, что это файл с расширением css, а не папка

                const readStream = fs.createReadStream(path.join(__dirname, 'styles', `${file.name}`), 'utf-8'); //файл, из которого будем читать
                readStream.on('data', (chunk) => {
                    outputStream.write(chunk + '\n');        
                });
            }
        }
      } catch (err) {
        console.log(err);
      }
    }
createCSS();