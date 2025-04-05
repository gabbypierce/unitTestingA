const Instructor = require('../src/instructor');
const Institution = require('../src/institution');
const Person = require('../src/person');
const Student = require('../src/student');
const Course = require('../src/course');
const CourseOffering = require('../src/course-offering');


describe('Instructor-Tests', () => {

    let testInstitution;
    let instructor;

    // This will run before each test case 
    // Initialize a new institution instance and instructor
    beforeEach(() => {
        instructor = new Instructor();
        testInstitution = new Institution('Test University', 'test.edu');
    });

    test('GivenAValidInstructor_AllConditionsMet_HiresANewInstructor', () => {
        // Arrange
        const testInstitution = new Institution('Quinnipiac University', 'qu.edu')
        const sqaInstructor = new Instructor('Nicolini', 'Dylan', testInstitution, '1/1/2024', 'dnicolini')

        // Act
        testInstitution.hire_instructor(sqaInstructor)

        // Assert
        // Using the Object.Keys function we can extract an array of the keys for the
        // faculty dictionary.
        // This allows us to verify that there is 1 and only 1 value in the faculty list
        expect(Object.keys(testInstitution.facultyList).length).toBe(1)

        // Another option to verify that the value matching the dictionary
        // is equal
        // The behavior you are validating here is that the method adds the right person
        expect(Object.keys(testInstitution.facultyList)).toStrictEqual(['dnicolini'])
    })

    test('GivenAValidInstructor_VerifiesDuplicateInstructor_DoesNotAddDuplicate', () => {
        // Arrange
        const testInstitution = new Institution('Quinnipiac University', 'qu.edu')
        const sqaInstructor = new Instructor('Nicolini', 'Dylan', testInstitution, '1/1/2024', 'dnicolini')

        // Act
        testInstitution.hire_instructor(sqaInstructor)

        // This behavior is a bit sneaky because it simply logs the error and doesn't throw an error
        // or report the behavior
        // You generally can't assert against log statements - so our test expectations are the same
        testInstitution.hire_instructor(sqaInstructor)

        // Assert
        expect(Object.keys(testInstitution.facultyList).length).toBe(1)
        expect(Object.keys(testInstitution.facultyList)).toStrictEqual(['dnicolini'])
    })

    test('GivenAnInvalidInstructory_AttemptsToHireInstructor_ThrowsError', () => {
        // Arrange
        const testInstitution = new Institution('Quinnipiac University', 'qu.edu')
        let testPerson = new Person('lastName', 'firstName', 'test school', '1/1/2024', 'student_username', 'affiliation')

        // Combines the act and assertion to validate the error was thrown
        expect(() => testInstitution.hire_instructor(testPerson)).toThrowError(TypeError)
    })

    test('listStudents() prints sorted student names', () => {
        const studentA = new Student('Apple', 'Anna', testInstitution, '1/1/2001', 'anna');
        const studentB = new Student('Banana', 'Ben', testInstitution, '1/1/2001', 'ben');
        testInstitution.enroll_student(studentB);
        testInstitution.enroll_student(studentA);

        console.log = jest.fn(); // mock console
        testInstitution.listStudents();

        expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Apple, Anna'));
        expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Banana, Ben'));
    });

    test('add_course_offering() fails if course is not in catalog', () => {
        const course = new Course('History', 'HIST100', 'World History', 3);
        const offering = new CourseOffering(course, '01', '2024', '1');

        const result = testInstitution.add_course_offering(offering);
        expect(result).toBe('Please create a course before creating course offering');
    });

    test('assign_instructor() fails if course not found', () => {
        const instructor = new Instructor('Smith', 'John', testInstitution, '1/1/1980', 'jsmith');

        console.log = jest.fn();
        testInstitution.assign_instructor(instructor, 'Nonexistent Course', 'Dept', '123', '01', '2024', '1');

        expect(console.log).toHaveBeenCalledWith('Course not found. Please create a course and course offering.');
    });

    test('list_course_schedule() prints message when no offerings', () => {
        console.log = jest.fn();
        testInstitution.list_course_schedule('2024', '1');
        expect(console.log).toHaveBeenCalledWith('No offerings during this semester');
    });

    test('add_course() prevents duplicate courses', () => {
        const course = new Course('English', 'ENG101', 'Intro to Lit', 3);
        testInstitution.add_course(course); // first time

        const result = testInstitution.add_course(course); // second time
        expect(result).toBe('Course has already been added');
    });

    test('list_registered_students() outputs enrolled names', () => {
        const course = new Course('Biology', 'BIO100', 'Intro Bio', 3);
        const offering = new CourseOffering(course, '01', '2024', '1');
        const student = new Student('Lee', 'Sara', testInstitution, '1/1/2001', 'slee');

        testInstitution.add_course(course);
        testInstitution.add_course_offering(offering);
        testInstitution.enroll_student(student);
        testInstitution.register_student_for_course(
            student, 'Intro Bio', 'Biology', 'BIO100', '01', '2024', '1'
        );

        console.log = jest.fn();
        testInstitution.list_registered_students('Intro Bio', 'Biology', 'BIO100', '01', '2024', '1');

        expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Lee, Sara'));
    });

    test('enroll_student throws error if not a Student', () => {
        expect(() => testInstitution.enroll_student({})).toThrow(TypeError);
    });

    test('add_course returns message if course already exists', () => {
        const course = new Course('CS', '101', 'Intro to CS', 3);
        testInstitution.add_course(course);
        const result = testInstitution.add_course(course); // duplicate
        expect(result).toBe('Course has already been added');
    });

    test('add_course throws error if not a Course', () => {
        expect(() => testInstitution.add_course({})).toThrow(TypeError);
    });

    test('add_course_offering throws error if not a CourseOffering', () => {
        expect(() => testInstitution.add_course_offering({})).toThrow(TypeError);
    });

    test('assign_instructor logs course not found if course is missing', () => {
        const instructor = new Instructor('Test', 'Prof', testInstitution, '1/1/1980', 'tprof');
        const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
        testInstitution.assign_instructor(instructor, 'Nonexistent', 'CS', '101', '01', '2024', '1');
        expect(consoleSpy.mock.calls.flat()).toContain('Course not found. Please create a course and course offering.');
        consoleSpy.mockRestore();
    });

    test('list_course_schedule logs when no offerings found (dept version)', () => {
        const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
        testInstitution.list_course_schedule('2024', '1', 'CS');
        expect(spy).toHaveBeenCalledWith('No offerings during this semester');
        spy.mockRestore();
    });

    test('assign_instructor assigns when match found and instructor not already assigned', () => {
        const instructor = new Instructor('Jane', 'Doe', testInstitution, '1/1/1980', 'jdoe');
        const course = new Course('Math', 'MATH101', 'Calculus I', 4);
        const offering = new CourseOffering(course, '01', '2024', '1');
    
        testInstitution.add_course(course);
        testInstitution.add_course_offering(offering);
        testInstitution.hire_instructor(instructor);
    
        console.log = jest.fn();
        testInstitution.assign_instructor(instructor, 'Calculus I', 'Math', 'MATH101', '01', '2024', '1');
    
        expect(console.log).toHaveBeenCalledWith(expect.stringContaining('has been assigned to teach'));
    });

    test('assign_instructor logs already teaching when instructor already assigned', () => {
        const instructor = new Instructor('Jane', 'Doe', testInstitution, '1/1/1980', 'jdoe');
        const course = new Course('Math', 'MATH101', 'Calculus I', 4);
        const offering = new CourseOffering(course, '01', '2024', '1');
        offering.instructor = instructor;
    
        testInstitution.add_course(course);
        testInstitution.add_course_offering(offering);
        testInstitution.hire_instructor(instructor);
    
        console.log = jest.fn();
        testInstitution.assign_instructor(instructor, 'Calculus I', 'Math', 'MATH101', '01', '2024', '1');
    
        expect(console.log).toHaveBeenCalledWith('Doe Jane is already teaching this course');
    });

    test('register_student_for_course adds student when all matches and not already registered', () => {
        const course = new Course('CS', '101', 'Intro to Programming', 3);
        const offering = new CourseOffering(course, '01', '2024', '1');
        const student = new Student('Smith', 'Alex', testInstitution, '1/1/2001', 'asmith');
    
        testInstitution.add_course(course);
        testInstitution.add_course_offering(offering);
        testInstitution.enroll_student(student);
    
        console.log = jest.fn();
        testInstitution.register_student_for_course(
            student, 'Intro to Programming', 'CS', '101', '01', '2024', '1'
        );
    
        expect(offering.registeredStudents).toContain(student);
    });
    
    test('register_student_for_course logs if student is already enrolled', () => {
        const course = new Course('CS', '101', 'Intro to Programming', 3);
        const offering = new CourseOffering(course, '01', '2024', '1');
        const student = new Student('Smith', 'Alex', testInstitution, '1/1/2001', 'asmith');
    
        testInstitution.add_course(course);
        testInstitution.add_course_offering(offering);
        testInstitution.enroll_student(student);
        offering.register_students([student]);
    
        console.log = jest.fn();
        testInstitution.register_student_for_course(
            student, 'Intro to Programming', 'CS', '101', '01', '2024', '1'
        );
    
        expect(console.log).toHaveBeenCalledWith('Alex Smith is already enrolled in this course');
    });
    
    test('list_instructors prints sorted instructor names', () => {
        const instructorA = new Instructor('Zeta', 'Alice', testInstitution, '1/1/2000', 'azeta');
        const instructorB = new Instructor('Alpha', 'Bob', testInstitution, '1/1/2000', 'balpha');
    
        testInstitution.hire_instructor(instructorA);
        testInstitution.hire_instructor(instructorB);
    
        console.log = jest.fn();
        testInstitution.list_instructors();
    
        expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Alpha, Bob'));
        expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Zeta, Alice'));
    });
    
    test('list_course_catalog logs all courses in catalog', () => {
        const course1 = new Course('Art', 'ART101', 'Intro to Art', 3);
        const course2 = new Course('Physics', 'PHY101', 'Mechanics', 4);
    
        testInstitution.add_course(course1);
        testInstitution.add_course(course2);
    
        console.log = jest.fn();
        testInstitution.list_course_catalog();
    
        expect(console.log).toHaveBeenCalledWith(course1.toString());
        expect(console.log).toHaveBeenCalledWith(course2.toString());
    });    
});