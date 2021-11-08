const { stat } = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');

async function showInfo() {
try {
    const files =  await fsPromises.readdir(path.join(__dirname, 'secret-folder'), {withFileTypes: true});
    for (const file of files) {

        if (file.isFile()) { //проверка, что это файл, а не папка
            const fileInfo = path.parse(file.name); //вся инфа о файле, +!здесь имя файла без расширения
            const fileName = fileInfo.name; //имя файла без расширения
            const fileExtname = (fileInfo.ext).slice(1); //расширение с обрезанием точки
            let size;            

            //получение размера и вывод всей инфы
            stat(path.join(__dirname, 'secret-folder', `${file.name}`), (err, stats) => { 
                if(err) throw err;
                size = stats.size + 'b';

                console.log(fileName + " - "+ fileExtname + " - " + size)
              });
        }
    }
  } catch (err) {
    console.error(err);
  }
}
showInfo();