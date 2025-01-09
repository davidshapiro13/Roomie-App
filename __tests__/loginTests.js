// Disabled because not working right and not very useful since not testing Firebase anyway
// Dec 21 2024


import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, getDoc, addDoc, updateDoc, doc } from 'firebase/firestore';
import { addData } from "../app/Database"

jest.mock('firebase/app', () => ({
    initializeApp: jest.fn(),
  }));

jest.mock('firebase/firestore', () => ({
    collection: jest.fn(),
    addDoc: jest.fn(),
    getFirestore: jest.fn(),
}));



describe('addData', () => {
    const mockPath = "testPath";
    const mockData = { name: "Test" }
    const mockDatabase = {};

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("add data and return id", async () => {
      const mockDocRef = { id: 'testID'}
      const mockColRef = {};
      collection.mockReturnValue(mockColRef)
      addDoc.mockResolvedValue(mockDocRef)
      
      const result = await addData(mockDatabase, mockPath, mockData)

      expect(collection).toHaveBeenCalledWith(mockDatabase, mockPath)
      expect(addDoc).toHaveBeenCalledWith(mockColRef, mockData)
      expect(result).toBe("testID")
    })
})
