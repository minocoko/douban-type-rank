import fs from 'node:fs';
import path from 'node:path';
import { globSync } from 'glob';
import { Movie } from '.';

// globSync([`movies/*-undownloaded.json`]).forEach((moviefile) => {
//     fs.rmSync(moviefile);
// })

const content = fs.readFileSync('movies/剧情片.json', { encoding: 'utf-8' });
const movies = JSON.parse(content) as Movie[];
const undownloadedContent = fs.readFileSync(`./undownloaded.json`, { encoding: 'utf-8' });
const undownloadedMovices = JSON.parse(undownloadedContent) as Movie[];
undownloadedMovices.forEach((movie) => {
    const m = movies.find((m)=>m.name === movie.name && m.crew === movie.crew);
    if(m && m.downloaded === undefined){
        m.downloaded = false;
    }
});
const newContent = JSON.stringify(movies, null, 2);
fs.writeFileSync(`./movies/剧情片.json`, newContent, { encoding: 'utf-8' });

// const moviefiles = globSync([`movies/!(*-undownloaded|剧情片).json`]);
// moviefiles.forEach((moviefile) => {
//     const fileName = path.basename(moviefile, '.json');
//     const content = fs.readFileSync(moviefile, { encoding: 'utf-8' });
//     const movies = JSON.parse(content) as Movie[];
//     const undownloadedMovies = movies.filter((m) => !m.downloaded);
//     if (undownloadedMovies.length) {
//         const newContent = JSON.stringify(undownloadedMovies, null, 2);
//         fs.writeFileSync(`./movies/${fileName}-undownloaded.json`, newContent, { encoding: 'utf-8' });
//     }
// })
