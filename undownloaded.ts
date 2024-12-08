import fs from 'node:fs';
import path from 'node:path';
import { globSync } from 'glob';

import { Movie } from './update-download-status.mjs';

globSync([`movies/*-undownloaded.json`]).forEach((moviefile) => {
    fs.rmSync(moviefile);
})

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
