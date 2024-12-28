import { generateCode } from "../app/Database"

describe('Generate Code', () => {
    test('generates code of correct length', () => {
        const code = generateCode();
        expect(code.length).toBe(5);
    });
    test('correct values', () => {
        const code = generateCode();
        let options = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"
        var correct = true
        code.split('').forEach( (char, index) => {
            if (!code.includes(char)) {
                correct = false
            }
        });

        expect(correct).toBe(true);
    });
})