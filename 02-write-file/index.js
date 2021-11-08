const fs = require('fs');
const path = require('path');

const {stdout, stdin} = process;

stdout.write('Введите текст...\n')

const outputStream = fs.createWriteStream(path.join(__dirname, 'writeFile.txt'));

stdin.on('data' , chunk => {
    if (chunk.toString() == 'exit\n') { //выход при вводе слова exit
        process.exit();
    }
    outputStream.write(chunk);
});

process.on('SIGINT' , ()=>{ //выход при комбинации клавиш CTRL+C
    process.exit();
})


stdin.on('error', error => console.log('Error', error.message));
process.on('exit', () => console.log('\nДо свидания!'));