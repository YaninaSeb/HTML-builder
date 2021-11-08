const path = require('path');
const fsPromises = require('fs/promises');


//проверка, существует ли папка. Если нет, то создать
async function createDir() {
    try {    
        await fsPromises.mkdir(path.join(__dirname, 'files-copy'), { recursive: true });
    } catch (err) {
      console.log(err);
    }
}
createDir();

  //читаем содержимое папки и копируем все в другую папку
async function copyDir() {
    try {

        //сперва удаляем все содержимое папки-копии   
        const filesRem =  await fsPromises.readdir(path.join(__dirname, 'files-copy'));
        for (file  of filesRem) {         
            await fsPromises.rm(path.join(__dirname, 'files-copy', `${file}`), { recursive: true, force: true });
        } 

        //копируем каждый файл в папку-копию
        const files =  await fsPromises.readdir(path.join(__dirname, 'files'));
        for (file  of files) {
            await fsPromises.copyFile(path.join(__dirname, 'files', `${file}`), path.join(__dirname, 'files-copy', `${file}`));
        }
    } catch (err) {
        console.error(err);
    }
} 
copyDir();
