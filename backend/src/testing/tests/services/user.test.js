import { testExports } from '../../../services/user';
import { ValidationError } from '../../../types';
const {parsePassword, parseUsername, toNewUser } = testExports;


describe('password validation works', () => {
    it('with testpass', () => {
        expect(parsePassword("testpass")).toBe("testpass");

    });
    it('error with too short pass', () => {
        expect(() => parsePassword("as")).toThrow(ValidationError);
    });
    it('error with too long pass', () => {
        expect(() => parsePassword("czcSDASDQEFESDSDFatrhfgdsdgsdfgsdfsdgsgsg")).toThrow(ValidationError);
    });
    it('error with non-string value', () => {
        expect(() => parsePassword(4)).toThrow(ValidationError);
    });
});

describe('username validation works', () => {
    it('with testpass', () => {
        expect(parseUsername("testuser")).toBe("testuser");

    });
    it('error with too short pass', () => {
        expect(() => parseUsername("as")).toThrow(ValidationError);
    });
    it('error with too long pass', () => {
        expect(() => parseUsername("czcSDASDQEFESDSDFatrhfgdsdgsdfgsdfsdgsgsg")).toThrow(ValidationError);
    });
    it('error with non-string value', () => {
        expect(() => parseUsername(123)).toThrow(ValidationError);
    });
});

describe('toNewUser works', () => {
    it('works with correct data', () => {
        toNewUser("testuser", "testpass").then(response => {
            expect(response.username).toBe('testuser');
            expect(response.password).toBeDefined();
            expect(response.strictAccents).toBe(false);
        });
    });

    it('fails with incorrect data', async () => {
        await expect(toNewUser("te", "testpass")).rejects.toThrow(ValidationError);
    });
});

