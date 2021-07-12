const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.resolve(__dirname, '../entry.html'), 'utf8');
global.fetch = require('jest-fetch-mock'); //use this to test fetching gifs and making requests to backend
let myFuns;

describe('entry.html', () => {
    beforeAll(() => {
        document.documentElement.innerHTML = html.toString();
        myFuns = require('../entry.js');
    })

    beforeEach(() => { 
        fetch.resetMocks() 
    })

    test('postComment calls fetch', async() => {
        await myFuns.postComment({
            preventDefault: () => {},
            target: {comment: {value: 'test'}}
        });
        expect(fetch).toHaveBeenCalled()
    })

    test('getJournalWithId calls fetch', async() => {
        await myFuns.getJournalWithId();
        expect(fetch).toHaveBeenCalled()
    })

    test('createComment makes new comment container', () => {
        const commentContainer = document.getElementById("comments-container");
        myFuns.createComment('hello new comment');
        expect(commentContainer.innerHTML).toContain('hello new comment');
    })

    test('interaction bar renders', () => {
        const dateElement = document.getElementById("date");
        myFuns.renderInteractionBar();
        expect(dateElement.textContent).toNotequal("");
    })

    test("increment count runs", () => {
        myFuns.incrementCount("smile");
        myFuns.incrementCount("laugh");
        myFuns.incrementCount("unhappy");
        expect(1).toBe(1);
    })

    test("change innerHTML increments the number inside by 1", () => {
        let element = document.createElement('div');
        element.innerHTML = 'some text 10';
        myFuns.changeInnerHTML(element);
        expect(element.innerHTML).toBe('some text11');
    })

    test("sendEmojiUpdate makes request to backend", () => {
        myFuns.sendEmojiUpdate([1,2,4]);
        expect(fetch).toHaveBeenCalled();
    })


})