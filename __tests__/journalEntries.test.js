import { jest } from '@jest/globals';
import { createEntry, updateTitle, deleteEntry, getEntries, saveEntries, updateContent } from '../assets/src/journal/updateJournal';

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

// Update Title
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

// Update Content
describe('updateContent', () => {
  let id, newContent;

  beforeEach(() => {
    id = 1;
    newContent = 'Updated Content';
    getEntries.mockReturnValue([{ id: 1, title: 'Title', content: 'Old Content' }]);
    updateContent(id, newContent);
  });

  test('should update the content of the journal entry', () => {
    const entries = getEntries();
    const updatedEntry = entries.find(entry => entry.id === id);
    expect(updatedEntry.content).toBe(newContent);
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

// Save Entries
describe('saveEntries', () => {
  let entries;

  beforeEach(() => {
    entries = [
      { id: 1, title: 'Title 1', content: 'Content 1' },
      { id: 2, title: 'Title 2', content: 'Content 2' },
    ];
    localStorage.setItem = jest.fn();
    saveEntries(entries);
  });

  test('should save all journal entries to localStorage', () => {
    expect(localStorage.setItem).toHaveBeenCalledWith('journalEntries', JSON.stringify(entries));
  });
});

