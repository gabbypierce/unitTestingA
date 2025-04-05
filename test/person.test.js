const Person = require('../src/person');
const Institution = require('../src/institution');

describe('Person Class Tests', () => {
  let testInstitution;
  let person;

  beforeEach(() => {
    testInstitution = new Institution('Test University', 'test.edu');
    person = new Person('Doe', 'John', testInstitution, '1/1/2000', 'jdoe', 'student');
  });

  test('Creates a Person with correct properties', () => {
    expect(person.lastName).toBe('Doe');
    expect(person.firstName).toBe('John');
    expect(person.school).toBe(testInstitution);
    expect(person.dateOfBirth.toLocaleDateString('en-US')).toBe('1/1/2000');
    expect(person.userName).toBe('jdoe');
    expect(person.affiliation).toBe('student');
  });

  test('Generates the correct email address', () => {
    // Person.email is typically a getter in some code bases
    expect(person.email).toBe('jdoe@test.edu');
  });

  test('toString() returns formatted info', () => {
    const output = person.toString();
    expect(output).toContain('Doe');
    expect(output).toContain('John');
    expect(output).toContain('Username: jdoe');
    expect(output).toContain('Affiliation: student');
  });
});
