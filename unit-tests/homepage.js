import { jest } from '@jest/globals';
import { getRecentJournals, getJournalDays, dayAbbreviation } from '../assets/src/front-page/journal';

jest.mock('../assets/src/front-page/journal');

describe('dayAbbreviation', () => {
    let testIndex1, testIndex2;
    beforeEach(() => {
        testIndex1 = 0;
        testIndex2 = 3;
    });
    test('should return 2 letter abbreviation of Sunday', () => {
        const result = dayAbbreviation(testIndex1);
        expect(result).toEqual("Su");
    });
    test('should return 1 letter abbreviation of Wednesday', () => {
        const result = dayAbbreviation(testIndex2);
        expect(result).toEqual("W");
    });
});

//Test recentJournals and journalDays on mock journal localStorage
describe("testRecentJournalsAndJournalDays", () => {
    let testJournals, numDays1, numDays2;
    beforeEach(() => {
        numDays1 = 3;
        numDays2 = 7;
        let id1 = new Date();
        let id2 = new Date();
        id1.setDate(id1.getDate() - 1);
        id2.setDate(id2.getDate() - 5);
        testJournals = [
            { id: id1.valueOf, title: 'Journal 1', content: 'Content 1' },
            { id: id2.valueOf, title: 'Journal 1', content: 'Content 2' },
        ];
    });

    test('should filter one test journal and return one  testjournal', () => {
        const result = getRecentJournals(testJournals, numDays1);
        expect(result).toEqual(testJournals[0]);
    });

    test('should return both test journals', () => {
        const result = getRecentJournals(testJournals, numDays2);
        expect(result).toEqual(testJournals);
    });

    test('should return two days of seven that have recorded journals', () => {
        const result = getJournalDays(testJournals, numDays2);
        let trueCounter = 0;
        let falseCounter = 0;
        result.forEach(day => {
            if (day[0])
                trueCounter++;
            else
                falseCounter++;
        });
        expect(trueCounter).toEqual(2);
        expect(falseCounter).toEqual(5);
    });
});