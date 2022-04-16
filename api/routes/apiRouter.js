const express = require('express');
const apiRouter = express.Router();
const path = require('path');
const { nanoid } = require('nanoid');
const http = require('http-status-codes');

const endpoint = '/';
const version = 'v0';
const maxShortenerUrl = 6;
const database = require('../../db/database');

/**
 * Presenter
 */
apiRouter.get('/', (req, res) => {
    res.sendFile(path.resolve('public/index.html'));
});

apiRouter.get(`${endpoint}api/${version}/generateid`, async (req, res) => {
    const shortenerUniqueID = await generateUniqueID();
    if (shortenerUniqueID !== '-1') {
        const shortenedData = {
            shortened_url: shortenerUniqueID
        }
        res.status(http.StatusCodes.OK).json(shortenedData);
    } else {
        res.status(http.StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Error generating a new URL. Try again later." });
    }
});

async function generateUniqueID() {
    let shortenedUniqueID = nanoid(maxShortenerUrl);
    await database.findAllShortenedUrls()
        .then(shortenedUniqueIDs => {
            let duplicated = shortenedUniqueIDs.filter(id => id.shortened_url === shortenedUniqueID);
            while (duplicated.length !== 0) {
                console.log(`ID ${shortenedUniqueID} is duplicated. Generating another one..`);
                shortenedUniqueID = nanoid(maxShortenerUrl);
                duplicated = shortenedUniqueIDs.filter(id => id.shortened_url === shortenedUniqueID);
            }
        })
        .catch(err => {
            shortenedUniqueID = '-1';
        });
    return shortenedUniqueID;
}

module.exports = apiRouter;