const CourseOffering = require('../src/course-offering');
const Course = require('../src/course');
const Student = require('../src/student');
const Institution = require('../src/institution');
const Instructor = require('../src/instructor');

describe('CourseOffering Class Tests', () => {
  let offering;
  let course;

  beforeEach(() => {
    course = new Course('Software Engineering', 'SER330', 'Software QA', 3);
    offering = new CourseOffering(course, '01', '2024', '1');
  });

  test('Creates a CourseOffering with correct properties', () => {
    expect(offering.course).toBe(course);
    expect(offering.sectionNumber).toBe('01');
    expect(offering.year).toBe('2024');
    expect(offering.quarter).toBe('1');
    expect(offering.registeredStudents).toEqual([]);
    expect(offering.grades).toEqual({});
  });

  test('register_students() adds students to the registeredStudents array', () => {
    const institution = new Institution('Test University', 'test.edu');
    const student1 = new Student('Doe', 'Jane', institution, '1/1/2001', 'jdoe');
    const student2 = new Student('Smith', 'John', institution, '1/1/2002', 'jsmith');

    offering.register_students([student1, student2]);
    expect(offering.registeredStudents.length).toBe(2);
    expect(offering.registeredStudents).toContain(student1);
    expect(offering.registeredStudents).toContain(student2);
  });

  test('submit_grade() and get_grade()', () => {
    const institution = new Institution('Test University', 'test.edu');
    const student = new Student('Doe', 'Jane', institution, '1/1/2001', 'jdoe');

    offering.register_students([student]);
    offering.submit_grade(student, 'A');
    expect(offering.get_grade(student)).toBe('A');
  });

  test('toString() returns formatted offering info', () => {
    const str = offering.toString();
    expect(str).toContain('Software QA');
    expect(str).toContain('SER330-01');
    expect(str).toContain('1 2024');
  });

  test('submit_grade() returns error for invalid grade', () => {
    const student = new Student('Doe', 'Jane', new Institution('Test', 'test.edu'), '1/1/2001', 'jdoe');
    offering.register_students([student]);
    const result = offering.submit_grade(student, 'Z'); // invalid
    expect(result).toBe('Please enter a valid grade');
  });
  
  test('submit_grade() returns error if not a student', () => {
    const result = offering.submit_grade('notAStudent', 'A');
    expect(result).toBe('Please enter a valid grade');
  });
  
  test('get_grade() works when passed a username string', () => {
    const student = new Student('Doe', 'Jane', new Institution('Test', 'test.edu'), '1/1/2001', 'jdoe');
    offering.register_students([student]);
    offering.submit_grade(student, 'B');
  
    const grade = offering.get_grade('jdoe'); // use username string
    expect(grade).toBe('B');
  });
  
  test('toString() includes instructor if assigned', () => {
    const instructor = new Instructor('Smith', 'John', new Institution('Test', 'test.edu'), '1/1/1980', 'jsmith');
    offering.instructor = instructor;
  
    const str = offering.toString();
    expect(str).toContain('John Smith');
  });  

  test('submit_grade() returns error for invalid grade', () => {
    const institution = new Institution('Test University', 'test.edu');
    const student = new Student('Smith', 'John', institution, '1/1/2002', 'jsmith');
    offering.register_students([student]);
  
    const result = offering.submit_grade(student, 'P'); // Invalid grade
    expect(result).toBe('Please enter a valid grade');
  });
  
  test('submit_grade() returns error for non-student object', () => {
    const notAStudent = { userName: 'faker' };
    const result = offering.submit_grade(notAStudent, 'A');
    expect(result).toBe('Please enter a valid grade');
  });
  
  test('get_grade() works with string username', () => {
    const institution = new Institution('Test University', 'test.edu');
    const student = new Student('Taylor', 'Alex', institution, '1/1/2001', 'ataylor');
    offering.register_students([student]);
    offering.submit_grade(student, 'B');
  
    const grade = offering.get_grade('ataylor');
    expect(grade).toBe('B');
  });
  
  test('toString() returns proper string when instructor is null', () => {
    const str = offering.toString();
    expect(str).toContain('Software QA');
    expect(str).not.toContain('Instructor'); // No instructor yet
  });  

  test('submit_grade() returns error if not a Student instance', () => {
    const fakePerson = { userName: 'faker' };
    const result = offering.submit_grade(fakePerson, 'A');
    expect(result).toBe('Please enter a valid grade');
  });
  
  test('toString() returns expected format with no instructor', () => {
    offering.instructor = null;
    const output = offering.toString();
    expect(output).toContain('Software QA');
    expect(output).toContain('SER330-01');
    expect(output).toContain('(1 2024)');
  }); 

  test('register_students() does not crash when a student object is malformed', () => {
    const badStudent = { userName: 'ghost' }; // no courseList
    expect(() => offering.register_students([badStudent])).toThrow();
  });

  test('submit_grade() returns error for invalid student and invalid grade', () => {
    const badInput = { userName: 'ghost' };
    const result = offering.submit_grade(badInput, 'Z');
    expect(result).toBe('Please enter a valid grade');
  });

  test('get_students() returns empty list if no one registered', () => {
    const result = offering.get_students();
    expect(result).toEqual([]);
  });  
});
