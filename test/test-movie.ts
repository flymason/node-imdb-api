import mocha = require('mocha');
let assert = require('chai').assert;
import imdb = require('../lib/imdb.js');

const orig_movie = {
    Title: "Foo",
    Year: "1996",
    Rated: "R",
    Released: "1 May 2001",
    Runtime: "5 min",
    Genre: "rom com",
    Director: "Tilde Swinton",
    Writer: "Tilde Swinton",
    Actors: "John, Larry, Curly",
    Plot: "It good",
    Language: "Spanish",
    Country: "USA",
    Awards: "Lots",
    Poster: "www.google.com",
    Metascore: "5.6",
    imdbRating: "6.7",
    imdbVotes: "5",
    imdbID: "tt653921",
    Type: "movie",
    Response: "ok"
};

const orig_tv = {
    Title: "Foo",
    Year: "1996-1998",
    Rated: "R",
    Released: "1 May 2001",
    Runtime: "5 min",
    Genre: "rom com",
    Director: "Tilde Swinton",
    Writer: "Tilde Swinton",
    Actors: "John, Larry, Curly",
    Plot: "It good",
    Language: "Spanish",
    Country: "USA",
    Awards: "Lots",
    Poster: "www.google.com",
    Metascore: "5.6",
    imdbRating: "6.7",
    imdbVotes: "5",
    imdbID: "tt653921",
    Type: "tvshow",
    totalSeasons: "5",
    Response: "ok"
};

const orig_episode = {
    Title: "ep 1",
    Released: "6 May 2001",
    Episode: "1",
    Type: "series",
    imdbRating: "5.6",
    imdbID: "tt6539212",
    Year: "2006"
};

describe('Movie', function() {
    it("creates a normal movie", function() {
        const mov = new imdb.Movie(orig_movie);

        assert.isOk(mov, "movie exists");
        assert.deepEqual(mov.title, "Foo", "name is set correctly");
        assert.deepEqual(mov.released, new Date(2001, 4, 1), "Date created correctly");
        assert.deepEqual(mov.rating, 6.7);
        assert.deepEqual(mov.genres, orig_movie.Genre, "Genres set correctly");
        assert.deepEqual(mov.languages, orig_movie.Language, "Language set correctly");
        assert.deepEqual(mov.votes, '5', "votes set correctly");
        assert.deepEqual(mov.series, false, "not a series");
        assert.deepEqual(mov.imdburl, "https://www.imdb.com/title/tt653921", "url formulated correctly");
    });
    it("creates a movie with invalid score", function() {
        const mov = Object.assign(Object.create(orig_movie), {imdbRating: 'foo'});
        assert.throws(() => new imdb.Movie(mov), TypeError);
    });
    it("creates a movie with bad release data", function() {
        const mov = Object.assign(Object.create(orig_movie), {Released: 'foo'});
        assert.throws(() => new imdb.Movie(mov), TypeError);
    });
    it("creates a movie with no year", function() {
        let mov = Object.assign(Object.create(orig_movie));
        delete mov.__proto__.Year;
        delete mov['Year'];
        assert.isNotOk(new imdb.Movie(mov).year);
    });
    it("creates a movie with invalid year", function() {
        const mov = Object.assign(Object.create(orig_movie), {Year: 'foo'});
        assert.throws(() => new imdb.Movie(mov), TypeError);
    });
    it("creates a movie with matching year", function() {
        for (let year of ["2005-2006", "2005-", "2005–2006", "2005–"]) {
            const mov = Object.assign(Object.create(orig_movie), {Year: year});
            assert.isNotOk(new imdb.Movie(mov).year);
        }
    });
});

describe('Series', function() {
    it("creates a series", function() {
        const mov = new imdb.TVShow(orig_tv, { apiKey: "foo" });

        assert.isOk(mov, "movie exists");
        assert.deepEqual(mov.title, "Foo", "name is set correctly");
        assert.deepEqual(mov.released, new Date(2001, 4, 1), "Date created correctly");
        assert.deepEqual(mov.rating, 6.7);
        assert.deepEqual(mov.genres, orig_tv.Genre, "Genres set correctly");
        assert.deepEqual(mov.languages, orig_tv.Language, "Language set correctly");
        assert.deepEqual(mov.votes, '5', "votes set correctly");
        assert.deepEqual(mov.series, true, "deffo a series");
        assert.deepEqual(mov.imdburl, "https://www.imdb.com/title/tt653921", "url formulated correctly");
        assert.deepEqual(mov.start_year, 1996, "test start year");
        assert.deepEqual(mov.end_year, 1998, "end year set correctly");
        assert.deepEqual(mov.totalseasons, 5, "total seasons set correctly");
    });
});

describe('Episode', function() {
    it("creates a basic episode", function() {
        const ep = new imdb.Episode(orig_episode, 1);

        assert.isOk(ep, "ep exists");
        assert.deepEqual(ep.name, "ep 1", "title is set correctly");
        assert.deepEqual(ep.rating, 5.6, "rating set correctly");
        assert.deepEqual(ep.imdbid, "tt6539212", "imdb id set");
        assert.deepEqual(ep.released, new Date(2001, 4, 6), "Date created correctly");
        assert.deepEqual(ep.season, 1, "testing season");
        assert.deepEqual(ep.episode, 1, "testing ep");
        assert.deepEqual(ep.year, 2006, "testing year");
    });
});