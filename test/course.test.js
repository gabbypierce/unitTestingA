const Course = require('../src/course');

describe('Course Class Tests', () => {
  test('Creates a Course with correct properties', () => {
    const course = new Course('Software Engineering', 'SER330', 'Software QA', 3);
    expect(course.department).toBe('Software Engineering');
    expect(course.number).toBe('SER330');
    expect(course.name).toBe('Software QA');
    expect(course.credits).toBe(3);
  });

  test('toString() returns formatted course info', () => {
    const course = new Course('Software Engineering', 'SER330', 'Software QA', 3);
    const str = course.toString();
    expect(str).toContain('Software Engineering');
    expect(str).toContain('SER330');
    expect(str).toContain('Software QA');
    expect(str).toContain('3'); 
  });
});
