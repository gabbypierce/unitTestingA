// Simple Objects
const CourseOffering = require('./course-offering.js')
const Course = require('./course.js')
const Institution = require('./institution.js')
const Instructor = require('./instructor.js')
const Person = require('./person.js')
const Student = require('./student.js')

// Create an institution (of learning)
// Institution
const testInstitution = new Institution('Quinnipiac University', 'qu.edu')

// Create and validate a Person
const testPerson = new Person('lastName', 'firstName', 'test school', '1/1/2024', 'student_username', 'affiliation')
console.log(testPerson.toString())

// Create and validate a Student
// A Student is a Person
// creator of NodeJS
const seniorStudent = new Student('Ryan', 'Dahl', testInstitution, '1/1/2024', 'rdahl')
console.log(seniorStudent.toString())

// Create a Class in the course catalog
const softwareQualityAssuranceCourse = new Course('Software Engineering', 'SER330', 'Software Quality Assurance', 3)

// Create a course offering
// A Course offering is a class that will be offered with a specific section for a specific year
const softwareQualityAssuranceFallCourseOffering = new CourseOffering(softwareQualityAssuranceCourse, '01', '2024', '1')
console.log(softwareQualityAssuranceFallCourseOffering.toString())

const sqaInstructor = new Instructor('Nicolini', 'Dylan', testInstitution, '1/1/2024', 'dnicolini')
console.log(sqaInstructor.toString())

// Confirm the institution methods
// hire an instructor
testInstitution.hire_instructor(sqaInstructor)
testInstitution.list_instructors()

// add courses
testInstitution.add_course(softwareQualityAssuranceCourse)
testInstitution.list_course_catalog()

// enroll students
testInstitution.enroll_student(seniorStudent)
testInstitution.listStudents()

// add course offering e.g. a course for a specific semester
testInstitution.add_course_offering(softwareQualityAssuranceFallCourseOffering)
testInstitution.register_student_for_course(seniorStudent,
  'Software Quality Assurance',
  'Software Engineering',
  'SER330',
  '01', '2024',
  '1')

testInstitution.list_course_schedule('2024', '1')

console.log(seniorStudent.toString())