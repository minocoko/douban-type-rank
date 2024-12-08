import fs from 'node:fs';
import path from 'node:path';
import { globSync } from 'glob';

/**
 * @typedef Movie
 * @type {object}
 * @property {string} name
 * @property {number} rating
 * @property {number} rank
 * @property {string} comment
 * @property {string} crew
 * @property {number} year
 * @property {string} misc
 * @property {boolean|undefined} downloaded
 */

const moviesDirectory = 'movies'
const movieTypeName = '剧情片'

const [, , name, crew] = process.argv;

const moviefiles = globSync([`./${moviesDirectory}/*.json`]);

/**
 * 
 * @param {(value: Movie, index: number, array: Movie[]) => Movie} predicate 
 */
const updateMovieFile = (predicate) => {
    moviefiles.forEach((moviefile) => {
        const fileName = path.basename(moviefile, ".json");
        if (fileName !== movieTypeName) {
            /**
             * @type {Movie[]}
             */
            const movies = JSON.parse(fs.readFileSync(moviefile, { encoding: 'utf-8' }));
            const filtedMovies = movies.filter(predicate);
            if (filtedMovies.length === 1 && !filtedMovies[0].downloaded) {
                filtedMovies.forEach((m) => {
                    m.downloaded = true;
                });

                fs.writeFileSync(moviefile, JSON.stringify(movies, null, 4), { encoding: 'utf-8' });
                console.log(`${moviefile} updated.`)
            } else if (filtedMovies.length > 1) {
                console.error(`查询到有多个视频需要更新，请核对！${moviefile} ${name} ${crew}`);
                process.exit(1);
            }
        }
    });
}

const clearnMovieDownloaded = () => {
    moviefiles.forEach((moviefile) => {
        const fileName = path.basename(moviefile, ".json");
        if (fileName !== movieTypeName) {
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

const updateMovieFileByIndex = () => {
    // const exclude_movie_names = ['出走的决心']
    const downloadedIndex = 9999;
    /**
     * @type {Movie[]}
     */
    const originMovies = JSON.parse(fs.readFileSync(`./${moviesDirectory}/${movieTypeName}.json`, { encoding: 'utf-8' }));
    moviefiles.forEach((moviefile) => {
        const fileName = path.basename(moviefile, ".json");
        if (fileName !== movieTypeName) {
            /**
             * @type {Movie[]}
             */
            const targetMovies = JSON.parse(fs.readFileSync(moviefile, { encoding: 'utf-8' }));

            for (let index = 0; index < downloadedIndex; index++) {
                const movie = originMovies[downloadedIndex];
                if (movie) {
                    // if (!exclude_movie_names.includes(movie.name)) {
                    targetMovies.filter((m) => m.name === movie.name && m.crew === movie.crew).forEach((movie) => {
                        movie.downloaded = true;
                    })
                    // }
                } else {
                    break;
                }
            }

            fs.writeFileSync(moviefile, JSON.stringify(targetMovies, null, 4), { encoding: 'utf-8' });
            console.log('Done ', moviefile)
        }
    });
}

const removeDuplicatedMovie = () => {
    moviefiles.forEach((moviefile) => {
        const fileName = path.basename(moviefile, ".json");
        if (fileName !== movieTypeName) {
            /**
             * @type {Movie[]}
             */
            const movies = JSON.parse(fs.readFileSync(moviefile, { encoding: 'utf-8' }));
            const output = [];
            const keys = {};
            for (const movie of movies) {
                const key = movie.name + "_" + movie.crew;
                if (!keys[key]) {
                    keys[key] = true;
                    output.push(movie);
                }
            }
            fs.writeFileSync(moviefile, JSON.stringify(output, undefined, 2), { encoding: 'utf-8' });

            console.log('Done ', fileName)
        }
    });
}

if (name) {
    if (!crew) {
        updateMovieFile((m) => m.name === name)
    } else {
        updateMovieFile((m) => m.name === name && m.crew === crew)
    }
} else {
    // clearnMovieDownloaded();
    updateMovieFileByIndex();
    // removeDuplicatedMovie();
}
