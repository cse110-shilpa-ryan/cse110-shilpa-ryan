import { jest } from '@jest/globals';
import { createEntry, updateTitle, deleteEntry, getEntries } from '../assets/src/journal/updateJournal';

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
describe('getEntries', () => {
  let entries;

  beforeEach(() => {
    entries = [
      { id: 1, title: 'Title 1', content: 'Content 1' },
      { id: 2, title: 'Title 2', content: 'Content 2' },
    ];
    getEntries.mockReturnValue(entries);
  });

  test('should fetch all journal entries', () => {
    const fetchedEntries = getEntries();
    expect(fetchedEntries).toEqual(entries);
  });
});

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
describe('deleteEntry', () => {
  let id, deleted;

  beforeEach(() => {
    id = 1;
    getEntries.mockReturnValue([{ id: 1, title: 'Title 1', content: 'Content 1' }]);
    deleted = deleteEntry(id);
  });

  test('should delete the journal entry with the specified id', () => {
    const entries = getEntries();
    const deletedEntry = entries.find(entry => entry.id === id);
    expect(deletedEntry).toBeUndefined();
    expect(deleted.id).toBe(id);
  });
});
