const path = require('path');
const fs = require('fs');
const fsPromises = require('fs/promises');


//создание папки project-dist
async function createDir() {
    try {    
        await fsPromises.mkdir(path.join(__dirname, 'project-dist'), { recursive: true });
    } catch (err) {
      console.log(err);
    }
}
createDir();

//сбор стилей в единый файл project-dist/style.css.
const outputStream = fs.createWriteStream(path.join(__dirname, 'project-dist', 'style.css'));

async function writeFileCSS() { 
    try {
        const files =  await fsPromises.readdir(path.join(__dirname, 'styles'), {withFileTypes: true});
        for (const file of files) {
            if (file.isFile() && path.extname(file.name)=='.css') { //проверка, что это файл с расширением css, а не папка
                const readStream = fs.createReadStream(path.join(__dirname, 'styles', `${file.name}`), 'utf-8'); //файл, из которого будем читать
                readStream.on('data', (chunk) => {
                    outputStream.write(chunk+'\n');        
                });
            }
        }
      } catch (err) {
        console.log(err);
      }}
writeFileCSS();


// создание папки assets в project-dist/assets
async function createDirAssets() {
    try {    
        await fsPromises.mkdir(path.join(__dirname, 'project-dist', 'assets'), { recursive: true });
        await fsPromises.mkdir(path.join(__dirname, 'project-dist', 'assets', 'fonts'), { recursive: true });
        await fsPromises.mkdir(path.join(__dirname, 'project-dist', 'assets', 'img'), { recursive: true });
        await fsPromises.mkdir(path.join(__dirname, 'project-dist', 'assets', 'svg'), { recursive: true });
    } catch (err) {
      console.log(err);
    }
}
createDirAssets();


//читаем содержимое папки assets и копируем все в папку-копию в project-dist/assets
async function copyDirAssets() {
    try {
        const dirAssets =  await fsPromises.readdir(path.join(__dirname, 'assets'));
        for (folders  of dirAssets) { 
            if(folders != '.DS_Store'){ //!!!эта проверка, т.к. у меня возникает какой-то скрытый файл .DS_Store
            const filesInFolder =  await fsPromises.readdir(path.join(__dirname, 'assets', folders), {force: true});

            for (fileOne  of filesInFolder) {
                  await fsPromises.copyFile(path.join(__dirname, 'assets', folders, fileOne), path.join(__dirname, 'project-dist', 'assets', folders, fileOne) );
                }
            }
        }
    } catch (err) {
        console.error(err);
    }
}   
copyDirAssets();


//читаем рзаметку, меняем теги на содержимое и все записываем в новый файл index.html
async function createFileIndex() {
    try {       
      const filesHTML =  await fsPromises.readdir(path.join(__dirname, 'components'), {force: true} ); 
  
      const readStreamIndex = fs.createReadStream(path.join(__dirname, 'template.html'), 'utf-8');
      
      let fullChunk='';
      readStreamIndex.on('data', (chunk) => {
        fullChunk += chunk;
       })

      readStreamIndex.on('end', () => {

            for (const fileHTML of filesHTML) {
                if (path.extname(fileHTML) == '.html') { 
                const nameFileHtml = fileHTML.slice(0, fileHTML.length-5);
              
                //замена тегов на их содержимое
            if (fullChunk.includes(`${nameFileHtml}`)) {
                const readOneFileHTML = fs.createReadStream(path.join(__dirname, 'components', fileHTML), 'utf-8');
                    let string='';
     
                    readOneFileHTML.on('data', (data) => {
                        string = string + data; 
                    });

                    readOneFileHTML.on('end', () => {
                        fullChunk = fullChunk.replace(`{{${nameFileHtml}}}`, string);

                        fsPromises.writeFile(path.join(__dirname, 'project-dist', 'index.html'), fullChunk, 'utf-8');
                    })     
            }
      }
    }})
    } catch (err) {
        console.log(err);
    }
}
createFileIndex()