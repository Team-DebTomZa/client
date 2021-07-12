const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.resolve(__dirname, '../home.html'), 'utf8');
global.fetch = require('jest-fetch-mock'); //use this to test fetching gifs and making requests to backend
let myFuns;
let journals;

describe('home.html', () => {
    beforeAll(() => {
        document.documentElement.innerHTML = html.toString();
        myFuns = require('../home.js');
    })

    beforeEach(() => { 
        fetch.resetMocks() 
        journals = [
            {comments: [1,2,3,4,5]},
            {comments: [1,2,3,4,5,6,7,8]},
        ];
    })


    test('getRandomGif makes a fetch call to the giphy api', async () => {
        const gifSearch = {value: 'funny'};
        await myFuns.getRandomGif();
        expect(fetch).toHaveBeenCalled()
    })

    test('revealForm sets form display to block', () => {
        const form =  document.querySelector(".new-post-form");
        myFuns.revealForm();
        expect(form.style.display).toEqual('block');
    })

    test('hideForm sets form display to none', () => {
        const form =  document.querySelector(".new-post-form");
        myFuns.hideForm();
        expect(form.style.display).toEqual('none');
    })

    test('sendForm makes a fetch call to the backend', async () => {
        await myFuns.sendForm({
            preventDefault: () => {},
            target: {title: {value: 'test'}}
        });
        expect(fetch).toHaveBeenCalled()
    })

    test('getJournalData calls fetch with the backend url passed to it', async () => {
        await myFuns.getJournalData()
        expect(fetch).toHaveBeenCalledWith("https://debtomza-server.herokuapp.com/journals");
    })

    test('appendBody makes a fetch call', async () => {
        await myFuns.appendBody()
        expect(fetch).toHaveBeenCalled();
    })

    test('createJournal makes a div with a header element', () => {
        let item = {
            id: 1,
            title: 'test',
            date: 'tuesday',
            comments: [1,2,3,4],
            emojis: [0,0,0]
        }
        myFuns.createJournal(item);
        let journalsContainer = document.querySelector("#journals");
        expect(journalsContainer.innerHTML).toContain('h2');
        
    });

    test('sortResults when passed comments sorts journals by number of comments', () => {
        
        let dummyEvent = {
            preventDefault: () => {},
            target: {sort:  "comments"}
        }
        myFuns.sortResults(dummyEvent);
        expect(journals[0].comments.length).toBe(5);
    })

    test('filterResults filters the results according to requirement', () => {
        
        let dummyEvent = {
            preventDefault: () => {},
            target: {search: {value: "comments"}}
        }
        myFuns.filterResults(dummyEvent);
        expect(journals.length).toBe(0);
    })

})