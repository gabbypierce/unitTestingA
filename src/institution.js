const Course = require('./course.js');
const Student = require('./student.js');
const CourseOffering = require('./course-offering.js');
const Instructor = require('./instructor.js');

class Institution {
  constructor(name, domain) {
    this.name = name;
    this.domain = domain;
    this.studentList = {};
    this.courseCatalog = {};
    this.courseSchedule = {};
    this.facultyList = {};
  }

  listStudents() {
    console.log(`\nEnrolled Students (${this.name})\n-------------------------------------------`);
    const studentList = Object.values(this.studentList).map(student => `${student.lastName}, ${student.firstName}`);
    const sortedStudentList = studentList.sort();
    sortedStudentList.forEach(student => console.log(student));
    console.log('\n');
  }

  enroll_student(student) {
    if (student instanceof Student) {
      if (student.userName in this.studentList) {
        console.log(`${student.firstName} ${student.lastName} is already enrolled!`);
      } else {
        this.studentList[student.userName] = student;
      }
    } else {
      throw new TypeError('Only accepts student object');
    }
  }

  register_student_for_course(student, courseName, dept, number, sectionNumber, year, quarter) {
    const offerings = this.courseSchedule[courseName];
    if (!offerings) return;

    for (const offering of offerings) {
      if (
        dept === offering.course.department &&
        number === offering.course.number &&
        year === offering.year &&
        quarter === offering.quarter &&
        sectionNumber === offering.sectionNumber
      ) {
        if (student.userName in this.studentList) {
          if (offering.registeredStudents.includes(student)) {
            console.log(`${student.firstName} ${student.lastName} is already enrolled in this course`);
          } else {
            offering.register_students([student]);
          }
        }
      }
    }
  }

  list_instructors() {
    console.log(`\nInstructor List (${this.name})\n-------------------------------------------`);
    const facultyList = Object.values(this.facultyList).map(instructor => `${instructor.lastName}, ${instructor.firstName}`);
    const sortedFacultyList = facultyList.sort();
    sortedFacultyList.forEach(instructor => console.log(instructor));
    console.log('\n');
  }

  hire_instructor(instructor) {
    if (instructor instanceof Instructor) {
      if (instructor.userName in this.facultyList) {
        console.log(`${instructor.firstName} ${instructor.lastName} already works at this institution!`);
      } else {
        this.facultyList[instructor.userName] = instructor;
      }
    } else {
      throw new TypeError('Only accepts instructor object');
    }
  }

  assign_instructor(instructor, courseName, dept, number, sectionNumber, year, quarter) {
    const offerings = this.courseSchedule[courseName];
    if (!offerings) {
      console.log('Course not found. Please create a course and course offering.');
      return;
    }

    for (const offering of offerings) {
      if (
        dept === offering.course.department &&
        number === offering.course.number &&
        year === offering.year &&
        quarter === offering.quarter &&
        sectionNumber === offering.sectionNumber
      ) {
        if (offering.instructor === instructor) {
          console.log(`${instructor.firstName} ${instructor.lastName} is already teaching this course`);
        } else {
          offering.instructor = instructor;
          instructor.course_list.push(offering);
          console.log(`${instructor.firstName} ${instructor.lastName} has been assigned to teach ${offering}`);
        }
        return;
      }
    }

    console.log('Matching course offering not found.');
  }

  list_course_catalog() {
    console.log(`\nCourse Catalog (${this.name})\n----------------------------------------`);
    for (const course of Object.values(this.courseCatalog)) {
      console.log(course.toString());
    }
    console.log('\n');
  }

  list_course_schedule(year, quarter, dept = null) {
    const schedule = [];

    console.log(`\nCourse Schedule (${dept ? dept + ', ' : ''}${quarter} ${year})\n----------------------------------------`);

    for (const offerings of Object.values(this.courseSchedule)) {
      const filtered = offerings.filter(offering =>
        offering.year === year &&
        offering.quarter === quarter &&
        (!dept || offering.course.department === dept)
      );
      filtered.forEach(item => schedule.push(item.toString()));
    }

    if (schedule.length) {
      schedule.forEach(item => console.log(item));
    } else {
      console.log('No offerings during this semester');
    }
  }

  list_registered_students(courseName, dept, number, sectionNumber, year, quarter) {
    const offerings = this.courseSchedule[courseName];
    if (!offerings) return;

    for (const offering of offerings) {
      if (
        dept === offering.course.department &&
        number === offering.course.number &&
        year === offering.year &&
        quarter === offering.quarter &&
        sectionNumber === offering.sectionNumber
      ) {
        console.log(`Registered Students List (${offering})\n------------------------------------------------------------`);
        for (const student of offering.registeredStudents) {
          console.log(`${student.lastName}, ${student.firstName}`);
        }
      }
    }
  }

  add_course(course) {
    if (course instanceof Course) {
      if (course.name in this.courseCatalog) {
        return 'Course has already been added';
      } else {
        this.courseCatalog[course.name] = course;
      }
    } else {
      throw new TypeError('Only accepts course object as argument');
    }
  }

  add_course_offering(courseOffering) {
    if (courseOffering instanceof CourseOffering) {
      if (courseOffering.course.name in this.courseCatalog) {
        this.courseSchedule[courseOffering.course.name] =
          this.courseSchedule[courseOffering.course.name] || [];
        this.courseSchedule[courseOffering.course.name].push(courseOffering);
      } else {
        return 'Please create a course before creating course offering';
      }
    } else {
      throw new TypeError('Only accepts course offering as argument');
    }
  }
}

module.exports = Institution;
