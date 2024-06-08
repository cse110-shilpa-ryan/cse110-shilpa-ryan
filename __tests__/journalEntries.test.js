import { jest } from '@jest/globals';
import { createEntry, updateTitle } from '../assets/src/journal/updateJournal';
import { getEntries } from '../assets/src/journal/updateJournal';

jest.mock('../assets/src/journal/updateJournal');

// Create
describe('createEntry', () => {
  let entry, newEntry;

  beforeEach(() => {
    entry = 'Test Entry';
    newEntry = createEntry(entry);
  });

  test('should create a new journal entry with the correct content', () => {
    expect(newEntry.content).toBe(entry);
  });
});

// Read

// Update
describe('updateTitle', () => {
  let id, newTitle;

  beforeEach(() => {
    id = 1;
    newTitle = 'New Title';
    getEntries.mockReturnValue([{ id: 1, title: 'Old Title', content: 'Content 1' }]);
    updateTitle(id, newTitle);
  });

  test('should update the title of the journal entry', () => {
    const entries = getEntries();
    const updatedEntry = entries.find(entry => entry.id === id);
    expect(updatedEntry.title).toBe(newTitle);
  });
});

// Delete
