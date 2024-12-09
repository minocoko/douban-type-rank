import fs from 'node:fs';
import path from 'node:path';
import { globSync } from 'glob';
import { Movie } from '.';

const fileNames: { name: string, path: string, year: string }[] = [];
globSync([
    `//wsl.localhost/Ubuntu-20.04/data/剧情片/**/**/*.m4v`,
    `//wsl.localhost/Ubuntu-20.04/data/剧情片/**/**/*.avi`,
    `//wsl.localhost/Ubuntu-20.04/data/剧情片/**/**/*.mkv`,
    `//wsl.localhost/Ubuntu-20.04/data/剧情片/**/**/*.mp4`,
    `//wsl.localhost/Ubuntu-20.04/data/剧情片/**/**/*.rmvb`,
    `//wsl.localhost/Ubuntu-20.04/data/剧情片/**/**/*.flv`,

    `//wsl.localhost/Ubuntu-20.04/data/动画片/**/**/*.m4v`,
    `//wsl.localhost/Ubuntu-20.04/data/动画片/**/**/*.avi`,
    `//wsl.localhost/Ubuntu-20.04/data/动画片/**/**/*.mkv`,
    `//wsl.localhost/Ubuntu-20.04/data/动画片/**/**/*.mp4`,
    `//wsl.localhost/Ubuntu-20.04/data/动画片/**/**/*.rmvb`,
    `//wsl.localhost/Ubuntu-20.04/data/动画片/**/**/*.flv`,

    `//wsl.localhost/Ubuntu-20.04/data/纪录片/**/**/*.m4v`,
    `//wsl.localhost/Ubuntu-20.04/data/纪录片/**/**/*.avi`,
    `//wsl.localhost/Ubuntu-20.04/data/纪录片/**/**/*.mkv`,
    `//wsl.localhost/Ubuntu-20.04/data/纪录片/**/**/*.mp4`,
    `//wsl.localhost/Ubuntu-20.04/data/纪录片/**/**/*.rmvb`,
    `//wsl.localhost/Ubuntu-20.04/data/纪录片/**/**/*.flv`,

    `//wsl.localhost/Ubuntu-20.04/data/情色片/**/**/*.m4v`,
    `//wsl.localhost/Ubuntu-20.04/data/情色片/**/**/*.avi`,
    `//wsl.localhost/Ubuntu-20.04/data/情色片/**/**/*.mkv`,
    `//wsl.localhost/Ubuntu-20.04/data/情色片/**/**/*.mp4`,
    `//wsl.localhost/Ubuntu-20.04/data/情色片/**/**/*.rmvb`,
    `//wsl.localhost/Ubuntu-20.04/data/情色片/**/**/*.flv`,
]).forEach((moviefile) => {
    const relativeFileName = moviefile.replace('\\\\WSL.LOCALHOST\\UBUNTU-20.04\\data\\剧情片\\', '')
        .replace('\\\\WSL.LOCALHOST\\UBUNTU-20.04\\data\\动画片\\', '')
        .replace('\\\\WSL.LOCALHOST\\UBUNTU-20.04\\data\\纪录片\\', '')
        .replace('\\\\WSL.LOCALHOST\\UBUNTU-20.04\\data\\情色片\\', '');
    // const extName = path.extname(moviefile);
    // if(!extNames.includes(extName))
    const yearMatch = relativeFileName.match(/(\d{4})\./);
    const year = yearMatch && yearMatch[1] || '';
    let name = relativeFileName.replace(/(.*?)\..*/, '$1');
    if (name.includes('\\')) {
        name = name.substring(name.lastIndexOf('\\') + 1);
    }
    if(!name && relativeFileName.includes('/')){
        name = relativeFileName.substring(0, relativeFileName.indexOf('/'))
    }
    // const name = nameMatch ? (nameMatch[1] || '') : '';
    fileNames.push({ name, path: moviefile, year, });
});
fs.writeFileSync(`./downloaded.txt`, JSON.stringify(fileNames, null, 2), { encoding: 'utf-8' });

const errorNames: { name: string, path: string, year: string }[] = [];
const content = fs.readFileSync('movies/剧情片.json', { encoding: 'utf-8' });
const movies = JSON.parse(content) as Movie[];
movies.forEach((movie) => {
    if (movie.downloaded === undefined) {
        const names = fileNames.filter((fn) => fn.name === movie.name);
        if (names.length === 1) {
            movie.downloaded = true;
        } else if (names.length > 1) {
            // console.log(movie.name, movie.year, names.map((n) => n.year))
            if (names.filter((n) => +n.year == movie.year).length === 1) {
                movie.downloaded = true;
            } else {
                // console.log(movie, names.filter((n) => +n.year == movie.year))
                errorNames.push({ name: movie.name, path: '', year: String(movie.year) });
            }
        } else {
            errorNames.push({ name: movie.name, path: '', year: String(movie.year) });
        }
    } else if (movie.downloaded === false) {
        errorNames.push({ name: movie.name, path: '', year: String(movie.year) });
    }
});
fs.writeFileSync(`./movies/剧情片.json`, JSON.stringify(movies, null, 2), { encoding: 'utf-8' });
fs.writeFileSync(`./movies/剧情片-errors.json`, JSON.stringify(errorNames, null, 2), { encoding: 'utf-8' });

