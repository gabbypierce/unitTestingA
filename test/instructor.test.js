const Instructor = require('../src/instructor');
const Institution = require('../src/institution');
const Course = require('../src/course');
const CourseOffering = require('../src/course-offering');

describe('Instructor Class Tests', () => {
  const school = new Institution('Quinnipiac University', 'qu.edu');

  test('toString returns the correct format', () => {
    const instructor = new Instructor('Doe', 'John', school, '1990-01-01', 'jdoe');
    const output = instructor.toString();

    expect(output).toContain('Instructor Name: John Doe');
    expect(output).toContain('School: Quinnipiac University');
    expect(output).toContain('Username: jdoe');
  });

  test('Instructor constructor assigns affiliation and properties correctly', () => {
    const instructor = new Instructor('Taylor', 'Alex', school, '1985-05-01', 'ataylor');
    expect(instructor.lastName).toBe('Taylor');
    expect(instructor.firstName).toBe('Alex');
    expect(instructor.userName).toBe('ataylor');
    expect(instructor.affiliation).toBe('instructor');
    expect(instructor.school).toBe(school);
  });

  test('list_courses() returns all courses when no filters are provided', () => {
    const instructor = new Instructor('Lee', 'Sam', school, '1990-01-01', 'slee');
    const course = new Course('CS', '101', 'Intro to CS', 3);
    const offering = new CourseOffering(course, '01', '2024', '1');

    instructor.course_list.push(offering);
    const courses = instructor.list_courses();
    expect(courses.length).toBe(1);
    expect(courses[0]).toContain('Intro to CS');
  });

  test('list_courses() filters by year only', () => {
    const instructor = new Instructor('Brown', 'Charlie', school, '1988-02-01', 'cbrown');
    const course1 = new Course('CS', '102', 'Data Structures', 3);
    const course2 = new Course('CS', '103', 'Algorithms', 3);

    const offering1 = new CourseOffering(course1, '01', '2024', '2');
    const offering2 = new CourseOffering(course2, '01', '2023', '2');

    instructor.course_list.push(offering1, offering2);
    const result = instructor.list_courses('2024');
    expect(result.length).toBe(1);
    expect(result[0]).toContain('Data Structures');
  });

  test('list_courses() filters by quarter only', () => {
    const instructor = new Instructor('Miller', 'Jordan', school, '1991-03-01', 'jmiller');
    const course1 = new Course('CS', '104', 'Databases', 3);
    const course2 = new Course('CS', '105', 'Networking', 3);

    const offering1 = new CourseOffering(course1, '01', '2024', '1');
    const offering2 = new CourseOffering(course2, '01', '2024', '2');

    instructor.course_list.push(offering1, offering2);
    const result = instructor.list_courses(null, '2');
    expect(result.length).toBe(1);
    expect(result[0]).toContain('Networking');
  });

  test('list_courses() filters by both year and quarter', () => {
    const instructor = new Instructor('Kim', 'Soo', school, '1992-04-01', 'skim');
    const course1 = new Course('CS', '106', 'Machine Learning', 3);
    const course2 = new Course('CS', '107', 'AI Ethics', 3);

    const offering1 = new CourseOffering(course1, '01', '2024', '1');
    const offering2 = new CourseOffering(course2, '01', '2024', '2');

    instructor.course_list.push(offering1, offering2);
    const result = instructor.list_courses('2024', '1');
    expect(result.length).toBe(1);
    expect(result[0]).toContain('Machine Learning');
  });

  test('list_courses() returns empty list if no match for filter', () => {
    const instructor = new Instructor('Park', 'Min', school, '1995-05-01', 'mpark');
    const course = new Course('CS', '108', 'Cloud Computing', 3);
    const offering = new CourseOffering(course, '01', '2023', '2');

    instructor.course_list.push(offering);
    const result = instructor.list_courses('2025', '1');
    expect(result.length).toBe(0);
  });

  test('list_courses() returns all courses when no filters are passed (default case)', () => {
    const instructor = new Instructor('Grant', 'Ellie', school, '1992-06-01', 'egrant');
    const course1 = new Course('CS', '109', 'Cybersecurity', 3);
    const course2 = new Course('CS', '110', 'Web Dev', 3);
  
    const offering1 = new CourseOffering(course1, '01', '2023', '3');
    const offering2 = new CourseOffering(course2, '01', '2022', '4');
  
    instructor.course_list.push(offering1, offering2);
  
    const result = instructor.list_courses(); // no filters!
    expect(result.length).toBe(2);
    expect(result[0]).toContain('Cybersecurity');
    expect(result[1]).toContain('Web Dev');
  });  
});
