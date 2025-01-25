// Disabled because not working right and not very useful since not testing Firebase anyway
// Dec 21 2024


import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, getDoc, addDoc, updateDoc, doc } from 'firebase/firestore';
import { addData, updateData, getData, getDataFromDoc, updateRoomIDStatus, getSavedRoomID, getSavedItem } from "../app/Database"
import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('firebase/app', () => ({
    initializeApp: jest.fn(),
  }));

jest.mock('@react-native-async-storage/async-storage', () => ({
    setItem: jest.fn(),
    getItem: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
    collection: jest.fn(),
    doc: jest.fn(),
    getDocs: jest.fn(),
    getDoc: jest.fn(),
    addDoc: jest.fn(),
    updateDoc: jest.fn(),
    getFirestore: jest.fn(),
}));

const mockPath = "testPath";
const mockData = { name: "Test" }
const mockDocRef = { id: 'testID'}
const mockCol = {}
const mockDatabase = {};
const mockDocID = "test-ID"

describe('addData', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("add data and return id", async () => {
      const mockColRef = {};
      collection.mockReturnValue(mockColRef)
      addDoc.mockResolvedValue(mockDocRef)
      
      const result = await addData(mockDatabase, mockPath, mockData)

      expect(collection).toHaveBeenCalledWith(mockDatabase, mockPath)
      expect(addDoc).toHaveBeenCalledWith(mockColRef, mockData)
      expect(result).toBe("testID")
    })

    test("incorrect input", async () => {
        const mockColRef = {};
        collection.mockReturnValue(mockColRef)
        addDoc.mockRejectedValue(new Error('Test error'));

        const result = await addData(mockDatabase, mockPath, mockData)
        expect(result).toBe(null)

    })
})

describe('updateData', () => {
    test("update data correctly", async () => {
        doc.mockReturnValue(mockDocRef)

        const result = await updateData(mockDatabase, mockPath, mockData)
        expect(doc).toHaveBeenCalledWith(mockDatabase, mockPath)
        expect(updateDoc).toHaveBeenCalledWith(mockDocRef, mockData)
        expect(result).toBe(true)
    })

    test("update error", async () => {
        const mockDocRef = { id: 'testID'}
        doc.mockReturnValue(mockDocRef)
        updateDoc.mockRejectedValue(new Error('Test error'));
        const result = await updateData(mockDatabase, mockPath, mockData)
        expect(doc).toHaveBeenCalledWith(mockDatabase, mockPath)
        expect(updateDoc).toHaveBeenCalledWith(mockDocRef, mockData)
        expect(result).toBe(false)
    })
})

describe('getData', () => {
    const expected = [{example: "test"}];
    const mockDataSnap = { docs: [{data: () => expected[0]}] }; 

    test("get data correctly", async () => {

        collection.mockReturnValue(mockCol)
        getDocs.mockResolvedValue(mockDataSnap)

        const result = await getData(mockDatabase, mockPath)
        expect(collection).toHaveBeenCalledWith(mockDatabase, mockPath)
        expect(getDocs).toHaveBeenCalledWith(mockCol)
        expect(result).toEqual(expected)
    })

    test("invalid input", async () => {

        collection.mockReturnValue(mockCol)
        getDocs.mockRejectedValue(new Error('Test error'));

        const result = await getData(mockDatabase, mockPath)
        expect(collection).toHaveBeenCalledWith(mockDatabase, mockPath)
        expect(getDocs).toHaveBeenCalledWith(mockCol)
        expect(result).toEqual([])
    })
})

describe('getDataFromDoc', () => {
    const expected = [{example: "test"}];
    const mockDataSnap = {data: () => [expected[0]]}; 

    test("get data correctly", async () => {

        doc.mockReturnValue(mockDocRef)
        getDoc.mockResolvedValue(mockDataSnap)

        const result = await getDataFromDoc(mockDatabase, mockPath, mockDocID)
        expect(doc).toHaveBeenCalledWith(mockDatabase, mockPath, mockDocID)
        expect(getDoc).toHaveBeenCalledWith(mockDocRef)
        expect(result).toEqual(expected)
    })

    test("invalid input", async () => {

        doc.mockReturnValue(mockDocRef)
        getDoc.mockRejectedValue(new Error('Test error'));

        const result = await getDataFromDoc(mockDatabase, mockPath, mockDocID)
        expect(doc).toHaveBeenCalledWith(mockDatabase, mockPath, mockDocID)
        expect(getDoc).toHaveBeenCalledWith(mockDocRef)
        expect(result).toEqual([])
    })
})

describe('room status', () => {

    const mockRoomID = 'TEST-ID'
    const mockRoomIDObject = "\"TEST-ID\""
    const mockRoomLabel = '@roomID'
    
    test('update roomID correctly', async () => {
        const result = await updateRoomIDStatus(mockRoomID)

        expect(AsyncStorage.setItem).toHaveBeenCalledWith(mockRoomLabel, JSON.stringify(mockRoomID))
        expect(result).toBe(true)
    })

    test('get roomID correctly', async () => {
        AsyncStorage.getItem.mockResolvedValue(mockRoomIDObject)
        const result = await getSavedItem('@roomID')

        expect(AsyncStorage.getItem).toHaveBeenCalledWith(mockRoomLabel)
        expect(result).toEqual(mockRoomID)
    })

    test('get roomID incorrect', async () => {
        AsyncStorage.getItem.mockRejectedValue(new Error('Test error'));
        const result = await getSavedItem('@roomID')

        expect(AsyncStorage.getItem).toHaveBeenCalledWith(mockRoomLabel)
        expect(result).toEqual(null)
    })
})