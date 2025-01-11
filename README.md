// Base models for extension
abstract model Entity {
    id Int @id @default(autoincrement())
}

abstract model TimeStamps {
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt
}

// System user
model SysUser extends TimeStamps {
    user   User    @relation(fields: [userId], references: [id])
    userId Int     @unique

    role   String? // ceo, etc.

    @@allow('create', role == "ceo")
    @@allow('read', true)
    @@deny('update', true)
    @@deny('delete', true)
}

// Tenant
model School extends Entity, TimeStamps {
    name        String
    email       String       @unique @email
    address     String
    phone       String
    logo        String?

    schoolUsers SchoolUser[]
    subjects    Subject[]

    // System users to create or register schools
    @@allow('create', auth() != null && auth().role == "ceo")
    @@allow('read', schoolUsers? auth() != null)
    @@allow('update', schoolUsers? auth() != null)
    @@deny('delete', true)
}

model User extends Entity, TimeStamps {
    username    String       @unique @length(min: 4, max: 8)
    password    String       @omit @password

    schoolUsers SchoolUser[]
    sysUsers    SysUser[]

    @@allow('create', true)
    @@allow('read', auth().id == id || sysUsers? auth() != null)
    @@deny('update', true)
    @@deny('delete', true)
}

model SchoolUser {
    school   School    @relation(fields: [schoolId], references: [id])
    schoolId Int
    user     User      @relation(fields: [userId], references: [id])
    userId   Int

    role     String? // school, student, staff, parent

    @@unique([userId, schoolId])

    students Student[]
    staff    Staff[]

    @@allow('create', school.schoolUsers? auth() != null)
    @@allow('read', school.schoolUsers? auth() != null)
    @@allow('update', school.schoolUsers? auth() != null && auth().role == "admin")
    @@deny('delete', true)
}

model Student extends TimeStamps {
    schoolUser  SchoolUser @relation(fields: [id], references: [userId])
    id          Int        @unique
    classRoom   ClassRoom  @relation(fields: [classRoomId], references: [id])
    classRoomId Int

    firstName   String
    lastName    String
    surname     String?
    gender      String
    dateOfBirth String

    parents     Parent[]

    @@unique([classRoomId, id])
    @@allow('read', schoolUser.school.schoolUsers? auth() != null)
    @@allow('update', schoolUser.school.schoolUsers? auth() != null && auth().role == "staff")
    @@deny('delete', true)
}

model Staff extends TimeStamps {
    schoolUser       SchoolUser    @relation(fields: [schoolUserId], references: [userId])
    schoolUserId     Int           @unique
    role             String        @default("NON-TEACHING")

    teachers         Teacher[]
    nonTeachingStaff NonTeaching[]

    @@allow('read', schoolUser.school.schoolUsers? auth() != null)
    @@allow('update', schoolUser.school.schoolUsers? auth() != null && auth().role == "admin")
    @@deny('delete', true)
}

// Teaching staff
model Teacher extends TimeStamps {
    staff      Staff                 @relation(fields: [id], references: [schoolUserId])
    id         Int                   @unique

    name       String
    email      String
    phone      String

    profession SubjectTeacher[]

    classRoom  ClassRoom[]
    subjects   SubjectClassTeacher[]

    @@allow('read', staff.schoolUser.school.schoolUsers? auth() != null)
    @@allow('update', staff.schoolUser.school.schoolUsers? auth() != null && auth().role == "admin")
    @@deny('delete', true)
}

// Non-teaching staff
model NonTeaching extends TimeStamps {
    staff Staff   @relation(fields: [id], references: [schoolUserId])
    id    Int     @unique

    name  String
    email String?
    phone String

    role  String

    @@allow('read', staff.schoolUser.school.schoolUsers? auth() != null)
    @@deny('update', true)
    @@deny('delete', true)
}

model Parent extends Entity, TimeStamps {
    student   Student @relation(fields: [studentId], references: [id])
    studentId Int
    privilege String  @default('primary')
    phone     String  @unique
    email     String?

    @@allow('read', student.schoolUser.school.schoolUsers? auth() != null)
    @@allow('update', student.schoolUser.school.schoolUsers? auth() != null && auth().role == "admin")
    @@deny('delete', true)
}

model ClassRoom extends Entity, TimeStamps {
    title           String?
    slug            String                @unique

    classTeacher    Teacher               @relation(fields: [classTeacherId], references: [id])
    classTeacherId  Int

    students        Student[]
    subjectTeachers SubjectClassTeacher[]
    timetable       ClassTimetable[]

    @@allow('read', classTeacher.staff.schoolUser.school.schoolUsers? auth() != null)
    @@deny('update', true)
    @@deny('delete', true)
}

model Subject {
    subjectId            Int                   @unique
    name                 String
    school               School                @relation(fields: [schoolId], references: [id])
    schoolId             Int

    classSubjectTeachers SubjectClassTeacher[]
    teachers             SubjectTeacher[]

    @@allow('read', school.schoolUsers? auth() != null)
    @@deny('update', true)
    @@deny('delete', true)
}

model ClassTimetable {
    classRoom   ClassRoom @relation(fields: [classRoomId], references: [id])
    classRoomId Int       @unique

    slots       Json

    @@allow('read', classRoom.classTeacher.staff.schoolUser.school.schoolUsers? auth() != null)
    @@deny('update', true)
    @@deny('delete', true)
}


Suggested Roles for SysUser
CEO

Has the highest level of access and permissions.
Can manage system-wide configurations, including creating and managing schools, users, and other system entities.
Responsible for strategic decisions like onboarding new tenants (schools).
ADMIN

Manages operational tasks for the SaaS platform.
Handles user account approvals, system updates, and configurations.
Can oversee SysUser and SchoolUser roles but has limited authority compared to the CEO.
IT_SUPPORT

Handles technical support for schools and other users.
Troubleshoots system issues, resolves tickets, and provides onboarding support for new users.
Limited access to sensitive user data.
AUDITOR

Can review system logs, transactions, and user activities.
Ensures compliance with policies and identifies security or operational issues.
Has read-only access to most data.
SUPER_USER

A catch-all role with elevated permissions for special tasks.
Can step in for any role to address critical issues (e.g., high-priority troubleshooting).
Typically used during emergencies or when another role is unavailable.
DEVELOPER

Used for internal development and testing of the SaaS platform.
Access to development and staging environments.
Has restricted access to production data and operations.
FINANCE

Manages financial operations, including subscription payments and billing for tenants.
Can access invoices, financial reports, and user payment data.
TENANT_CREATOR

Specifically tasked with registering new schools (tenants) in the system.
Limited to onboarding-related activities and cannot modify existing records.
MARKETER

Focused on promotional tasks like generating leads for the SaaS platform.
Limited access to sensitive data, primarily read-only access to public-facing data (e.g., number of schools, registered users, etc.).
DISABLED_USER

A placeholder role for deactivated users.
Cannot perform any actions in the system until reactivated by an ADMIN or CEO.
Implementation in Schema
Add these roles to the role field of the SysUser model:

prisma
Copy code
model SysUser extends TimeStamps {
    user   User    @relation(fields: [userId], references: [id])
    userId Int     @unique

    role   String  // ceo, admin, it_support, etc.
}
Role Policies
For example:

CEO: Full access.
ADMIN: Can manage most entities except roles like CEO.
IT_SUPPORT: Limited access to technical data only.
TENANT_CREATOR: Can only create School and assign users to schools.
These roles ensure a clear hierarchy and separation of responsibilities. Let me know if you need detailed policies for each role!

Updated Teacher Model
Add a title field to the Teacher model to reflect their specific administrative role (e.g., "Principal," "Deputy Principal," etc.), and retain the role field for additional academic or teaching-related distinctions.

prisma
Copy code
model Teacher extends TimeStamps {
    staff      Staff                 @relation(fields: [id], references: [schoolUserId])
    id         Int                   @unique

    name       String
    email      String
    phone      String

    title      String?               // Principal, Deputy Principal, etc.
    role       String @default("TEACHER") // Default teaching role

    profession SubjectTeacher[]

    // Classroom's class teacher
    classRoom  ClassRoom[]
    // Subjects taught by this teacher in different classes
    subjects   SubjectClassTeacher[]
}
Suggested Titles and Roles for Teachers
Administrative Titles
Principal
Head of the school, oversees all academic and administrative functions.
Default administrative role.
Deputy Principal
Assists the Principal, often manages disciplinary matters and staff oversight.
Head of Department (HOD)
Manages a specific department (e.g., Mathematics, Science, Languages).
Class Teacher
Responsible for managing a specific class and handling student-related issues.
Subject Lead
Oversees curriculum and quality assurance for a particular subject.
Academic Roles
Senior Teacher
Experienced teacher with additional mentoring responsibilities.
Regular Teacher
Default teaching role, focuses on delivering lessons and grading.
Trainee Teacher
A teacher undergoing training or probation.
Implementation of Roles/Policies in ZenStack
You can enforce policies based on the teacher's title or role field. For example:

Principal: Full access to manage ClassRoom, Subject, and Student entities.
HOD: Restricted to managing subjects and teachers within their department.
Class Teacher: Limited access to students and classroom-specific data.
Regular Teacher: Can only access their assigned ClassRoom and Subject entities.
prisma
Copy code
@@allow('read', title in ["Principal", "Deputy Principal", "HOD", "Class Teacher"])
@@allow('update', title in ["Principal", "Deputy Principal"])
@@deny('delete', title != "Principal")
Updating the ClassRoom Model
Since certain titles like "Principal" and "Deputy Principal" aren't tied to a specific class, but "Class Teacher" is, you can enforce relationships or policies in the ClassRoom model:

prisma
Copy code
model ClassRoom extends Entity, TimeStamps {
    title           String?
    slug            String                @unique

    classTeacher    Teacher               @relation(fields: [classTeacherId], references: [id])
    classTeacherId  Int

    // Class members
    students        Student[]
    // Class subject teachers
    subjectTeachers SubjectClassTeacher[]
    // Class timetable
    timetable       ClassTimetable[]

    @@allow('update', classTeacher.title == "Class Teacher")
}
Policy-Based Example
If you want to enforce administrative distinctions:

Principal and Deputy Principal: Full school-wide access.
HOD: Access limited to their department or subjects.
Class Teacher: Access limited to their own class.
This structure ensures clear responsibilities and privileges for each title and role. Let me know if you'd like help enforcing these roles further!