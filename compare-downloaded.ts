import fs from 'node:fs';
import path from 'node:path';
import { globSync } from 'glob';
import { Movie } from '.';

const moviesDirectory = 'movies'
const moviefiles = globSync([`./${moviesDirectory}/*.json`]);
const allMovies: Movie[] = [];
moviefiles.forEach((moviefile) => {
    try {
        const fileContent = fs.readFileSync(moviefile, { encoding: 'utf-8' });
        // console.log('fileContent', fileContent, moviefile)
        const movies = JSON.parse(fileContent) as Movie[];
        movies.forEach((m) => {
            const movie = allMovies.find((lm) => m.name === lm.name && m.crew === lm.crew)
            if (!movie) {
                allMovies.push(m)
            }
        })
    } catch (e) {
        console.error(e, moviefile);
    }
})

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
    if (!name && relativeFileName.includes('/')) {
        name = relativeFileName.substring(0, relativeFileName.indexOf('/'))
    }
    // const name = nameMatch ? (nameMatch[1] || '') : '';
    fileNames.push({ name, path: moviefile, year, });
});

const downloadMovies: Movie[] = [];
globSync([
    `//wsl.localhost/Ubuntu-20.04/data/未归类视频/**/**/*.m4v`,
    `//wsl.localhost/Ubuntu-20.04/data/未归类视频/**/**/*.avi`,
    `//wsl.localhost/Ubuntu-20.04/data/未归类视频/**/**/*.mkv`,
    `//wsl.localhost/Ubuntu-20.04/data/未归类视频/**/**/*.mp4`,
    `//wsl.localhost/Ubuntu-20.04/data/未归类视频/**/**/*.rmvb`,
    `//wsl.localhost/Ubuntu-20.04/data/未归类视频/**/**/*.flv`,
]).forEach((moviefile) => {
    const relativeFileName = moviefile.replace('\\\\WSL.LOCALHOST\\UBUNTU-20.04\\data\\未归类视频\\', '')
    // .replace('\\\\WSL.LOCALHOST\\UBUNTU-20.04\\data\\动画片\\', '')
    // .replace('\\\\WSL.LOCALHOST\\UBUNTU-20.04\\data\\纪录片\\', '')
    // .replace('\\\\WSL.LOCALHOST\\UBUNTU-20.04\\data\\情色片\\', '');
    // const extName = path.extname(moviefile);
    // if(!extNames.includes(extName))
    const yearMatch = relativeFileName.match(/(\d{4})\./);
    const year = yearMatch && yearMatch[1] || '';
    let name = relativeFileName.replace(/(.*?)\..*/, '$1');
    if (name.includes('\\')) {
        name = name.substring(name.lastIndexOf('\\') + 1);
    }
    if (!name && relativeFileName.includes('/')) {
        name = relativeFileName.substring(0, relativeFileName.indexOf('/'))
    }

    // const name = nameMatch ? (nameMatch[1] || '') : '';
    // fileNames.push({ name, path: moviefile, year, });
    const movie = fileNames.find((fn) => fn.name === name && fn.year === year);
    if (movie) {
        // both downloaded
        console.log('exists downloaded movie', movie);
        fs.rmSync(moviefile);
    } else {
        // only downloaded 未归类视频
        const downloadMovie = allMovies.find((lm) => lm.name === name && lm.year === +year)
        if (downloadMovie) {
            // console.log(downloadMovie)
            downloadMovies.push(downloadMovie);
        }
        const destFile = moviefile.replace('未归类视频', '剧情片');
        const dirName = path.dirname(destFile);
        if (!fs.existsSync(dirName)) {
            fs.mkdirSync(dirName, { recursive: true })
        }

        // console.log('moviefile, destName', moviefile, destFile)
        // fs.renameSync(moviefile, destFile)
    }
});

console.log('downloadMovies', downloadMovies.length)
// fs.writeFileSync('./downloaded-movies.json', JSON.stringify(downloadMovies, undefined, 2), { encoding: 'utf-8' });
// downloadMovies.forEach((dm) => {
//     const miscs = dm.misc.split(' / ');
//     miscs.forEach((mc) => {
//         const moviefiles = globSync([`./${moviesDirectory}/${mc}片.json`]);
//         if (moviefiles.length === 1) {
//             const fileContent = fs.readFileSync(moviefiles[0], { encoding: 'utf-8' });
//             // console.log('fileContent', fileContent, moviefile)
//             const movies = JSON.parse(fileContent) as Movie[];
//             const movie = movies.find((m) => m.name === dm.name && m.year === dm.year)
//             if (movie) {
//                 movie.downloaded = true;
//             }

//             fs.writeFileSync(moviefiles[0], JSON.stringify(movies, undefined, 2), { encoding: 'utf-8' });
//         }
//     })
// })
