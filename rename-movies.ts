import fs from 'node:fs';
import path from 'node:path';
import { globSync } from 'glob';
import { Movie } from '.';

const moviesDirectory = 'movies'
const movieTypeNames = ['情色片','动画片', '记录片']

const allMovies: { [key: string]: Movie[] } = {};
movieTypeNames.forEach((movieTypeName) => {
    allMovies[movieTypeName] = [];

    const movies = JSON.parse(fs.readFileSync(`./${moviesDirectory}/${movieTypeName}.json`, { encoding: 'utf-8' })) as Movie[];
    movies.forEach((m) => {
        if (!allMovies[movieTypeName].find((om) => om.name === m.name && om.crew === m.crew)) {
            allMovies[movieTypeName].push(m);
        }
    })
})

globSync([
    `//wsl.localhost/Ubuntu-20.04/data/剧情片/**/**/*.m4v`,
    `//wsl.localhost/Ubuntu-20.04/data/剧情片/**/**/*.avi`,
    `//wsl.localhost/Ubuntu-20.04/data/剧情片/**/**/*.mkv`,
    `//wsl.localhost/Ubuntu-20.04/data/剧情片/**/**/*.mp4`,
    `//wsl.localhost/Ubuntu-20.04/data/剧情片/**/**/*.rmvb`,
    `//wsl.localhost/Ubuntu-20.04/data/剧情片/**/**/*.flv`,
]).forEach((moviefile) => {
    const relativeFileName = moviefile.replace('\\\\WSL.LOCALHOST\\UBUNTU-20.04\\data\\剧情片\\', '')

    const yearMatch = relativeFileName.match(/(\d{4})\./);
    const year = yearMatch && yearMatch[1] || '';
    let name = relativeFileName.replace(/(.*?)\..*/, '$1');
    if (name.includes('\\')) {
        name = name.substring(name.lastIndexOf('\\') + 1);
    }
    if (!name && relativeFileName.includes('/')) {
        name = relativeFileName.substring(0, relativeFileName.indexOf('/'))
    }

    movieTypeNames.forEach((movieTypeName) => {
        const movie = allMovies[movieTypeName].find((m) => m.name === name && m.year === +year);
        if (movie) {
            // console.log(movie)
            const destName = moviefile.replace('剧情片', movieTypeName);
            const dirName = path.dirname(destName);

            console.log('moviefile, destName', moviefile, destName)
            try {
                if (!fs.existsSync(dirName)) {
                    fs.mkdirSync(dirName, { recursive: true })
                }
                fs.renameSync(moviefile, destName);
            } catch (e) {
                console.log(e)
            }
        }
    });
});

// console.log(allMovies.filter((m)=>m.misc.includes('/ 情色') ))
