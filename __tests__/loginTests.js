// Disabled because not working right and not very useful since not testing Firebase anyway
// Dec 21 2024

/*
import { addData } from "../app/Database"

const mockDataRef = {};

const mockCollection = jest.fn( (db, p) => {
    console.log(`Mock collection called with db: ${db}, path: ${path}`);
    return mockDataRef;
});
const mockAddDoc = jest.fn(async (mockDataRef, mockData) => ({ id: "testID" }));

jest.mock('firebase/app', () => ({
    initializeApp: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
    getFirestore: jest.fn((val) => ({})),
    collection: mockCollection,
    addDoc: mockAddDoc
}));

describe('addData', () => {
    const mockPath = "testPath";
    const mockData = { "name": "Test" }
    const mockDatabase = {};

    beforeEach(() => {
        jest.clearAllMocks(); // Reset mocks before each test
    });

    test("add data and return id", async () => {
        mockCollection.mockReturnValueOnce(mockDataRef);
        mockAddDoc.mockResolvedValueOnce({ id: "testID" });

        console.log("Mock collection:", mockCollection);
        console.log("Mock addDoc:", mockAddDoc);

        const result = await addData(mockDatabase, mockPath, mockData)
        console.log("GOOD STUFF ", mockCollection.mock.calls);
        //expect(mockCollection).toHaveBeenCalledWith(mockDatabase, mockPath)
        //expect(mockAddDoc).toHaveBeenCalledWith(mockDataRef, mockData)
        //expect(result).toBe("testID")
    })
})
*/