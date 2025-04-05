const Student = require('../src/student');
const Institution = require('../src/institution');
const CourseOffering = require('../src/course-offering');
const Course = require('../src/course');

describe('Student Class Tests', () => {
  let testInstitution;
  let student;

  beforeEach(() => {
    testInstitution = new Institution('Test University', 'test.edu');
    student = new Student('Doe', 'Jane', testInstitution, '1/1/2001', 'jdoe');
  });

  test('Creates a Student with correct properties', () => {
    expect(student.lastName).toBe('Doe');
    expect(student.firstName).toBe('Jane');
    expect(student.school).toBe(testInstitution);
    expect(student.dateOfBirth.toLocaleDateString('en-US')).toBe('1/1/2001');
    expect(student.userName).toBe('jdoe');
    // By default, courseList should be empty:
    expect(student.courseList).toEqual([]);
  });

  test('Registers for a course offering and updates courseList', () => {
    const testCourse = new Course('Software Engineering', 'SER330', 'Software QA', 3);
    const offering = new CourseOffering(testCourse, '01', '2024', '1');

    // In a real scenario, the Institution would register the student
    // But you can test the Student side by manually pushing or calling a method
    student.courseList.push(offering);

    expect(student.courseList.length).toBe(1);
    expect(student.courseList[0]).toBe(offering);
  });

  test('Calculates credits correctly', () => {
    // Add multiple offerings with different credit courses
    const course1 = new Course('Software Engineering', 'SER330', 'Software QA', 3);
    const offering1 = new CourseOffering(course1, '01', '2024', '1');

    const course2 = new Course('Math', 'MATH101', 'Calculus', 4);
    const offering2 = new CourseOffering(course2, '02', '2024', '1');

    student.courseList.push(offering1, offering2);

    // Student.credits typically sums the credits of the courses in courseList
    expect(student.credits).toBe(3 + 4);
  });

  test('Computes GPA correctly', () => {
    const course1 = new Course('Software Engineering', 'SER330', 'Software QA', 3);
    const course2 = new Course('Math', 'MATH101', 'Calculus', 4);
    const offering1 = new CourseOffering(course1, '01', '2024', '1');
    const offering2 = new CourseOffering(course2, '02', '2024', '1');
  
    offering1.register_students([student]);
    offering2.register_students([student]);
  
    offering1.submit_grade(student, 'A'); // 4.0
    offering2.submit_grade(student, 'B'); // 3.0
  
    student.courseList.push(offering1, offering2);
  
    const gpa = student.gpa;
    expect(gpa).toBeCloseTo(3.428, 2); // (4.0*3 + 3.0*4) / 7
  });  

  test('toString() includes GPA and credit details', () => {
    const str = student.toString();
    expect(str).toContain('Doe');
    expect(str).toContain('Jane');
    expect(str).toContain('Credits:'); // or however your code prints it
    expect(str).toContain('GPA:');
  });

  test('list_courses() returns sorted course keys from transcript', () => {
    student.transcript = {
      'SER330-01-2024-1': 'A',
      'MATH101-02-2023-2': 'B'
    };
    const result = student.list_courses();
    expect(result).toEqual(['SER330-01-2024-1', 'MATH101-02-2023-2']);
  });
  
  test('gpa returns 0 when no grades have been submitted', () => {
    const course = new Course('Software Engineering', 'SER330', 'Software QA', 3);
    const offering = new CourseOffering(course, '01', '2024', '1');
    student.courseList.push(offering); // no grade submitted
  
    expect(student.gpa).toBe(0);
  });
  
  test('gpa returns 0 when courseList is empty', () => {
    expect(student.gpa).toBe(0);
  });  

  test('credits returns 0 when courseList is empty', () => {
    expect(student.credits).toBe(0);
  });
  
  test('toString() works even if transcript is empty', () => {
    const output = student.toString();
    expect(output).toContain('Student Name: Jane Doe');
    expect(output).toContain('Credits: 0');
    expect(output).toContain('GPA: 0');
  });  

  test('gpa handles single course with valid grade', () => {
    const course = new Course('CS', '101', 'Intro to CS', 3);
    const offering = new CourseOffering(course, '01', '2024', '1');
    offering.register_students([student]);
    offering.submit_grade(student, 'B+');
    student.courseList.push(offering);
  
    expect(student.gpa).toBeCloseTo(3.33, 2);
  });
  
  test('gpa handles multiple grades correctly', () => {
    const course1 = new Course('CS', '102', 'Data Structures', 3);
    const course2 = new Course('CS', '103', 'Algorithms', 4);
  
    const offering1 = new CourseOffering(course1, '01', '2024', '1');
    const offering2 = new CourseOffering(course2, '01', '2024', '1');
  
    offering1.register_students([student]);
    offering2.register_students([student]);
  
    offering1.submit_grade(student, 'A');
    offering2.submit_grade(student, 'C');
  
    student.courseList.push(offering1, offering2);
  
    const expectedGPA = ((4.0 * 3) + (2.0 * 4)) / (3 + 4); // = 2.857
    expect(student.gpa).toBeCloseTo(expectedGPA, 2);
  });
  
  test('list_courses() returns empty array if no transcript', () => {
    student.transcript = {};
    expect(student.list_courses()).toEqual([]);
  });  

  test('gpa returns 0 if grade is not in gradeScale', () => {
    const course = new Course('Art', 'ART101', 'Painting', 3);
    const offering = new CourseOffering(course, '01', '2024', '1');
    offering.register_students([student]);
    offering.grades[student.userName] = 'P'; // not in scale
  
    student.courseList.push(offering);
    expect(student.gpa).toBe(0);
  });
  
  test('gpa skips offerings with no grade', () => {
    const course = new Course('Bio', 'BIO101', 'Biology', 4);
    const offering = new CourseOffering(course, '01', '2024', '1');
    offering.register_students([student]);
    // no grade submitted
  
    student.courseList.push(offering);
    expect(student.gpa).toBe(0);
  });
  
  test('toString() includes all student details', () => {
    const output = student.toString();
    expect(output).toContain('Student Name: Jane Doe');
    expect(output).toContain('School: Test University');
    expect(output).toContain('Username: jdoe');
    expect(output).toContain('Email: jdoe@test.edu');
    expect(output).toContain('GPA: 0');
    expect(output).toContain('Credits: 0');
  });
  
  test('Student constructor correctly assigns affiliation', () => {
    const s = new Student('Pierce', 'Gabby', testInstitution, '1/1/2002', 'gpierce');
    expect(s.affiliation).toBe('student');
  });
  
});
