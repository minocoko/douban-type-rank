import fs from 'node:fs';
import path from 'node:path';
import { globSync } from 'glob';
import { Movie } from '.';

const moviesDirectory = 'movies'
const movieTypeNames = ['剧情片', '喜剧片']

const [, , name, crew] = process.argv;

const moviefiles = globSync([`./${moviesDirectory}/*.json`]);

// const updateMovieFile = (predicate) => {
//     moviefiles.forEach((moviefile) => {
//         const fileName = path.basename(moviefile, ".json");
//         if (fileName !== movieTypeName) {
//             /**
//              * @type {Movie[]}
//              */
//             const movies = JSON.parse(fs.readFileSync(moviefile, { encoding: 'utf-8' }));
//             const filtedMovies = movies.filter(predicate);
//             if (filtedMovies.length === 1 && !filtedMovies[0].downloaded) {
//                 filtedMovies.forEach((m) => {
//                     m.downloaded = true;
//                 });

//                 fs.writeFileSync(moviefile, JSON.stringify(movies, null, 4), { encoding: 'utf-8' });
//                 console.log(`${moviefile} updated.`)
//             } else if (filtedMovies.length > 1) {
//                 console.error(`查询到有多个视频需要更新，请核对！${moviefile} ${name} ${crew}`);
//                 process.exit(1);
//             }
//         }
//     });
// }

const clearnMovieDownloaded = () => {
    moviefiles.forEach((moviefile) => {
        const fileName = path.basename(moviefile, ".json");
        if (!movieTypeNames.includes(fileName)) {
            /**
             * @type {Movie[]}
             */
            const movies = JSON.parse(fs.readFileSync(moviefile, { encoding: 'utf-8' }));
            movies.forEach((movie) => {
                movie.downloaded = undefined;
            });
            fs.writeFileSync(moviefile, JSON.stringify(movies, null, 4), { encoding: 'utf-8' });
        }
    });
}

const updateMovieFile = () => {
    // const exclude_movie_names = ['出走的决心']
    // const downloadedIndex = 9999;

    const allDownloadedMovies: Movie[] = [];

    movieTypeNames.forEach((movieTypeName) => {
        const movies = JSON.parse(fs.readFileSync(`./${moviesDirectory}/${movieTypeName}.json`, { encoding: 'utf-8' })) as Movie[];
        
        movies.filter((m) => !!m.downloaded).forEach((m) => {
            if (!allDownloadedMovies.find((om) => om.name === m.name && om.crew === m.crew)) {
                allDownloadedMovies.push(m);
            }
        })

        console.log(`./${moviesDirectory}/${movieTypeName}.json`, movies.length, allDownloadedMovies.length)
    });

    moviefiles.forEach((moviefile) => {
        const fileName = path.basename(moviefile, ".json");
        if (!movieTypeNames.includes(fileName)) {

            const targetMovies = JSON.parse(fs.readFileSync(moviefile, { encoding: 'utf-8' })) as Movie[];
            targetMovies.filter((m) => !m.downloaded).forEach((m) => {
                if (allDownloadedMovies.find((om) => om.name === m.name && om.crew === m.crew)) {
                    m.downloaded = true;
                }
            });

            // for (let index = 0; index < downloadedIndex; index++) {
            // const movie = originMovies[downloadedIndex];
            // const movie = originMovies.find((om) => om.name === m.name && om.crew === m.crew)
            // if (movie) {
            //     // if (!exclude_movie_names.includes(movie.name)) {
            //     targetMovies.filter((m) => m.name === movie.name && m.crew === movie.crew).forEach((movie) => {
            //         movie.downloaded = true;
            //     })
            //     // }
            // }
            // }

            fs.writeFileSync(moviefile, JSON.stringify(targetMovies, null, 4), { encoding: 'utf-8' });
            console.log('Done ', moviefile)
        }
    });
}

// const removeDuplicatedMovie = () => {
//     moviefiles.forEach((moviefile) => {
//         const fileName = path.basename(moviefile, ".json");
//         if (fileName !== movieTypeName) {
//             /**
//              * @type {Movie[]}
//              */
//             const movies = JSON.parse(fs.readFileSync(moviefile, { encoding: 'utf-8' }));
//             const output = [];
//             const keys = {};
//             for (const movie of movies) {
//                 const key = movie.name + "_" + movie.crew;
//                 if (!keys[key]) {
//                     keys[key] = true;
//                     output.push(movie);
//                 }
//             }
//             fs.writeFileSync(moviefile, JSON.stringify(output, undefined, 2), { encoding: 'utf-8' });

//             console.log('Done ', fileName)
//         }
//     });
// }

if (name) {
    // if (!crew) {
    //     updateMovieFile((m) => m.name === name)
    // } else {
    //     updateMovieFile((m) => m.name === name && m.crew === crew)
    // }
} else {
    // clearnMovieDownloaded();
    updateMovieFile();
    // removeDuplicatedMovie();
}
